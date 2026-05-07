import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Zap, ChevronRight, PenSquare, Globe, Shield, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post/PostCard";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
async function getPosts() {
  try {
    await connectToDatabase();
    const posts = await Post.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("author", "name image");
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}
const features = [
  {
    icon: PenSquare,
    title: "Rich Editor",
    description: "Write with a powerful TipTap-powered editor featuring formatting, images, code blocks, and AI assistance.",
  },
  {
    icon: Cpu,
    title: "AI Writing Assistant",
    description: "Generate titles, excerpts, and full articles with our built-in Gemini-powered AI writing companion.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Publish your stories to a worldwide audience of developers, architects, and tech enthusiasts.",
  },
  {
    icon: Shield,
    title: "Built for Devs",
    description: "Syntax highlighting, markdown support, and technical writing tools built specifically for developers.",
  },
];
export default async function Home() {
  const posts = await getPosts();
  return (
    <div className="flex flex-col">
      {}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white dark:bg-black pt-8 pb-20">
        {}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-brand-orange/[0.03] dark:bg-brand-orange/[0.07] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-zinc-100 dark:bg-zinc-900/50 rounded-full blur-[100px]" />
          {}
          <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" 
               style={{ backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        </div>
        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-4 py-1.5 dark:border-white/10 dark:bg-white/5 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                The modern standard for tech writers
              </span>
            </div>
            <h1 className="mb-8 text-5xl font-black tracking-tight text-black dark:text-white md:text-7xl lg:text-8xl leading-[1.05]">
              Share your <span className="text-brand-orange">code.</span><br />
              Master your <span className="text-brand-orange">craft.</span>
            </h1>
            <p className="mb-12 max-w-2xl mx-auto text-base text-zinc-500 dark:text-zinc-400 md:text-lg font-medium leading-relaxed">
              DevBlog is the premier destination for software architects and builders to document technical breakthroughs and share future-proof ideas with a global audience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="h-14 px-10 text-sm font-bold uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black hover:bg-brand-orange dark:hover:bg-brand-orange hover:text-white transition-all rounded-xl w-full shadow-xl">
                  Get Started
                </Button>
              </Link>
              <Link href="/blogs" className="w-full sm:w-auto">
                <Button variant="outline" className="h-14 px-10 text-sm font-bold uppercase tracking-widest border-2 border-black/10 dark:border-white/10 rounded-xl w-full hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                  Read Feed
                </Button>
              </Link>
            </div>
            {}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-black/5 dark:border-white/5 pt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-black dark:text-white">12,000+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Expert Writers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black dark:text-white">500,000+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Monthly Readers</div>
              </div>
              <div className="text-center hidden md:block">
                <div className="text-2xl font-bold text-brand-orange">99.9%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tech Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {}
      <section className="relative bg-white dark:bg-black py-32 border-t border-black/5 dark:border-white/5">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] bg-brand-orange/[0.02] dark:bg-brand-orange/[0.04] rounded-full blur-[120px]" />
        </div>
        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="flex items-center justify-center gap-3 text-brand-orange mb-6">
              <div className="h-2 w-12 bg-brand-orange rounded-full" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Why DevBlog</span>
              <div className="h-2 w-12 bg-brand-orange rounded-full" />
            </div>
            <h2 className="text-4xl font-black tracking-tight text-black dark:text-white md:text-6xl mb-6">
              Built for modern <span className="text-brand-orange">builders</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium leading-relaxed max-w-xl mx-auto">
              Everything you need to write, publish, and grow your technical audience — all in one platform.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative p-8 rounded-[2rem] border border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-brand-orange/20 hover:bg-brand-orange/[0.03] transition-all duration-500"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-500 shadow-sm">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-black dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {}
      <section className="bg-zinc-50 dark:bg-zinc-950 py-32 rounded-t-[4rem] -mt-16 relative z-20 border-t border-black/5 dark:border-white/5">
        <div className="container mx-auto px-6">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-brand-orange">
                <div className="h-2 w-12 bg-brand-orange rounded-full" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Editor&apos;s Pick</span>
              </div>
              <h2 className="text-4xl font-black tracking-tight text-black dark:text-white md:text-6xl">
                Featured Stories
              </h2>
            </div>
            <Link href="/blogs" className="group font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:text-brand-orange transition-colors">
              Explore All Stories
              <div className="h-8 w-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all">
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
          {posts.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <Zap className="mb-6 h-16 w-16 text-zinc-200 dark:text-zinc-800" />
              <p className="text-zinc-400 font-black uppercase tracking-widest">The feed is empty for now</p>
              <Link href="/editor" className="mt-6">
                <Button className="bg-black text-white dark:bg-white dark:text-black font-bold px-8 rounded-xl">Create Post</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
