import { MessageSquarePlus } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#333] rounded-lg bg-[#0a0a0a]/50">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1e1e1e] mb-4">
        <MessageSquarePlus className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-white">No feedback yet</h3>
      <p className="max-w-sm mt-2 text-sm text-gray-500">
        You haven't submitted any feedback yet. Share your thoughts to help us improve!
      </p>
    </div>
  );
}
