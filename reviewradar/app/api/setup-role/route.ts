
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = (sessionClaims?.metadata as { role?: string })?.role;
  if (userRole !== "admin") {
    return NextResponse.json({ error: "Forbidden: Only admins can assign roles" }, { status: 403 });
  }

  try {
    const { role, targetUserId } = await req.json();
    
    if (!targetUserId) {
        return NextResponse.json({ error: "Target User ID is required" }, { status: 400 });
    }

    const newRole = role === "admin" ? "admin" : "analyst";
    
    const client = await clerkClient();
    await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        role: newRole,
      },
    });

    return NextResponse.json({ success: true, message: `Role updated to '${newRole}' for user ${targetUserId}` });
  } catch (error) {
    console.error("Failed to update role:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
