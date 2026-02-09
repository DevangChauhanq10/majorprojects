'use server'

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Category, Feedback } from "@prisma/client";

export type FeedbackFilter = {
  search?: string;
  category?: Category | "All";
  rating?: string; 
  sentiment?: string; 
  dateRange?: string; 
};

export async function getFeedbackForAnalyst(
  page: number = 1,
  limit: number = 10,
  filters: FeedbackFilter = {}
) {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId || (role !== 'admin' && role !== 'analyst')) {
    throw new Error("Unauthorized");
  }

  const skip = (page - 1) * limit;

 
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

  const [feedback, total] = await Promise.all([
    prisma.feedback.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.feedback.count({ where }),
  ]);

  return { feedback, total, totalPages: Math.ceil(total / limit) };
}

export async function getFeedbackStats() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId || (role !== 'admin' && role !== 'analyst')) {
    throw new Error("Unauthorized");
  }

  const total = await prisma.feedback.count();
  
  const avgRatingAgg = await prisma.feedback.aggregate({
    _avg: { rating: true },
  });
  const avgRating = avgRatingAgg._avg.rating || 0;

  const categoryGroups = await prisma.feedback.groupBy({
    by: ['category'],
    _count: { category: true },
    orderBy: {
      _count: { category: 'desc' }
    },
    take: 1,
  });
  const mostCommonCategory = categoryGroups[0]?.category || "N/A";

  const latest = await prisma.feedback.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  return {
    total,
    avgRating: avgRating.toFixed(1),
    mostCommonCategory,
    latestSubmission: latest?.createdAt,
  };
}


export async function exportFeedbackToCSV(filters: FeedbackFilter = {}) {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
  
    if (!userId || (role !== 'admin' && role !== 'analyst')) {
      throw new Error("Unauthorized");
    }
  
    
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
  
    const feedback = await prisma.feedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  
    // Convert to CSV
    const fields = ['id', 'title', 'description', 'category', 'rating', 'sentiment', 'userId', 'createdAt'];
    const csvContent = [
      fields.join(','),
      ...feedback.map((row: any) => fields.map(field => JSON.stringify(row[field])).join(','))
    ].join('\n');
  
    return csvContent;
  }
