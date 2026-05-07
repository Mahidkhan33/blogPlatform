"use client";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Clock, ArrowUpRight, Eye, Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface PostCardProps {
  post: {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: string;
    author?: {
      name: string;
      image?: string;
    };
    createdAt: string;
    tags?: string[];
    status?: string;
    views?: number;
    likesCount?: number;
  };
  actions?: React.ReactNode;
}
export function PostCard({ post, actions }: PostCardProps) {
  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(255,107,0,0.12)] transition-all duration-500 rounded-[2.5rem] p-2">
      {}
      <div className="relative">
        <Link href={`/post/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden rounded-[2.2rem]">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-12">
              <span className="text-zinc-200 dark:text-zinc-700 font-black text-5xl tracking-tighter italic select-none">
                DEV.
              </span>
            </div>
          )}
          {}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <div className="h-12 w-12 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <ArrowUpRight className="h-6 w-6" />
            </div>
          </div>
        </Link>
        {}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="flex flex-wrap gap-2">
            {post.status && (
              <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg pointer-events-auto ${
                post.status === "published" 
                ? "bg-black/60 backdrop-blur-md text-green-400 border border-green-500/30" 
                : "bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30"
              }`}>
                {post.status}
              </span>
            )}
            {post.tags?.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-brand-orange text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg pointer-events-auto"
              >
                {tag}
              </span>
            ))}
          </div>
          {actions && (
            <div className="pointer-events-auto">
              {actions}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div className="mb-4">
            <Link href={`/post/${post.slug}`}>
                <h3 className="text-lg font-black leading-tight text-black dark:text-white transition-colors line-clamp-2 hover:text-brand-orange">
                    {post.title}
                </h3>
            </Link>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400 line-clamp-2 text-xs leading-relaxed font-medium opacity-80">
                {post.excerpt || "Explore this story and dive deep into the world of modern development..."}
            </p>
        </div>
        <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                  {post.author ? (
                    <>
                      <Avatar className="h-7 w-7 border border-black/5 dark:border-white/10">
                          {post.author.image && <AvatarImage src={post.author.image} />}
                          <AvatarFallback className="text-[9px] font-bold bg-zinc-100 text-zinc-800">
                              {post.author.name.charAt(0)}
                          </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                          <span className="text-[10px] font-black text-black dark:text-white leading-tight">
                              {post.author.name}
                          </span>
                          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-tight">
                              {format(new Date(post.createdAt), "MMM d, yyyy")}
                          </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-tight">
                        {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </span>
                  )}
              </div>
              <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400">
                     <Eye className="h-3 w-3" /> 
                     <span>{post.views || 0}</span>
                   </div>
                   <div className="h-1 w-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400">
                     <Clock className="h-3 w-3" /> 
                     <span>5m</span>
                   </div>
              </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
