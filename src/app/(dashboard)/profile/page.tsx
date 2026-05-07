"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Mail, Shield, Camera, Loader2, Save } from "lucide-react";
export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    image: "",
  });
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        bio: (session.user as any).bio || "",
        image: session.user.image || "",
      });
      setIsLoading(false);
    }
  }, [session]);
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, image: data.secure_url }));
        toast.success("Profile image uploaded!");
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await update({ name: formData.name, image: formData.image, bio: formData.bio });
        toast.success("Profile updated successfully!");
      } else {
        const error = await res.json();
        throw new Error(error.message || "Failed to update profile");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="bg-white dark:bg-black border-b border-black/5 dark:border-white/5">
        <div className="container mx-auto max-w-4xl px-6 py-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-8 bg-brand-orange rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">Account</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">Your Profile</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1">Manage your personal information and preferences.</p>
        </div>
      </div>
      <div className="container mx-auto max-w-4xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          <div className="space-y-6">
            <Card className="p-6 text-center shadow-sm border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
              <div className="relative mx-auto mb-4 h-32 w-32">
                <Avatar className="h-32 w-32 border-4 border-white dark:border-zinc-800 shadow-xl">
                  {formData.image && <AvatarImage src={formData.image} />}
                  <AvatarFallback className="text-3xl bg-brand-orange/10 text-brand-orange font-black">
                    {formData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 rounded-full bg-brand-orange p-2.5 text-white shadow-lg hover:bg-brand-orange/90 transition-colors cursor-pointer">
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              </div>
              <h2 className="text-xl font-black tracking-tight">{formData.name}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{formData.email}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange">
                <Shield className="h-3 w-3" />
                {(session?.user as any).role || "User"}
              </div>
            </Card>
          </div>
          <Card className="p-8 shadow-sm border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-11 h-12 rounded-xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.03] focus-visible:ring-brand-orange font-medium"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      id="email"
                      value={formData.email}
                      disabled
                      className="pl-11 h-12 rounded-xl border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-800/50 font-medium"
                    />
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Email cannot be changed.</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Bio</Label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="flex min-h-[120px] w-full rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.03] px-4 py-3 text-sm ring-offset-background placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-orange disabled:cursor-not-allowed disabled:opacity-50 font-medium resize-none"
                  placeholder="Tell us a little about yourself..."
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isSaving} 
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white min-w-[160px] gap-2 font-bold uppercase tracking-widest text-xs rounded-full h-12 shadow-lg shadow-orange-500/20 transition-all hover:scale-105"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
