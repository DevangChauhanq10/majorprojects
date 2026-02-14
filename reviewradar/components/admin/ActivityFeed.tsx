import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

type ActivityLog = {
  id: number;
  action: string;
  details: string | null;
  userId: string;
  createdAt: Date;
};

export function ActivityFeed({ logs }: { logs: ActivityLog[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex flex-col space-y-1 border-b pb-2 last:border-0 last:pb-0"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{log.action}</p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(log.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {log.details || "No details provided"}
              </p>
              <p className="text-xs text-muted-foreground">User ID: {log.userId}</p>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
