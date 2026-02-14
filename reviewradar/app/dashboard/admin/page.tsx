
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { 
  getUsers, 
  getSystemStats, 
  getRecentActivity, 
  getFeedbackList 
} from "@/app/actions/admin";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { SystemStats } from "@/components/admin/SystemStats";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { FeedbackModeration } from "@/components/admin/FeedbackModeration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck } from "lucide-react";

export default async function AdminDashboard() {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata.role !== 'admin') {
    redirect('/');
  }

  const [users, stats, activityLogs, feedbackList] = await Promise.all([
    getUsers(),
    getSystemStats(),
    getRecentActivity(),
    getFeedbackList()
  ]);

  // Inject user count into stats if needed, or if it was missing
  const fullStats = {
    ...stats,
    totalUsers: users.length
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">System configuration and user management.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm font-semibold border border-rose-100">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Access</span>
        </div>
      </div>
      
      <SystemStats stats={fullStats} />

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="moderation">Feedback Moderation</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
            <UserManagementTable users={users} />
        </TabsContent>
        
        <TabsContent value="moderation" className="mt-6">
            <FeedbackModeration initialFeedback={feedbackList} />
        </TabsContent>
        
        <TabsContent value="activity" className="mt-6">
            <ActivityFeed logs={activityLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
