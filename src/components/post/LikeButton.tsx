"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}
export function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (session) {
      checkLikeStatus();
    }
  }, [session, postId]);
  const checkLikeStatus = async () => {
    try {
      const res = await fetch(`/api/likes?postId=${postId}`);
      const data = await res.json();
      setIsLiked(data.liked);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };
  const toggleLike = async () => {
    if (!session) {
      toast.error("Please login to like posts");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.liked);
        setLikes((prev) => (data.liked ? prev + 1 : prev - 1));
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isLoading}
      onClick={toggleLike}
      className={cn(
        "rounded-full px-6 h-10 gap-3 transition-all duration-500 font-black uppercase tracking-tighter text-xs",
        isLiked
          ? "bg-brand-orange text-white hover:bg-brand-orange/90 shadow-lg shadow-orange-500/20 scale-105"
          : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-brand-orange/10 hover:text-brand-orange"
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-500",
          isLiked && "fill-current scale-125"
        )}
      />
      <span>{likes}</span>
    </Button>
  );
}
