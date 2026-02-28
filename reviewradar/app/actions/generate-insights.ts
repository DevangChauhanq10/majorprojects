'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { FeedbackFilter, FeedbackFilterSchema } from "@/lib/validations";
import { auth } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAIInsights(filters: FeedbackFilter = {}) {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId || (role !== 'admin' && role !== 'analyst')) {
    throw new Error("Unauthorized");
  }

  // Validate filters
  const parsedFilters = FeedbackFilterSchema.safeParse(filters);
  const safeFilters = parsedFilters.success ? parsedFilters.data : {};

  // 1. Fetch Filtered Feedback
  const where: any = {};

  if (safeFilters.search) {
    where.OR = [
      { title: { contains: safeFilters.search, mode: 'insensitive' } },
      { description: { contains: safeFilters.search, mode: 'insensitive' } },
    ];
  }

  if (safeFilters.category && safeFilters.category !== "All") {
    where.category = safeFilters.category;
  }

  if (safeFilters.rating && safeFilters.rating !== "All") {
    where.rating = parseInt(safeFilters.rating);
  }

  if (safeFilters.sentiment && safeFilters.sentiment !== "All") {
    where.sentiment = safeFilters.sentiment;
  }

  if (safeFilters.dateRange && safeFilters.dateRange !== "All") {
    const now = new Date();
    let date = new Date();
    if (safeFilters.dateRange === "7d") date.setDate(now.getDate() - 7);
    if (safeFilters.dateRange === "30d") date.setDate(now.getDate() - 30);
    if (safeFilters.dateRange === "90d") date.setDate(now.getDate() - 90);
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

  
  const totalCount = feedback.length;
  const avgRating = feedback.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0) / totalCount;

  // 2. Construct Prompt

  const feedbackText = feedback.map((f: { category: string; rating: number; title: string; description: string }) => 
    `- [${f.category}] (${f.rating} stars) ${f.title}: ${f.description}`
  ).join("\n");

  const prompt = `
    You are a Senior Product Analyst for ReviewRadar. Analyze this customer feedback data and provide an executive-level intelligence report.
    
    Total Feedback Entries: ${totalCount}
    Average Rating: ${avgRating.toFixed(2)}

    Feedback Data:
    ${feedbackText}

    CRITICAL TONE REQUIREMENTS:
    - Write as an objective, data-driven professional.
    - NEVER use AI filler phrases (e.g., "Based on the data provided," "It seems that," "Users are saying," "I recommend").
    - Use concise, direct language and business terminology.
    - Focus strictly on impact and urgency.
    - Keep descriptions tight (1-2 short sentences max).
    - For recommendations, start with strong action verbs (Implement, Optimize, Investigate).

    Please provide the following insights in valid JSON format:

    1. sentimentBreakdown: 
       - positive: approximate percentage (number)
       - neutral: approximate percentage (number)
       - negative: approximate percentage (number)
    
    2. topIssues: Array of objects with:
       - issue: string (concise title, e.g., "Authentication Latency")
       - frequency: string (e.g., "High", "Medium", "Low" or estimated count)
       - description: string (brief, objective explanation, e.g., "Login times exceed 3s threshold during peak traffic.")

    3. featureRequests: Array of objects with:
       - feature: string (concise title)
       - priority: string ("High", "Medium", "Low")
       - description: string (a short, single line explaining why it is requested)

    4. criticalBugs: Array of objects with:
       - bug: string (concise title)
       - severity: string ("Critical", "High")
       - description: string (tight explanation of the failure mode)

    5. recommendedActions: Array of objects with:
       - action: string (actionable recommendation starting with a verb)
       - priority: string ("High", "Medium", "Low")
       - impactedMetric: string (e.g., "User Retention", "NPS", "Stability")

    Return ONLY the JSON object. Do not format it as a code block.
  `;

  try {
    // 3. Call Gemini API
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
