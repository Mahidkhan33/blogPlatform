"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import {
  MessageSquare,
  Send,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
interface IComment {
  _id: string;
  content: string;
  author: {
    name: string;
    image?: string;
  };
  createdAt: string;
}
interface CommentSectionProps {
  postId: string;
}
export function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<IComment[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    fetchComments();
  }, [postId]);
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please login to comment");
      return;
    }
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, postId }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]);
        setContent("");
        toast.success("Comment posted!");
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="mt-20 space-y-12">
      <div className="flex items-center gap-3">
        <div className="h-10 w-1 bg-brand-orange rounded-full" />
        <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-brand-orange" />
            <h2 className="text-3xl font-black tracking-tighter">Community ({comments.length})</h2>
        </div>
      </div>
      <Card className="border border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/30 rounded-[2.5rem] overflow-hidden">
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              session ? "Join the conversation..." : "Sign in to leave a comment"
            }
            disabled={!session || isSubmitting}
            className="w-full min-h-[100px] p-6 text-sm bg-transparent border-none focus:ring-0 resize-none placeholder:text-zinc-400 font-medium"
          />
          <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2 pl-3">
              {session?.user && (
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border border-brand-orange/30">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="text-[8px] font-bold">
                        {session.user.name?.charAt(0)}
                    </AvatarFallback>
                    </Avatar>
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Posting as {session.user.name}</span>
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={!session || isSubmitting || !content.trim()}
              className="bg-black text-white dark:bg-brand-orange dark:text-white font-black uppercase tracking-widest px-6 h-10 rounded-full shadow-lg transition-all hover:scale-105 disabled:opacity-50 text-[10px]"
            >
              {isSubmitting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                    <Send className="h-3 w-3" />
                    <span>Post Message</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </Card>
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 group">
              <Avatar className="h-10 w-10 border border-black/5 dark:border-white/10 shadow-sm">
                <AvatarImage src={comment.author.image} />
                <AvatarFallback className="bg-zinc-100 text-zinc-800 font-bold text-xs">
                  {comment.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-sm tracking-tight">{comment.author.name}</span>
                  <div className="h-0.5 w-0.5 bg-zinc-300 rounded-full" />
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                    {format(new Date(comment.createdAt), "MMM d")}
                  </span>
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed bg-white dark:bg-zinc-900/50 p-4 rounded-[1.5rem] rounded-tl-none border border-black/5 dark:border-white/5 shadow-sm group-hover:shadow-md transition-all font-medium">
                  {comment.content}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-950 rounded-[3rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800">
            <p className="text-zinc-400 font-black uppercase tracking-widest text-sm">
              No messages found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`rounded-xl border ${className}`}>{children}</div>;
}
