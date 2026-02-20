'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { FeedbackFilter } from "./analyst";
import { auth } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAIInsights(filters: FeedbackFilter = {}) {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId || (role !== 'admin' && role !== 'analyst')) {
    throw new Error("Unauthorized");
  }

  // 1. Fetch Filtered Feedback
  const where: any = {};

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.category && filters.category !== "All") {
    where.category = filters.category;
  }

  if (filters.rating && filters.rating !== "All") {
    where.rating = parseInt(filters.rating);
  }

  if (filters.sentiment && filters.sentiment !== "All") {
    where.sentiment = filters.sentiment;
  }

  if (filters.dateRange && filters.dateRange !== "All") {
    const now = new Date();
    let date = new Date();
    if (filters.dateRange === "7d") date.setDate(now.getDate() - 7);
    if (filters.dateRange === "30d") date.setDate(now.getDate() - 30);
    if (filters.dateRange === "90d") date.setDate(now.getDate() - 90);
    where.createdAt = { gte: date };
  }

  // Limit to last 100 entries to avoid hitting token limits
  const feedback = await prisma.feedback.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      category: true,
      rating: true,
      title: true,
      description: true,
      sentiment: true,
    }
  });

  if (feedback.length === 0) {
    throw new Error("No feedback found to analyze.");
  }

  // 2. Aggregate Data (Optional, but helpful for context)
  const totalCount = feedback.length;
  const avgRating = feedback.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0) / totalCount;

  // 3. Construct Prompt

  const feedbackText = feedback.map((f: { category: string; rating: number; title: string; description: string }) => 
    `- [${f.category}] (${f.rating} stars) ${f.title}: ${f.description}`
  ).join("\n");

  const prompt = `
    You are a product analyst. Analyze this customer feedback data and provide actionable intelligence.
    
    Total Feedback Entries: ${totalCount}
    Average Rating: ${avgRating.toFixed(2)}

    Feedback Data:
    ${feedbackText}

    Please provide the following insights in valid JSON format:

    1. sentimentBreakdown: 
       - positive: approximate percentage (number)
       - neutral: approximate percentage (number)
       - negative: approximate percentage (number)
    
    2. topIssues: Array of objects with:
       - issue: string (concise title)
       - frequency: string (e.g., "High", "Medium", "Low" or estimated count)
       - description: string (brief explanation)

    3. featureRequests: Array of objects with:
       - feature: string (concise title)
       - priority: string ("High", "Medium", "Low")
       - mentions: number (estimated count)

    4. criticalBugs: Array of objects with:
       - bug: string (concise title)
       - severity: string ("Critical", "High")
       - description: string

    5. recommendedActions: Array of objects with:
       - action: string (actionable recommendation)
       - priority: string ("High", "Medium", "Low")
       - impactedMetric: string (e.g., "User Retention", "NPS", "Stability")

    Return ONLY the JSON object. Do not format it as a code block.
  `;

  try {
    // 4. Call Gemini API
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up potential markdown formatting if Gemini adds it
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const insights = JSON.parse(cleanText);
    return insights;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate insights. Please try again later.");
  }
}
