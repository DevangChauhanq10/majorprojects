import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, MessageSquare, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Stats = {
  totalFeedback: number;
  averageRating: number;
  totalUsers: number;
  recentFeedback: {
    id: number;
    title: string;
    category: string;
    createdAt: Date;
  }[];
};

export function SystemStats({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-6">
      {/* 3 Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeedback}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Out of 5.0 stars</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentFeedback.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <Badge variant="outline">{item.category}</Badge>
              </div>
            ))}
            {stats.recentFeedback.length === 0 && (
               <p className="text-sm text-muted-foreground">No feedback yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
