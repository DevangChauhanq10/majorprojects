"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Stats = {
  totalFeedback: number;
  feedbackByCategory: { name: string; value: number }[];
  timeline: { date: string; count: number }[];
  averageRating: number;
  totalUsers: number; // Passed from parent or fetched separately
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function SystemStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFeedback}</div>
          <p className="text-xs text-muted-foreground">
            Lifetime submissions
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            Out of 5.0
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Registered accounts
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.feedbackByCategory.length}</div>
          <p className="text-xs text-muted-foreground">
            Types of feedback
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Feedback Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 12}}
                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
              />
              <YAxis allowDecimals={false} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.feedbackByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.feedbackByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
