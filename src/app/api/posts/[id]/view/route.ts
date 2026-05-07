import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import View from "@/models/View";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = (session.user as any).id;

  try {
    await connectToDatabase();

    const existing = await View.findOne({ user: userId, post: id });

    if (existing) {
      return NextResponse.json({ counted: false, message: "Already viewed" });
    }

    await View.create({ user: userId, post: id });
    await Post.findByIdAndUpdate(id, { $inc: { views: 1 } });

    return NextResponse.json({ counted: true });
  } catch (error: any) {
    console.error("View tracking error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to track view" },
      { status: 500 }
    );
  }
}
