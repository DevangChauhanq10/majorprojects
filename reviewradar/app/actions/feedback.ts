'use server'

import { auth, currentUser } from "@clerk/nextjs/server";
import { sendFeedbackConfirmation, sendCriticalAlert } from "@/app/actions/email";
import { prisma } from "@/lib/prisma"; 
import { revalidatePath } from "next/cache";
import { z } from "zod";

const feedbackSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["Bug", "Feature", "UX", "Performance", "Other"]),
  rating: z.coerce.number().min(0).max(5).default(0),
});

export type FeedbackState = {
  errors?: {
    title?: string[];
    description?: string[];
    category?: string[];
    rating?: string[];
  };
  message?: string;
  success?: boolean;
} | undefined;

export async function createFeedback(prevState: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const { userId } = await auth();
  const user = await currentUser(); // Get full user details for email

  if (!userId || !user) {
    return {
      message: "You must be logged in to submit feedback.",
      success: false,
    };
  }

  const validatedFields = feedbackSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    rating: formData.get('rating'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
      success: false,
    };
  }

  try {
    await prisma.feedback.create({
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        category: validatedFields.data.category,
        rating: validatedFields.data.rating,
        sentiment: "Pending", 
        userId: userId,
      },
    });

    // 1. Send Confirmation Email to User
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (userEmail) {
      await sendFeedbackConfirmation(
        userEmail,
        user.firstName || "User",
        validatedFields.data.title,
        validatedFields.data.category
      );
    }

    // 2. Check for Critical Alert Condition (Admin)
    // Condition: 3+ ratings of 1-2 stars in last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const recentCriticalFeedbackCount = await prisma.feedback.count({
      where: {
        rating: { in: [1, 2] },
        createdAt: { gte: oneDayAgo },
      },
    });

    if (recentCriticalFeedbackCount >= 3) {
      await sendCriticalAlert(recentCriticalFeedbackCount);
    }

    revalidatePath('/dashboard/user');
    return {
      message: "Feedback submitted successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Failed to submit feedback. Please try again.",
      success: false,
    };
  }
}

