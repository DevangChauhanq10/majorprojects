
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { role } = await req.json();
    const newRole = role === "admin" ? "admin" : "analyst";
    
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: newRole,
      },
    });

    return NextResponse.json({ success: true, message: `Role updated to '${newRole}'` });
  } catch (error) {
    console.error("Failed to update role:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
