"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Sparkles, Wand2, RefreshCw, Check, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
interface AIAssistantProps {
  onApply: (data: { title: string; excerpt: string; content: string; tags?: string[] }) => void;
}
export function AIAssistant({ onApply }: AIAssistantProps) {
  const [mounted, setMounted] = useState(false);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    title: string;
    excerpt: string;
    content: string;
    tags?: string[];
  } | null>(null);
  useEffect(() => {
    setMounted(true);
  }, []);
  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for the AI to write about");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, keyPoints }),
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedResult(data);
        toast.success("AI Draft generated! Review and apply it below.");
      } else {
        throw new Error(data.message || "Failed to generate AI content");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong with the AI assistant");
      console.error("AI Assistant Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleApply = () => {
    if (generatedResult) {
      onApply(generatedResult);
      setIsPreviewOpen(false);
      toast.success("AI content applied to editor!");
    }
  };
  return (
    <Card className="border-black/5 dark:border-white/5 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden rounded-2xl">
      <CardHeader className="border-b border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-black/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-orange/10 text-brand-orange rounded-xl">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">AI Assistant</CardTitle>
            <CardDescription className="text-xs">Draft your post with AI</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        {}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Topic</Label>
            <Textarea 
              placeholder="E.g., The future of AI..." 
              className="min-h-[80px] rounded-xl border-black/10 dark:border-white/10 bg-transparent focus-visible:ring-brand-orange text-sm resize-none"
              value={topic}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Tone</Label>
            <Select 
              value={tone} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTone(e.target.value)}
              className="rounded-xl border-black/10 dark:border-white/10 bg-transparent focus:ring-brand-orange h-10"
            >
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="bold">Bold & Edgy</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Key Points (Optional)</Label>
            <Textarea 
              placeholder="Important details to cover..." 
              className="min-h-[80px] rounded-xl border-black/10 dark:border-white/10 bg-transparent focus-visible:ring-brand-orange text-sm resize-none"
              value={keyPoints}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKeyPoints(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold h-11 rounded-xl shadow-sm transition-all"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? "Generating..." : "Generate Draft"}
          </Button>
        </div>
        {}
        {generatedResult && (
          <div className="pt-5 border-t border-black/5 dark:border-white/5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="p-4 rounded-xl bg-brand-orange/5 border border-brand-orange/10 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-orange">Preview</span>
                    <Wand2 className="h-4 w-4 text-brand-orange" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-bold leading-tight">{generatedResult.title}</p>
                </div>
                <div className="space-y-1">
                    <div 
                      className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-4"
                      dangerouslySetInnerHTML={{ __html: generatedResult.content }}
                    />
                </div>
                <div className="space-y-2 pt-2">
                    <Button 
                      variant="outline"
                      onClick={() => setIsPreviewOpen(true)}
                      className="w-full font-bold h-10 rounded-xl"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      View Full Draft
                    </Button>
                    <Button 
                      onClick={handleApply}
                      className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold h-10 rounded-xl"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Apply to Editor
                    </Button>
                </div>
             </div>
          </div>
        )}
      </CardContent>
      {}
      {isPreviewOpen && generatedResult && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <h2 className="text-xl font-black">Full Draft Preview</h2>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-8 space-y-6">
              <h1 className="text-4xl font-black leading-tight">{generatedResult.title}</h1>
              {generatedResult.tags && generatedResult.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {generatedResult.tags.map(t => (
                    <span key={t} className="px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-widest rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm italic text-zinc-600 dark:text-zinc-400">
                {generatedResult.excerpt}
              </div>
              <div 
                className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: generatedResult.content }}
              />
            </div>
            <div className="p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsPreviewOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApply} className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-xl px-6">
                <Check className="h-4 w-4 mr-2" />
                Apply to Post
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </Card>
  );
}
