import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/user/dashboard-header";
import { FeedbackList } from "@/components/user/feedback-list";
import { UserFeedbackForm } from "@/components/user/feedback-form";

export default async function UserDashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) return null;

  // Fetch data
  const feedbacks = await prisma.feedback.findMany({
    where: { userId, deleted: false },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  const totalFeedback = await prisma.feedback.count({
    where: { userId, deleted: false }
  });

  const pendingFeedback = await prisma.feedback.count({
    where: { userId, sentiment: "Pending", deleted: false }
  });
  
  // Assuming non-pending are "resolved" or at least processed
  const resolvedFeedback = totalFeedback - pendingFeedback;

  const stats = {
    total: totalFeedback,
    pending: pendingFeedback,
    resolved: resolvedFeedback,
    avgResponseTime: "< 24h" // Placeholder as we don't track response time yet
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <DashboardHeader 
          userName={user.firstName || "User"} 
          stats={stats} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Feedback Form */}
          <div className="lg:col-span-1">
            <UserFeedbackForm />
          </div>

          {/* Right Column: Feedback History */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Your Feedback History</h2>
              <p className="text-gray-400 text-sm">
                View and track the status of your submitted feedback.
              </p>
            </div>
            
            <FeedbackList feedbacks={feedbacks} />
          </div>
        </div>
      </div>
    </div>
  );
}
