'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, BarChart3, Clock } from "lucide-react";

interface StatsCardsProps {
  stats: {
    total: number;
    avgRating: string;
    mostCommonCategory: string;
    latestSubmission: Date | undefined;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            All time submissions
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgRating}</div>
          <p className="text-xs text-muted-foreground">
            Out of 5.0
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.mostCommonCategory}</div>
          <p className="text-xs text-muted-foreground">
            Most frequent topic
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Submission</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" suppressHydrationWarning>
            {stats.latestSubmission ? new Date(stats.latestSubmission).toLocaleDateString() : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground" suppressHydrationWarning>
             {stats.latestSubmission ? new Date(stats.latestSubmission).toLocaleTimeString() : 'No data'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
