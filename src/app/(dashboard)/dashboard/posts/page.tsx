"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { format } from "date-fns";
import { 
  FileEdit, 
  Trash2, 
  Plus, 
  MoreVertical, 
  ExternalLink,
  Heart,
  MessageCircle,
  FileText,
  Search
} from "lucide-react";
import { PostCard } from "@/components/post/PostCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
export default function DashboardPostsPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchUserPosts = async () => {
    if (!session?.user) return;
    try {
      const res = await fetch(`/api/posts?authorId=${(session.user as any).id}&status=all`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } catch (error) {
      toast.error("Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUserPosts();
  }, [session]);
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Post deleted successfully");
        setPosts(posts.filter((post: any) => post._id !== id));
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };
  const filteredPosts = posts.filter((post: any) => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="bg-white dark:bg-black border-b border-black/5 dark:border-white/5">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-8 bg-brand-orange rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">Manage</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter">Your Posts</h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">Manage your stories, drafts and published articles.</p>
            </div>
            <Link href="/editor">
              <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white shadow-lg shadow-orange-500/20 font-bold uppercase tracking-widest px-8 h-12 rounded-full transition-all hover:scale-105">
                <Plus className="mr-2 h-5 w-5" />
                New Post
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 py-10">
        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search your posts..." 
            className="pl-11 h-12 rounded-xl border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 focus-visible:ring-brand-orange font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {isLoading ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse h-48 bg-white dark:bg-zinc-900 rounded-[2.5rem] border-black/5 dark:border-white/5" />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post: any) => (
              <PostCard 
                key={post._id} 
                post={post}
                actions={
                  <DropdownMenu>
                    <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm")}>
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-2xl border-black/5 dark:border-white/5 shadow-2xl p-1">
                      <DropdownMenuItem asChild className="cursor-pointer rounded-xl focus:bg-brand-orange/5 focus:text-brand-orange">
                        <Link href={`/post/${post.slug}`}>
                          <ExternalLink className="mr-2 h-4 w-4" /> View Post
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer rounded-xl focus:bg-brand-orange/5 focus:text-brand-orange">
                        <Link href={`/editor/${post._id}`}>
                          <FileEdit className="mr-2 h-4 w-4" /> Edit Post
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="opacity-50" />
                      <DropdownMenuItem 
                        className="cursor-pointer rounded-xl text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 dark:text-red-400"
                        onClick={() => handleDelete(post._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-zinc-900 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <FileText className="h-16 w-16 text-zinc-200 dark:text-zinc-800 mb-6" />
            <h3 className="text-xl font-black tracking-tight">No posts found</h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto mb-8 font-medium mt-2">
              You haven&apos;t written any stories yet. Start sharing your knowledge today!
            </p>
            <Link href="/editor">
              <Button className="bg-black dark:bg-white dark:text-black text-white font-bold px-8 rounded-xl hover:bg-brand-orange hover:text-white dark:hover:bg-brand-orange transition-all">
                Create Your First Post
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
