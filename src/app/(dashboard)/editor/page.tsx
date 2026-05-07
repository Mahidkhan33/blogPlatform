"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TipTapEditor from "@/components/editor/TipTapEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, Send, Save, ArrowLeft, Tag as TagIcon, X } from "lucide-react";
import Link from "next/link";
import { AIAssistant } from "@/components/editor/AIAssistant";
import { cn } from "@/lib/utils";
export default function NewPostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const handleApplyAI = (data: { title: string; excerpt: string; content: string; tags?: string[] }) => {
    setTitle(data.title);
    setExcerpt(data.excerpt);
    setContent(data.content);
    if (data.tags && data.tags.length > 0) {
      setTags((prev) => Array.from(new Set([...prev, ...data.tags!])));
    }
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setCoverImage(data.secure_url);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  const handleSubmit = async (status: "draft" | "published") => {
    if (!title || !content) {
      toast.error("Please provide both title and content");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          tags,
          coverImage,
          status,
        }),
      });
      if (res.ok) {
        toast.success(status === "published" ? "Post published!" : "Draft saved!");
        router.push("/dashboard/posts");
      } else {
        const data = await res.json();
        throw new Error(data.message || "Failed to save post");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container mx-auto max-w-[1600px] px-4 py-8">
      {}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/posts">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-black tracking-tight">Create New Post</h1>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleSubmit("draft")}
            disabled={isLoading}
            className="gap-2 font-bold rounded-full px-6"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSubmit("published")}
            disabled={isLoading}
            className="gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white font-black rounded-full px-6 shadow-lg shadow-orange-500/20"
          >
            <Send className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {}
        <div className="lg:col-span-3 order-2 lg:order-1 sticky top-8">
          <AIAssistant onApply={handleApplyAI} />
        </div>
        {}
        <div className="lg:col-span-6 space-y-6 order-1 lg:order-2 mt-2">
          <Input
            id="title"
            placeholder="Post Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl md:text-4xl font-black h-auto py-2 border-0 bg-transparent px-0 focus-visible:ring-0 shadow-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
          />
          <div className="min-h-[500px]">
            <TipTapEditor content={content} onChange={setContent} />
          </div>
        </div>
        {}
        <div className="space-y-6 lg:col-span-3 order-3">
          {}
          <Card className="border-black/5 dark:border-white/5 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden rounded-2xl">
            <CardHeader className="border-b border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-black/20 pb-3 pt-4">
              <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {coverImage ? (
                <div className="relative group rounded-xl overflow-hidden shadow-inner">
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setCoverImage("")}
                      className="font-bold rounded-full"
                    >
                      Remove Image
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-brand-orange/5 hover:border-brand-orange/30 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-3 group-hover:bg-brand-orange/10 transition-colors">
                      <ImagePlus className="w-6 h-6 text-zinc-400 group-hover:text-brand-orange transition-colors" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-brand-orange transition-colors">
                      {isUploading ? "Uploading..." : "Upload Cover"}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              )}
            </CardContent>
          </Card>
          <Card className="border-black/5 dark:border-white/5 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden rounded-2xl">

            <CardHeader className="border-b border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-black/20 pb-3 pt-4">
              <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Excerpt</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <textarea
                placeholder="Brief summary of your post..."
                className="w-full min-h-[100px] rounded-xl border-black/10 dark:border-white/10 bg-transparent px-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-orange disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </CardContent>
          </Card>
          <Card className="border-black/5 dark:border-white/5 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden rounded-2xl">

            <CardHeader className="border-b border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-black/20 pb-3 pt-4">
              <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Tags</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <TagIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  placeholder="Add tags (press Enter)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="pl-9 rounded-xl h-10 border-black/10 dark:border-white/10 bg-transparent focus-visible:ring-brand-orange text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
