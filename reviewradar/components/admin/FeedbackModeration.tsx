"use client";

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
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { deleteFeedback, toggleFeedbackResolved } from "@/app/actions/admin";
import { toast } from "sonner";

type Feedback = {
  id: number;
  title: string;
  description: string;
  category: string;
  rating: number;
  sentiment: string;
  createdAt: Date;
  deleted: boolean;
  resolved: boolean;
  userId: string;
};

export function FeedbackModeration({
  initialFeedback,
}: {
  initialFeedback: Feedback[];
}) {
  const [feedbackList, setFeedbackList] = useState(initialFeedback);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isToggling, setIsToggling] = useState<number | null>(null);

  const handleToggleResolved = async (id: number, currentStatus: boolean) => {
    setIsToggling(id);
    try {
      await toggleFeedbackResolved(id, currentStatus);
      setFeedbackList((prev) =>
        prev.map((f) => (f.id === id ? { ...f, resolved: !currentStatus } : f))
      );
      toast.success(`Marked as ${!currentStatus ? 'Resolved' : 'Unresolved'}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsToggling(null);
    }
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      await deleteFeedback(id);
      setFeedbackList((prev) => prev.filter((f) => f.id !== id));
      toast.success("Feedback deleted successfully");
    } catch (error) {
      toast.error("Failed to delete feedback");
    } finally {
      setIsDeleting(null);
    }
  };

  // getSentimentColor removed as Sentiment column is replaced

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback Moderation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbackList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.rating}/5</TableCell>
                  <TableCell>
                    <Button
                      variant={item.resolved ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => handleToggleResolved(item.id, item.resolved)}
                      disabled={isToggling === item.id}
                      className={`h-7 px-3 text-xs w-[120px] shadow-none ${
                        item.resolved 
                          ? "text-green-600 border-green-600/30 bg-green-50/50 hover:bg-green-100/50" 
                          : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {isToggling === item.id && (
                        <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                      )}
                      {item.resolved ? "✓ Resolved" : "Mark as Resolved"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-100"
                        >
                          {isDeleting === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will mark the feedback as deleted and hide it from regular views.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              {feedbackList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No feedback found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
