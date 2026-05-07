"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon, Loader2, ArrowUpDown, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post/PostCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-orange" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const fetchResults = async (q: string) => {
    if (!q.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&sort=${sortBy}`);
      const data = await res.json();
      setPosts(data.posts);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (initialQuery) {
      fetchResults(initialQuery);
    }
  }, [initialQuery, sortBy]);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-white dark:bg-black py-20 lg:py-28">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] bg-brand-orange/[0.04] dark:bg-brand-orange/[0.08] rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" 
               style={{ backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        </div>
        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-4 py-1.5 dark:border-white/10 dark:bg-white/5 backdrop-blur-md">
              <SearchIcon className="h-3.5 w-3.5 text-brand-orange" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Find Articles
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-black dark:text-white md:text-7xl leading-[1.05] mb-10">
              Search <span className="text-brand-orange">Articles</span>
            </h1>
            <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-brand-orange transition-colors" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, content, or tags..."
                className="h-16 pl-14 pr-36 text-base rounded-2xl border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] shadow-[0_8px_30px_rgba(0,0,0,0.04)] focus-visible:ring-brand-orange focus-visible:border-brand-orange/30 transition-all font-medium"
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl h-12 px-8 bg-black dark:bg-white dark:text-black text-white font-bold uppercase tracking-widest text-xs hover:bg-brand-orange dark:hover:bg-brand-orange dark:hover:text-white transition-all shadow-lg"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>
      <section className="bg-zinc-50 dark:bg-zinc-950 py-16 rounded-t-[3rem] -mt-8 relative z-20 border-t border-black/5 dark:border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-black/5 dark:border-white/5">
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-brand-orange" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Searching...</span>
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {posts.length} results for &ldquo;{initialQuery || "all"}&rdquo;
                </span>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-black/5 dark:border-white/10 rounded-full hover:bg-brand-orange/5 hover:border-brand-orange/20 hover:text-brand-orange outline-none focus-visible:ring-2 focus-visible:ring-brand-orange transition-all">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-black/5 dark:border-white/5 shadow-2xl p-1">
                <DropdownMenuItem onClick={() => setSortBy("latest")} className="rounded-xl cursor-pointer font-semibold focus:bg-brand-orange/5 focus:text-brand-orange">Latest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")} className="rounded-xl cursor-pointer font-semibold focus:bg-brand-orange/5 focus:text-brand-orange">Oldest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("popular")} className="rounded-xl cursor-pointer font-semibold focus:bg-brand-orange/5 focus:text-brand-orange">Most Popular</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {posts.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : !isLoading && initialQuery && (
            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-zinc-900 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <Zap className="h-16 w-16 text-zinc-200 dark:text-zinc-800 mb-6" />
              <h2 className="text-2xl font-black tracking-tight mb-2">No results found</h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">Try adjusting your keywords or filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
