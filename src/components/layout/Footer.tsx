import Link from "next/link";
import { Feather, Globe, MessageCircle, Users, Mail, ArrowUpRight } from "lucide-react";
const footerLinks = {
  platform: [
    { label: "Explore", href: "/blogs" },
    { label: "Search", href: "/search" },
    { label: "Write", href: "/editor" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "/blogs" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Guidelines", href: "#" },
  ],
};
export function Footer() {
  return (
    <footer className="relative border-t border-black/5 dark:border-white/5 bg-white dark:bg-black">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] bg-brand-orange/[0.03] dark:bg-brand-orange/[0.05] rounded-full blur-[120px]" />
      </div>
      <div className="container relative z-10 mx-auto px-6 pt-20 pb-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black shadow-xl shadow-orange-500/10">
                <Feather className="h-6 w-6 fill-brand-orange text-brand-orange" />
              </div>
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-black to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-400">
                DevBlog
              </span>
            </Link>
            <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              The premier destination for software architects and builders to document technical breakthroughs and share future-proof ideas.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Globe, href: "#" },
                { icon: MessageCircle, href: "#" },
                { icon: Users, href: "#" },
                { icon: Mail, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/5 dark:border-white/5 text-zinc-400 hover:text-brand-orange hover:border-brand-orange/30 hover:bg-brand-orange/5 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-brand-orange transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-brand-orange transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">Stay Updated</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 font-medium">Get the latest articles and updates delivered to your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 h-11 rounded-xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] px-4 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
              />
              <button className="h-11 px-5 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange/90 transition-all shadow-lg shadow-orange-500/20">
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400 font-medium">
            © {new Date().getFullYear()} DevBlog. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link key={link.label} href={link.href} className="text-xs text-zinc-400 hover:text-brand-orange transition-colors font-medium">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
