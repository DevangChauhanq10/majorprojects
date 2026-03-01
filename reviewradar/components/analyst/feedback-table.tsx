'use client';

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Feedback } from "@prisma/client";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface FeedbackTableProps {
  feedback: Feedback[];
}

export function FeedbackTable({ feedback }: FeedbackTableProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  
  const getReviewStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    ));
  };


  if (feedback.length === 0) {
    return (
      <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed">
        <p className="text-muted-foreground">No feedback found matching your criteria.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Sentiment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback.map((item) => (
              <TableRow 
                key={item.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedFeedback(item)}
              >
                <TableCell className="font-medium max-w-[200px] truncate py-6" title={item.title}>
                    <div className="font-semibold">{item.title}</div>
                </TableCell>
                <TableCell className="py-6">
                  <Badge variant="secondary">{item.category}</Badge>
                </TableCell>
                <TableCell className="py-6">
                  <div className="flex">{getReviewStars(item.rating)}</div>
                </TableCell>
                <TableCell className="font-mono text-xs py-6">{item.userId.slice(0, 15)}...</TableCell>
                <TableCell className="whitespace-nowrap py-6" suppressHydrationWarning>
                  {new Date(item.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="py-6">
                   <Badge 
                      variant="outline" 
                      className={
                        item.sentiment === 'Positive' ? 'text-green-500 border-green-500 bg-green-500/10' : 
                        item.sentiment === 'Negative' ? 'text-red-500 border-red-500 bg-red-500/10' : 
                        item.sentiment === 'Neutral' ? 'text-blue-500 border-blue-500 bg-blue-500/10' : 
                        'text-gray-500 border-gray-500 bg-gray-500/10'
                      }
                    >
                      {item.sentiment || 'N/A'}
                   </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedFeedback} onOpenChange={(open) => !open && setSelectedFeedback(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start pr-8">
              <div className="space-y-1">
                <DialogTitle className="text-xl">{selectedFeedback?.title}</DialogTitle>
                <DialogDescription suppressHydrationWarning>
                  Submitted on {selectedFeedback && new Date(selectedFeedback.createdAt).toLocaleDateString()} at {selectedFeedback && new Date(selectedFeedback.createdAt).toLocaleTimeString()}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
             {/* Metadata Grid */}
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Rating</span>
                  <div className="flex items-center gap-2">
                    <div className="flex">{selectedFeedback && getReviewStars(selectedFeedback.rating)}</div>
                    <span className="font-semibold">{selectedFeedback?.rating}/5</span>
                  </div>
                </div>
                
                 <div className="space-y-1">
                  <span className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Category</span>
                  <div>
                    <Badge variant="secondary" className="text-sm">
                        {selectedFeedback?.category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Sentiment</span>
                  <div>
                     <Badge 
                        variant="outline"
                        className={
                          selectedFeedback?.sentiment === 'Positive' ? 'text-green-500 border-green-500 bg-green-500/10' : 
                          selectedFeedback?.sentiment === 'Negative' ? 'text-red-500 border-red-500 bg-red-500/10' : 
                          selectedFeedback?.sentiment === 'Neutral' ? 'text-blue-500 border-blue-500 bg-blue-500/10' : 
                          'text-gray-500 border-gray-500 bg-gray-500/10'
                        }
                      >
                        {selectedFeedback?.sentiment || 'N/A'}
                     </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium text-xs uppercase tracking-wider">User ID</span>
                  <div className="font-mono text-xs bg-muted p-1 rounded inline-block">
                    {selectedFeedback?.userId}
                  </div>
                </div>
             </div>

             {/* Description Section */}
             <div className="space-y-2 bg-muted/30 p-4 rounded-lg border">
               <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Full Feedback</h4>
               <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                 {selectedFeedback?.description}
               </p>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
