import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import * as z from "zod";
const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
});
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const post = await Post.findById(id).populate("author", "name image");
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching post" }, { status: 500 });
  }
}
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectToDatabase();
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    if (post.author.toString() !== (session.user as any).id && (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Forbidden: You don't own this post" }, { status: 403 });
    }
    const body = await req.json();
    const validatedData = updatePostSchema.parse(body);
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true }
    );
    return NextResponse.json(updatedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "Error updating post" }, { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectToDatabase();
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    if (post.author.toString() !== (session.user as any).id && (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Forbidden: You don't own this post" }, { status: 403 });
    }
    await Post.findByIdAndDelete(id);
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting post" }, { status: 500 });
  }
}
