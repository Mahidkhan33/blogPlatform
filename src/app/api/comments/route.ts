import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Comment from "@/models/Comment";
import * as z from "zod";
const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  postId: z.string().min(1, "Post ID is required"),
});
export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { content, postId } = commentSchema.parse(body);
    await connectToDatabase();
    const comment = await Comment.create({
      content,
      post: postId,
      author: (session.user as any).id,
    });
    const populatedComment = await comment.populate("author", "name image");
    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error) {
    console.error("Comment creation error:", error);
    return NextResponse.json(
      { message: "Failed to post comment" },
      { status: 500 }
    );
  }
}
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    if (!postId) {
      return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
    }
    await connectToDatabase();
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("author", "name image");
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Comments fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
