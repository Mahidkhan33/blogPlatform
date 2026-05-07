import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Clock, ChevronLeft, Share2, Bookmark, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import { sanitize } from "@/lib/sanitize";
import { LikeButton } from "@/components/post/LikeButton";
import { CommentSection } from "@/components/post/CommentSection";
import { ViewTracker } from "@/components/post/ViewTracker";
async function getPost(slug: string) {
  try {
    await connectToDatabase();
    const post = await Post.findOne({ slug, status: "published" })
      .populate("author", "name image bio");
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    notFound();
  }
  const sanitizedContent = sanitize(post.content);
  return (
    <article className="pb-24">
      <ViewTracker postId={post._id} />
      {}
      <header className="bg-white py-16 dark:bg-black/20">
        <div className="container mx-auto max-w-4xl px-4">
          <Link href="/blogs" className="mb-10 flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-brand-orange transition-colors">
            <ChevronLeft className="h-3 w-3" />
            Back to blogs
          </Link>
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag: string) => (
              <span key={tag} className="px-4 py-1.5 bg-brand-orange/10 text-[10px] font-black uppercase tracking-[0.2em] rounded-full text-brand-orange border border-brand-orange/20">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mb-8 text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 md:text-5xl lg:text-7xl leading-[0.95]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mb-10 text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              {post.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-8 pt-8 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-white shadow-xl dark:border-zinc-800">
                <AvatarImage src={post.author.image} />
                <AvatarFallback className="bg-zinc-100 text-zinc-800 font-bold">
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">{post.author.name}</span>
                <div className="flex items-center gap-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> 5 min read</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-black/5 dark:border-white/5 hover:bg-brand-orange hover:text-white transition-all">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-black/5 dark:border-white/5 hover:bg-brand-orange hover:text-white transition-all">
                <Bookmark className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      {}
      {post.coverImage && (
        <div className="container mx-auto max-w-5xl px-4 mb-20">
          <div className="aspect-video w-full overflow-hidden rounded-[3rem] shadow-2xl border-4 border-white dark:border-zinc-900">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
      {}
      <div className="container mx-auto max-w-3xl px-4">
        <div 
          className="prose prose-zinc dark:prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-a:text-brand-orange dark:prose-a:text-brand-orange prose-img:rounded-[2rem] leading-relaxed text-zinc-700 dark:text-zinc-300"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
        <Separator className="my-20 opacity-50" />
        {}
        <div className="rounded-[3rem] bg-zinc-50 p-10 dark:bg-zinc-900/30 border border-black/5 dark:border-white/5">
          <div className="flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
            <Avatar className="h-28 w-28 border-4 border-white shadow-2xl dark:border-zinc-800">
              <AvatarImage src={post.author.image} />
              <AvatarFallback className="text-3xl font-black">{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange">About the author</span>
                <h3 className="text-3xl font-black tracking-tight">Written by {post.author.name}</h3>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed font-medium">
                {post.author.bio || "Passionate writer and tech enthusiast sharing insights on the latest trends in development and design."}
              </p>
              <div className="flex justify-center md:justify-start">
                <Button className="bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-widest px-10 h-12 rounded-full shadow-xl hover:scale-105 transition-all">
                  Follow Author
                </Button>
              </div>
            </div>
          </div>
        </div>
        {}
        <div id="comments">
          <CommentSection postId={post._id} />
        </div>
        {}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 rounded-full border border-black/5 bg-white/80 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-2xl dark:border-white/10 dark:bg-black/80">
            <LikeButton postId={post._id} initialLikes={post.likesCount} />
            <div className="h-6 w-px bg-black/5 dark:bg-white/10 mx-1" />
            <a href="#comments" className="inline-flex items-center rounded-full px-6 h-12 gap-3 hover:bg-brand-orange hover:text-white transition-all group text-sm">
              <MessageSquare className="h-5 w-5 group-hover:fill-current" />
              <span className="font-black uppercase tracking-widest text-xs">Comments</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
