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
import { type User } from "@clerk/nextjs/server"; // Import types if needed, or define locally

type UserData = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | undefined;
  role: unknown; // Using unknown as it comes from metadata
  createdAt: number;
  feedbackCount: number;
};

export function UserManagementTable({ users }: { users: UserData[] }) {
  const getRoleBadgeColor = (role: unknown) => {
    switch (role) {
      case "admin":
        return "bg-red-500 hover:bg-red-600"; // classic admin red
      case "analyst":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-blue-500 hover:bg-blue-600"; // user blue
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management ({users.length})</CardTitle>
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
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {String(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.feedbackCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
