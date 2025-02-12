
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  // Blog post form state
  const [blogTitle, setBlogTitle] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");

  // Lyrics quote form state
  const [lyrics, setLyrics] = useState("");
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [meaning, setMeaning] = useState("");
  const [story, setStory] = useState("");

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!adminUser) {
      navigate("/");
      toast({
        title: "Access Denied",
        description: "You do not have admin privileges.",
        variant: "destructive",
      });
    } else {
      setIsAdmin(true);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("blog_posts").insert({
        title: blogTitle,
        excerpt: blogExcerpt,
        content: blogContent,
        author: blogAuthor,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post created successfully!",
      });

      // Reset form
      setBlogTitle("");
      setBlogExcerpt("");
      setBlogContent("");
      setBlogAuthor("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLyricsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("lyrics_quotes").insert({
        lyrics,
        song,
        artist,
        meaning,
        story,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lyrics quote created successfully!",
      });

      // Reset form
      setLyrics("");
      setSong("");
      setArtist("");
      setMeaning("");
      setStory("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <Button
            variant="outline"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/");
            }}
          >
            Sign Out
          </Button>
        </div>

        {/* Blog Post Form */}
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Create Blog Post</h2>
          <form onSubmit={handleBlogSubmit} className="space-y-4">
            <Input
              placeholder="Title"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white"
            />
            <Input
              placeholder="Excerpt"
              value={blogExcerpt}
              onChange={(e) => setBlogExcerpt(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white"
            />
            <Textarea
              placeholder="Content"
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white min-h-[200px]"
            />
            <Input
              placeholder="Author"
              value={blogAuthor}
              onChange={(e) => setBlogAuthor(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white"
            />
            <Button type="submit">Create Blog Post</Button>
          </form>
        </div>

        {/* Lyrics Quote Form */}
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Create Lyrics Quote</h2>
          <form onSubmit={handleLyricsSubmit} className="space-y-4">
            <Textarea
              placeholder="Lyrics"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white"
            />
            <Input
              placeholder="Song"
              value={song}
              onChange={(e) => setSong(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white"
            />
            <Input
              placeholder="Artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white"
            />
            <Textarea
              placeholder="Meaning (optional)"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
            <Textarea
              placeholder="Story (optional)"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
            <Button type="submit">Create Lyrics Quote</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
