import { getFeedbackForAnalyst, getFeedbackStats, FeedbackFilter } from "@/app/actions/analyst";
import { FeedbackFilters } from "@/components/analyst/feedback-filters";
import { FeedbackTable } from "@/components/analyst/feedback-table";
import { PaginationControls } from "@/components/analyst/pagination-controls";
import { StatsCards } from "@/components/analyst/stats-cards";
import { AiInsights } from "@/components/analyst/ai-insights";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyst Dashboard | ReviewRadar",
};

export default async function AnalystDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    page?: string;
    search?: string;
    category?: string;
    rating?: string;
    sentiment?: string;
    dateRange?: string;
  }>
}) {
  const resolvedParams = await searchParams; 
  const page = Number(resolvedParams?.page) || 1;
  const limit = 10;
  
  const filters: FeedbackFilter = {
      search: resolvedParams?.search,
      category: resolvedParams?.category as any,
      rating: resolvedParams?.rating,
      sentiment: resolvedParams?.sentiment,
      dateRange: resolvedParams?.dateRange,
  };

  const { feedback, totalPages } = await getFeedbackForAnalyst(page, limit, filters);
  const stats = await getFeedbackStats();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 dark min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analyst Dashboard</h2>
      </div>
      
      <StatsCards stats={stats} />
      
      <div className="space-y-4">
          <AiInsights filters={filters} />
          <FeedbackFilters />
          <FeedbackTable feedback={feedback} />
          <PaginationControls totalPages={totalPages} />
      </div>
    </div>
  );
}
