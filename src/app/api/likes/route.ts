import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Like from "@/models/Like";
import Post from "@/models/Post";
export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { postId } = await req.json();
    const userId = (session.user as any).id;
    await connectToDatabase();
    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
      return NextResponse.json({ liked: false });
    } else {
      await Like.create({ user: userId, post: postId });
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Like toggle error:", error);
    return NextResponse.json(
      { message: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
export async function GET(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ liked: false });
  }
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const userId = (session.user as any).id;
    await connectToDatabase();
    const like = await Like.findOne({ user: userId, post: postId });
    return NextResponse.json({ liked: !!like });
  } catch (error) {
    return NextResponse.json({ liked: false });
  }
}
