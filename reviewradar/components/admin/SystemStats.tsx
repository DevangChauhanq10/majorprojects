"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, MessageSquare, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Stats = {
  totalFeedback: number;
  averageRating: number;
  totalUsers: number;
  recentFeedback: {
    id: number;
    title: string;
    description: string;
    category: string;
    rating: number;
    sentiment?: string | null;
    createdAt: Date;
  }[];
};

export function SystemStats({ stats }: { stats: Stats }) {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [selectedFeedback, setSelectedFeedback] = useState<Stats["recentFeedback"][0] | null>(null);

  const filteredFeedback = stats.recentFeedback.filter(f => {
    if (categoryFilter !== "All" && f.category !== categoryFilter) return false;
    if (ratingFilter !== "All" && f.rating.toString() !== ratingFilter) return false;
    return true;
  });

  const getReviewStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* 3 Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#18181b] border-[#27272a]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Users</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            <p className="text-xs text-slate-500">Registered accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-[#27272a]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalFeedback}</div>
            <p className="text-xs text-slate-500">All time submissions</p>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-[#27272a]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-slate-500">Out of 5.0 stars</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback List */}
      <Card className="bg-[#18181b] border-[#27272a]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#27272a] pb-4">
          <CardTitle className="text-lg font-semibold text-white">Recent Feedback Overview</CardTitle>
          <div className="flex items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm bg-[#0a0a0a] border border-[#27272a] text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="All">All Categories</option>
              <option value="Bug">Bug</option>
              <option value="Feature">Feature</option>
              <option value="UX">UX</option>
              <option value="Performance">Performance</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="text-sm bg-[#0a0a0a] border border-[#27272a] text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[#27272a] max-h-[500px] overflow-y-auto">
            {filteredFeedback.slice(0, 50).map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-4 hover:bg-white/5 cursor-pointer transition-colors"
                onClick={() => setSelectedFeedback(item)}
              >
                <div className="space-y-1 overflow-hidden pr-4">
                   <div className="flex items-center gap-2">
                     <p className="text-sm font-medium text-white truncate max-w-[400px]">{item.title}</p>
                     <div className="flex">{getReviewStars(item.rating)}</div>
                   </div>
                  <p className="text-xs text-slate-500" suppressHydrationWarning>
                    {new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                 {item.sentiment && (
                     <Badge 
                        variant="outline" 
                        className={
                          item.sentiment === 'Positive' ? 'text-green-500 border-green-500/30 bg-green-500/10' : 
                          item.sentiment === 'Negative' ? 'text-red-500 border-red-500/30 bg-red-500/10' : 
                          item.sentiment === 'Neutral' ? 'text-blue-500 border-blue-500/30 bg-blue-500/10' : 
                          'text-slate-400 border-slate-500/30 bg-slate-500/10'
                        }
                      >
                        {item.sentiment}
                     </Badge>
                  )}
                  <Badge variant="secondary" className="bg-[#27272a] text-slate-200 border-transparent">{item.category}</Badge>
                </div>
              </div>
            ))}
            {filteredFeedback.length === 0 && (
               <div className="p-8 text-center text-sm text-slate-500">
                 No feedback found matching the filters.
               </div>
            )}
            {filteredFeedback.length > 50 && (
               <div className="p-4 text-center text-xs text-slate-500 bg-[#0a0a0a]/50">
                 Showing top 50 recent results.
               </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedFeedback} onOpenChange={(open) => !open && setSelectedFeedback(null)}>
        <DialogContent className="sm:max-w-[600px] border-[#27272a] bg-[#18181b] text-white overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedFeedback?.title}</DialogTitle>
            <DialogDescription className="text-slate-400" suppressHydrationWarning>
              Submitted on {selectedFeedback && new Date(selectedFeedback.createdAt).toLocaleDateString()} at {selectedFeedback && new Date(selectedFeedback.createdAt).toLocaleTimeString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Rating</span>
                  <div className="flex items-center gap-2">
                    <div className="flex">{selectedFeedback && getReviewStars(selectedFeedback.rating)}</div>
                    <span className="font-semibold text-slate-200">{selectedFeedback?.rating}/5</span>
                  </div>
                </div>
                
                 <div className="space-y-1">
                  <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Category</span>
                  <div>
                    <Badge className="bg-[#27272a] text-slate-200 border-transparent font-normal">
                        {selectedFeedback?.category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Sentiment</span>
                  <div>
                     <Badge 
                        variant="outline"
                        className={
                          selectedFeedback?.sentiment === 'Positive' ? 'text-green-500 border-green-500/30 bg-green-500/10 font-normal' : 
                          selectedFeedback?.sentiment === 'Negative' ? 'text-red-500 border-red-500/30 bg-red-500/10 font-normal' : 
                          selectedFeedback?.sentiment === 'Neutral' ? 'text-blue-500 border-blue-500/30 bg-blue-500/10 font-normal' : 
                          'text-slate-400 border-slate-500/30 bg-slate-500/10 font-normal'
                        }
                      >
                        {selectedFeedback?.sentiment || 'Pending'}
                     </Badge>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">ID</span>
                  <div className="font-mono text-xs text-slate-400 bg-[#0a0a0a] px-2 py-1 rounded inline-block border border-[#27272a]">
                    {selectedFeedback?.id}
                  </div>
                </div>
             </div>

             <div className="space-y-2 bg-[#0a0a0a]/50 p-4 rounded-lg border border-[#27272a]">
               <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Description</h4>
               <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap break-words">
                 {selectedFeedback?.description}
               </p>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
