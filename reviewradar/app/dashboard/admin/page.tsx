import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { 
  getUsers, 
  getSystemStats, 
  getFeedbackList 
} from "@/app/actions/admin";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { SystemStats } from "@/components/admin/SystemStats";
import { FeedbackModeration } from "@/components/admin/FeedbackModeration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck } from "lucide-react";

export default async function AdminDashboard() {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata.role !== 'admin') {
    redirect('/');
  }

  const [users, stats, feedbackList] = await Promise.all([
    getUsers(),
    getSystemStats(),
    getFeedbackList()
  ]);

  // Construct simplified stats object
  const dashboardStats = {
    totalFeedback: stats.totalFeedback,
    averageRating: stats.averageRating,
    totalUsers: users.length,
    recentFeedback: feedbackList.map(f => ({
      id: f.id,
      title: f.title,
      description: f.description,
      category: f.category,
      rating: f.rating,
      sentiment: f.sentiment,
      createdAt: f.createdAt
    }))
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8 dark min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-1">System configuration and user management.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm font-semibold border border-rose-100">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Access</span>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="moderation">Feedback Moderation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
            <SystemStats stats={dashboardStats} />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
            <UserManagementTable users={users} />
        </TabsContent>
        
        <TabsContent value="moderation" className="mt-6">
            <FeedbackModeration initialFeedback={feedbackList} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
