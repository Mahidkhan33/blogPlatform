"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { format } from "date-fns";
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  PenSquare,
  ArrowRight,
  BarChart3,
  Users,
  Feather,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user) return;
      try {
        const res = await fetch(`/api/posts?authorId=${(session.user as any).id}&status=all&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setRecentPosts(data.posts);
          const totalViews = data.posts.reduce((acc: number, post: any) => acc + (post.views || 0), 0);
          const totalLikes = data.posts.reduce((acc: number, post: any) => acc + (post.likesCount || 0), 0);
          setStats({
            totalPosts: data.pagination.total,
            totalViews,
            totalLikes,
            totalComments: 0
          });
        }
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [session]);
  const statCards = [
    { title: "Total Posts", value: stats.totalPosts, icon: FileText, color: "text-brand-orange", bg: "bg-brand-orange/10" },
    { title: "Total Views", value: stats.totalViews, icon: Eye, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Total Likes", value: stats.totalLikes, icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Comments", value: stats.totalComments, icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="bg-white dark:bg-black border-b border-black/5 dark:border-white/5">
        <div className="container mx-auto px-6 py-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-8 bg-brand-orange rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">Dashboard</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">Welcome back, {session?.user?.name}!</h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1">Here&apos;s what&apos;s happening with your blog lately.</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
          {statCards.map((stat) => (
            <Card key={stat.title} className="border-black/5 dark:border-white/5 shadow-sm overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{stat.title}</CardTitle>
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tight text-black dark:text-white">{isLoading ? "..." : stat.value}</div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3" /> +12% from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-7">
          <Card className="lg:col-span-4 border-black/5 dark:border-white/5 shadow-sm bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-black/20">
              <CardTitle className="font-black tracking-tight text-lg">Recent Posts</CardTitle>
              <CardDescription className="text-xs font-medium">Your latest 5 published or draft stories.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-4 p-2">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-2xl" />)}
                </div>
              ) : recentPosts.length > 0 ? (
                <div className="space-y-2">
                  {recentPosts.map((post: any) => (
                    <div key={post._id} className="flex items-center justify-between p-4 rounded-2xl border border-black/[0.03] dark:border-white/[0.03] hover:bg-brand-orange/[0.03] hover:border-brand-orange/10 transition-all group">
                      <div className="flex flex-col min-w-0 flex-1 mr-4">
                        <span className="font-bold line-clamp-1 text-sm group-hover:text-brand-orange transition-colors">{post.title}</span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                         <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full ${
                          post.status === "published" 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}>
                          {post.status}
                        </span>
                        <Link href={`/editor/${post._id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-brand-orange/10 hover:text-brand-orange transition-all">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Feather className="h-12 w-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
                  <p className="text-zinc-400 font-black uppercase tracking-widest text-xs">No posts found</p>
                </div>
              )}
              <div className="mt-4 px-2">
                <Link href="/dashboard/posts">
                  <Button variant="outline" className="w-full rounded-xl border-black/5 dark:border-white/5 font-bold uppercase tracking-widest text-[10px] h-11 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all">
                    View All Posts
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 border-0 shadow-xl bg-black dark:bg-zinc-900 text-white rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 h-[200px] w-[200px] bg-brand-orange/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 h-[150px] w-[150px] bg-brand-orange/10 rounded-full blur-[60px]" />
            </div>
             <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2 font-black tracking-tight">
                <div className="h-8 w-8 rounded-lg bg-brand-orange flex items-center justify-center shadow-lg">
                  <Feather className="h-4 w-4 text-white" />
                </div>
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="space-y-2">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Most popular this week</p>
                <p className="font-bold text-lg leading-tight">&ldquo;Mastering Next.js: A Comprehensive Guide&rdquo;</p>
                <div className="flex items-center gap-2 text-xs text-white/50 font-bold">
                  <Eye className="h-3 w-3" /> 1,240 views
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/10">
                 <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-white/10 rounded-xl">
                     <BarChart3 className="h-4 w-4 text-brand-orange" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-sm font-bold">Audience Growth</span>
                     <span className="text-xs text-white/50 font-medium">+24 new followers</span>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-white/10 rounded-xl">
                     <Users className="h-4 w-4 text-brand-orange" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-sm font-bold">Engagement</span>
                     <span className="text-xs text-white/50 font-medium">15% increase in comments</span>
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
