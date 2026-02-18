import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, CheckCircle2, TrendingUp } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  stats: {
    total: number;
    pending: number;
    resolved: number;
    avgResponseTime: string; // e.g., "1.2 days"
  };
}

export function DashboardHeader({ userName, stats }: DashboardHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back, {userName}
        </h1>
        <p className="text-gray-400">
          Here's an overview of your feedback activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#111111] border-[#222] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Feedback
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">Lifetime submissions</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#222] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pending}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#222] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Resolved
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.resolved}</div>
            <p className="text-xs text-gray-500 mt-1">Issues fixed</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#222] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Avg. Response
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.avgResponseTime}</div>
            <p className="text-xs text-gray-500 mt-1">Response speed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
