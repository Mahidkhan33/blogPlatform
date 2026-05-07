"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PenSquare,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  Search,
  Feather
} from "lucide-react";
export function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-black/70">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        {}
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="group flex items-center gap-2 text-2xl font-black tracking-tighter"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-orange-500/10">
              <Feather className="h-6 w-6 fill-brand-orange text-brand-orange" />
            </div>
            <span className="bg-gradient-to-r from-black to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-400">
              DevBlog
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/blogs"
              className="text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              <Search className="h-4 w-4" />
              Search
            </Link>
          </div>
        </div>
        {}
        <div className="flex items-center gap-6">
          {session ? (
            <>
              <Link href="/editor">
                <Button
                  className="hidden md:flex gap-2 bg-brand-orange font-bold text-white hover:bg-brand-orange/90 rounded-full px-6 shadow-lg shadow-orange-500/20 border-0"
                >
                  <PenSquare className="h-4 w-4" />
                  Write Story
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-brand-orange rounded-full">
                  <Avatar className="h-11 w-11 border-2 border-brand-orange shadow-lg transition-transform hover:scale-105">
                    {session.user?.image && (
                      <AvatarImage
                        src={session.user.image}
                        alt={session.user?.name || ""}
                      />
                    )}
                    <AvatarFallback className="bg-black text-white font-bold">
                      {session.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2 shadow-2xl rounded-2xl border-zinc-100 dark:border-zinc-800" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-black leading-none">
                          {session.user?.name}
                        </p>
                        <p className="text-xs leading-none text-zinc-500">
                          {session.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="opacity-50" />
                  <div className="p-1 space-y-1">
                    <Link href="/dashboard">
                      <DropdownMenuItem className="cursor-pointer rounded-xl py-3 px-4 focus:bg-orange-50 dark:focus:bg-orange-950/20 focus:text-brand-orange">
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        <span className="font-semibold">My Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer rounded-xl py-3 px-4 focus:bg-orange-50 dark:focus:bg-orange-950/20 focus:text-brand-orange">
                        <UserIcon className="mr-3 h-5 w-5" />
                        <span className="font-semibold">Profile Settings</span>
                      </DropdownMenuItem>
                    </Link>
                  </div>
                  <DropdownMenuSeparator className="opacity-50" />
                  <div className="p-1">
                    <DropdownMenuItem
                      className="cursor-pointer rounded-xl py-3 px-4 text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      <span className="font-semibold">Log out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="font-bold text-sm uppercase tracking-wider">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="bg-black text-white dark:bg-white dark:text-black font-bold text-sm uppercase tracking-wider px-8 rounded-full hover:scale-105 transition-transform shadow-xl"
                >
                  Join Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
