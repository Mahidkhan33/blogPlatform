"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Feather, ArrowRight, Globe, User, Mail, Lock } from "lucide-react";
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});
export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      toast.success("Registration successful! Please log in.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white dark:bg-black overflow-hidden px-6 py-12">
      {}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-brand-orange/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-brand-orange/5 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="group mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-black text-white dark:bg-white dark:text-black group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-orange-500/20">
              <Feather className="h-8 w-8 fill-brand-orange text-brand-orange" />
            </div>
          </Link>
          <h1 className="text-4xl font-black tracking-tight text-black dark:text-white mb-2">Join DevBlog</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-center">Start sharing your technical insights with the world</p>
        </div>
        <Card className="border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden border border-black/5 dark:border-white/5">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                          <Input 
                            placeholder="John Doe" 
                            {...field} 
                            disabled={isLoading} 
                            className="h-14 pl-12 rounded-2xl border-black/5 bg-black/5 dark:border-white/5 dark:bg-white/5 focus-visible:ring-brand-orange focus-visible:border-brand-orange font-medium" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                          <Input 
                            placeholder="name@example.com" 
                            {...field} 
                            disabled={isLoading} 
                            className="h-14 pl-12 rounded-2xl border-black/5 bg-black/5 dark:border-white/5 dark:bg-white/5 focus-visible:ring-brand-orange focus-visible:border-brand-orange font-medium" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            disabled={isLoading} 
                            className="h-14 pl-12 rounded-2xl border-black/5 bg-black/5 dark:border-white/5 dark:bg-white/5 focus-visible:ring-brand-orange focus-visible:border-brand-orange font-medium" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-brand-orange hover:bg-brand-orange/90 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-[0.98] mt-4" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Form>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black/5 dark:border-white/5" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                <span className="bg-white dark:bg-zinc-900 px-4 text-zinc-400">Or sign up with</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full h-14 border-2 border-black/10 dark:border-white/10 rounded-2xl font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            >
              <Globe className="mr-2 h-5 w-5" />
              Github
            </Button>
          </CardContent>
          <CardFooter className="p-8 bg-black/[0.02] dark:bg-white/[0.02] flex justify-center border-t border-black/5 dark:border-white/5">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="font-black text-brand-orange hover:underline decoration-2 underline-offset-4">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
