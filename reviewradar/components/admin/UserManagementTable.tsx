"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRole } from "@/app/actions/admin";
import { toast } from "sonner";
import { Search, Loader2 } from "lucide-react";

type UserData = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | undefined;
  role: unknown; // Using unknown as it comes from metadata
  createdAt: number;
  feedbackCount: number;
  categories: string[];
};

export function UserManagementTable({ users }: { users: UserData[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingRole(userId);
    try {
      await updateUserRole(userId, newRole);
      toast.success("User role updated successfully.");
    } catch (error) {
      toast.error("Failed to update user role.");
    } finally {
      setUpdatingRole(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === "All" || user.categories.includes(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>User Management ({filteredUsers.length})</CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-3">
             <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
             </div>
             <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Feedback Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Bug">Bug</SelectItem>
                  <SelectItem value="Feature">Feature</SelectItem>
                  <SelectItem value="UX">UX</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
             </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No users found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>
                      {user.email ? (
                        <a href={`mailto:${user.email}`} className="hover:underline hover:text-indigo-600 text-muted-foreground">
                          {user.email}
                        </a>
                      ) : (
                        <span className="text-muted-foreground italic">No email</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {updatingRole === user.id ? (
                           <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : null}
                        <Select
                          disabled={updatingRole === user.id}
                          value={String(user.role)}
                          onValueChange={(val) => handleRoleChange(user.id, val)}
                        >
                          <SelectTrigger className="h-7 w-[90px] px-2 text-xs font-medium bg-transparent border-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="analyst">Analyst</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.feedbackCount}
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
