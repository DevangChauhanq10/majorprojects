
"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper to ensure admin access
async function ensureAdmin() {
  const { userId, sessionClaims } = await auth();
  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return userId;
}

export async function getUsers() {
  await ensureAdmin();
  const client = await clerkClient();
  const users = await client.users.getUserList({
    orderBy: "-created_at",
    limit: 100, 
  });


  const feedbackCounts = await prisma.feedback.groupBy({
    by: ["userId"],
    _count: {
      id: true,
    },
  });

  const countMap = new Map();
  feedbackCounts.forEach((f) => countMap.set(f.userId, f._count.id));

  return users.data.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses[0]?.emailAddress,
    role: user.publicMetadata.role || "user",
    createdAt: user.createdAt,
    feedbackCount: countMap.get(user.id) || 0,
  }));
}

export async function deleteFeedback(feedbackId: number) {
  const adminId = await ensureAdmin();

  await prisma.feedback.update({
    where: { id: feedbackId },
    data: { deleted: true },
  });

  await prisma.activityLog.create({
    data: {
      action: "DELETE_FEEDBACK",
      details: `Deleted feedback ID: ${feedbackId}`,
      userId: adminId,
    },
  });

  revalidatePath("/dashboard/admin");
}

export async function getSystemStats() {
  await ensureAdmin();

  const [
    totalFeedback,
    feedbackByCategory,
    feedbackOverTime,
    averageRating,
  ] = await Promise.all([
    prisma.feedback.count({ where: { deleted: false } }),
    prisma.feedback.groupBy({
      by: ["category"],
      where: { deleted: false },
      _count: true,
    }),
    prisma.feedback.findMany({
      where: { deleted: false },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.feedback.aggregate({
      where: { deleted: false },
      _avg: { rating: true },
    }),
  ]);
  
  
    // Group feedbackOverTime by date for the line chart
  const timelineMap = new Map<string, number>();
  feedbackOverTime.forEach((f) => {
    const date = f.createdAt.toISOString().split("T")[0];
    timelineMap.set(date, (timelineMap.get(date) || 0) + 1);
  });
  
   const timeline = Array.from(timelineMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalFeedback,
    feedbackByCategory: feedbackByCategory.map((c) => ({
      name: c.category,
      value: c._count,
    })),
    timeline,
    averageRating: averageRating._avg.rating || 0,
  };
}

export async function getRecentActivity() {
  await ensureAdmin();
  
  return await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function getFeedbackList() {
  await ensureAdmin();

  return await prisma.feedback.findMany({
    where: { deleted: false },
    orderBy: { createdAt: "desc" },
    take: 100, 
  });
}
