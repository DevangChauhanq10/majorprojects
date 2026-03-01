"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "./empty-state";
import { cn } from "@/lib/utils";
import { Feedback } from "@prisma/client";

interface FeedbackListProps {
  feedbacks: Feedback[];
}

export function FeedbackList({ feedbacks }: FeedbackListProps) {
  if (feedbacks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="rounded-lg border border-[#222] bg-[#111111] overflow-hidden">
      <Table>
        <TableHeader className="bg-[#1a1a1a]">
          <TableRow className="border-b-[#222] hover:bg-transparent">
            <TableHead className="text-gray-400 font-medium w-[300px]">Title</TableHead>
            <TableHead className="text-gray-400 font-medium">Category</TableHead>
            <TableHead className="text-gray-400 font-medium">Rating</TableHead>
            <TableHead className="text-gray-400 font-medium">Date</TableHead>
            <TableHead className="text-gray-400 font-medium text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow 
              key={feedback.id} 
              className="border-b-[#222] last:border-0 hover:bg-[#1a1a1a]/50 transition-colors"
            >
              <TableCell className="py-4">
                <div className="font-medium text-white mb-1">
                  {feedback.title}
                </div>
                <div className="text-sm text-gray-400 whitespace-pre-wrap">
                  {feedback.description}
                </div>
              </TableCell>
              <TableCell className="align-top py-4">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "font-normal border-0",
                    feedback.category === 'Bug' && "bg-red-500/10 text-red-400",
                    feedback.category === 'Feature' && "bg-blue-500/10 text-blue-400",
                    feedback.category === 'UX' && "bg-purple-500/10 text-purple-400",
                    feedback.category === 'Performance' && "bg-orange-500/10 text-orange-400",
                    feedback.category === 'Other' && "bg-gray-500/10 text-gray-400",
                  )}
                >
                  {feedback.category}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-300 align-top py-4">
                {feedback.rating > 0 ? (
                  <div className="flex text-yellow-500">
                    {'★'.repeat(feedback.rating)}
                    <span className="text-gray-600">{'★'.repeat(5 - feedback.rating)}</span>
                  </div>
                ) : (
                  <span className="text-gray-600">-</span>
                )}
              </TableCell>
              <TableCell className="text-gray-400 align-top py-4" suppressHydrationWarning>
                {new Date(feedback.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right align-top py-4">
                 <Badge 
                  variant="outline" 
                  className={cn(
                    "border-0",
                    feedback.resolved 
                      ? "bg-emerald-500/10 text-emerald-500" 
                      : "bg-amber-500/10 text-amber-500"
                  )}
                >
                  {feedback.resolved ? "Resolved" : "Pending"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
