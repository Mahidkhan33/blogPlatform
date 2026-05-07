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
import { Feather, ArrowRight, Globe } from "lucide-react";
import { signIn } from "next-auth/react";
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});
export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Logged in successfully!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white dark:bg-black overflow-hidden px-6">
      {}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] bg-brand-orange/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] bg-brand-orange/5 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="group mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-black text-white dark:bg-white dark:text-black group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-orange-500/20">
              <Feather className="h-8 w-8 fill-brand-orange text-brand-orange" />
            </div>
          </Link>
          <h1 className="text-4xl font-black tracking-tight text-black dark:text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">Continue your technical journey</p>
        </div>
        <Card className="border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden border border-black/5 dark:border-white/5">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com" 
                          {...field} 
                          disabled={isLoading} 
                          className="h-14 rounded-2xl border-black/5 bg-black/5 dark:border-white/5 dark:bg-white/5 focus-visible:ring-brand-orange focus-visible:border-brand-orange font-medium" 
                        />
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
                      <div className="flex items-center justify-between">
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Password</FormLabel>
                          <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-brand-orange hover:opacity-80">Forgot?</Link>
                      </div>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          disabled={isLoading} 
                          className="h-14 rounded-2xl border-black/5 bg-black/5 dark:border-white/5 dark:bg-white/5 focus-visible:ring-brand-orange focus-visible:border-brand-orange font-medium" 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-brand-orange hover:bg-brand-orange/90 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-[0.98]" 
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Sign In"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Form>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black/5 dark:border-white/5" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                <span className="bg-white dark:bg-zinc-900 px-4 text-zinc-400">Or continue with</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full h-14 border-2 border-black/10 dark:border-white/10 rounded-2xl font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              <Globe className="mr-2 h-5 w-5" />
              Github
            </Button>
          </CardContent>
          <CardFooter className="p-8 bg-black/[0.02] dark:bg-white/[0.02] flex justify-center border-t border-black/5 dark:border-white/5">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Don't have an account?{" "}
              <Link href="/register" className="font-black text-brand-orange hover:underline decoration-2 underline-offset-4">
                Join DevBlog
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
