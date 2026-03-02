'use client';

import { useActionState, useEffect, useRef, useState } from 'react'; 
import { createFeedback } from "@/app/actions/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Star, Bug, Lightbulb, Zap, Layout, HelpCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

const initialState = {
  message: '',
  errors: {},
};

export function UserFeedbackForm() {
  const [state, formAction, isPending] = useActionState(createFeedback, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      formRef.current?.reset();
      
      // Reset rating without triggering another effect run for this same success state
      if (rating !== 0) {
        setRating(0);
      }
    } else if (state?.message) {
      toast.error(state.message);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="rounded-lg border border-[#222] bg-[#111111] p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white">Share Your Feedback</h3>
        <p className="text-sm text-gray-400 mt-1">
          Help us improve ReviewRadar directly. We value your input!
        </p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-5">
        
        <div className="space-y-2">
          <Label htmlFor="title" className="text-gray-300">Title</Label>
          <Input 
            id="title" 
            name="title" 
            placeholder="Brief summary of your feedback" 
            className="bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600 focus-visible:ring-emerald-500/50"
            required 
          />
          {state?.errors?.title && (
            <p className="text-sm text-red-500">{state.errors.title[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-gray-300">Category</Label>
          <Select name="category" defaultValue="Feature">
            <SelectTrigger className="bg-[#0a0a0a] border-[#333] text-white focus:ring-emerald-500/50">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
              <SelectItem value="Bug">
                <div className="flex items-center gap-2"><Bug className="w-4 h-4 text-red-400"/> Bug Report</div>
              </SelectItem>
              <SelectItem value="Feature">
                <div className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-blue-400"/> Feature Request</div>
              </SelectItem>
              <SelectItem value="UX">
                <div className="flex items-center gap-2"><Layout className="w-4 h-4 text-purple-400"/> User Experience</div>
              </SelectItem>
              <SelectItem value="Performance">
                <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-orange-400"/> Performance Issue</div>
              </SelectItem>
              <SelectItem value="Other">
                <div className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-gray-400"/> Other</div>
              </SelectItem>
            </SelectContent>
          </Select>
          {state?.errors?.category && (
            <p className="text-sm text-red-500">{state.errors.category[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-300">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            placeholder="Tell us more details (min 10 chars)..." 
            required 
            className="min-h-[120px] bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600 focus-visible:ring-emerald-500/50 resize-none"
          />
          {state?.errors?.description && (
            <p className="text-sm text-red-500">{state.errors.description[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Rating (Optional)</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`transition-all duration-200 hover:scale-110 ${
                  rating >= star ? 'text-yellow-500' : 'text-gray-700 hover:text-gray-500'
                }`}
              >
                <Star className={cn("w-6 h-6", rating >= star && "fill-current")} />
              </button>
            ))}
          </div>
          <input type="hidden" name="rating" value={rating || 0} />
          {state?.errors?.rating && (
            <p className="text-sm text-red-500 mt-1">{state.errors.rating[0]}</p>
          )}
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            disabled={isPending} 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all"
          >
            {isPending ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </form>
    </div>
  );
}
