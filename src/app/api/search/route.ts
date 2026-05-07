import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const sort = searchParams.get("sort") || "latest";
    await connectToDatabase();
    let query: any = { status: "published" };
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
        { excerpt: { $regex: q, $options: "i" } }
      ];
    }
    let sortOption: any = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "popular") sortOption = { views: -1 };
    const posts = await Post.find(query)
      .sort(sortOption)
      .populate("author", "name image")
      .limit(20);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { message: "Search failed" },
      { status: 500 }
    );
  }
}
