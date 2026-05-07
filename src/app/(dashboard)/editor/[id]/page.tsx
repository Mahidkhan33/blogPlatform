"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TipTapEditor from "@/components/editor/TipTapEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, Send, Save, ArrowLeft, Tag as TagIcon, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        if (data.author._id !== (session?.user as any)?.id && (session?.user as any)?.role !== "admin") {
           toast.error("You don't have permission to edit this post");
           router.push("/dashboard/posts");
           return;
        }
        setTitle(data.title);
        setContent(data.content);
        setExcerpt(data.excerpt || "");
        setTags(data.tags || []);
        setCoverImage(data.coverImage || "");
      } catch (error) {
        toast.error("Failed to load post");
        router.push("/dashboard/posts");
      } finally {
        setIsLoading(false);
      }
    };
    if (session?.user) {
      fetchPost();
    }
  }, [params.id, session, router]);
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
    setIsSaving(true);
    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: "PUT",
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
        toast.success(status === "published" ? "Post updated and published!" : "Draft updated!");
        router.push("/dashboard/posts");
      } else {
        const data = await res.json();
        throw new Error(data.message || "Failed to update post");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-orange" />
      </div>
    );
  }
  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/posts">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-brand-orange/10 hover:text-brand-orange transition-all">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-6 bg-brand-orange rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">Editor</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Edit Post</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleSubmit("draft")}
            disabled={isSaving}
            className="gap-2 font-bold rounded-full px-6 border-black/5 dark:border-white/5 hover:bg-brand-orange/5 hover:border-brand-orange/20 hover:text-brand-orange transition-all"
          >
            <Save className="h-4 w-4" />
            Update Draft
          </Button>
          <Button
            onClick={() => handleSubmit("published")}
            disabled={isSaving}
            className="gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white font-black rounded-full px-6 shadow-lg shadow-orange-500/20"
          >
            <Send className="h-4 w-4" />
            Update & Publish
          </Button>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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
        <div className="space-y-6">
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
                className="w-full min-h-[100px] rounded-xl border-black/10 dark:border-white/10 bg-transparent px-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-orange disabled:cursor-not-allowed disabled:opacity-50 resize-none font-medium"
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
