
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BlogPostForm = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("blog_posts").insert({
        title,
        excerpt,
        content,
        author,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post created successfully!",
      });

      // Reset form
      setTitle("");
      setExcerpt("");
      setContent("");
      setAuthor("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Create Blog Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white"
        />
        <Input
          placeholder="Excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white"
        />
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white min-h-[200px]"
        />
        <Input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white"
        />
        <Button type="submit">Create Blog Post</Button>
      </form>
    </div>
  );
};

export default BlogPostForm;
