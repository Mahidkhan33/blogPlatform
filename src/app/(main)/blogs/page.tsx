import { PostCard } from "@/components/post/PostCard";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import { Zap, BookOpen, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
async function getAllPosts() {
  try {
    await connectToDatabase();
    const posts = await Post.find({ status: "published" })
      .sort({ createdAt: -1 })
      .populate("author", "name image");
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}
export default async function BlogsPage() {
  const posts = await getAllPosts();
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-white dark:bg-black py-24 lg:py-32">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-brand-orange/[0.04] dark:bg-brand-orange/[0.08] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] bg-zinc-100 dark:bg-zinc-900/50 rounded-full blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" 
               style={{ backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        </div>
        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-4 py-1.5 dark:border-white/10 dark:bg-white/5 backdrop-blur-md">
              <BookOpen className="h-3.5 w-3.5 text-brand-orange" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Community Feed
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-black dark:text-white md:text-7xl leading-[1.05] mb-6">
              Discover <span className="text-brand-orange">Stories</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Explore the latest articles, tutorials, and insights from our community of writers and developers.
            </p>
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-2xl font-black text-black dark:text-white">{posts.length}</div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Stories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-brand-orange">
                  <TrendingUp className="h-6 w-6 mx-auto" />
                </div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Trending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-black dark:text-white">
                  <Users className="h-6 w-6 mx-auto" />
                </div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Authors</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-zinc-50 dark:bg-zinc-950 py-20 rounded-t-[3rem] -mt-8 relative z-20 border-t border-black/5 dark:border-white/5">
        <div className="container mx-auto px-6">
          {posts.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <Zap className="mb-6 h-16 w-16 text-zinc-200 dark:text-zinc-800" />
              <p className="text-zinc-400 font-black uppercase tracking-widest">No stories yet</p>
              <p className="text-zinc-400 text-sm font-medium mt-2 mb-6">Be the first to share your journey with the world.</p>
              <Link href="/editor">
                <Button className="bg-black text-white dark:bg-white dark:text-black font-bold px-8 rounded-xl hover:bg-brand-orange hover:text-white transition-all">
                  Write Your First Post
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
