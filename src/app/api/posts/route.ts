import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import * as z from "zod";
const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});
export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const validatedData = postSchema.parse(body);
    await connectToDatabase();
    const slug =
      validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Date.now().toString().slice(-4);
    const post = await Post.create({
      ...validatedData,
      slug,
      author: (session.user as any).id,
      publishedAt:
        validatedData.status === "published" ? new Date() : undefined,
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Post creation error:", error);
    return NextResponse.json(
      { message: "Failed to create post" },
      { status: 500 }
    );
  }
}
export async function GET(req: Request) {
  const session = await auth();
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "published";
    const authorId = searchParams.get("authorId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    await connectToDatabase();
    const query: any = {};
    if (status === "all") {
      if (
        !session ||
        !session.user ||
        (authorId &&
          authorId !== (session.user as any).id &&
          (session.user as any).role !== "admin")
      ) {
        query.status = "published";
      } else if (authorId) {
        query.author = authorId;
      }
    } else {
      query.status = status;
      if (authorId) query.author = authorId;
    }
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "name image");
    const total = await Post.countDocuments(query);
    return NextResponse.json({
      posts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
      },
    });
  } catch (error) {
    console.error("Posts fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
