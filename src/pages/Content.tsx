
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SidebarNav } from "@/components/admin/SidebarNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BlogPostForm from "@/components/admin/BlogPostForm";
import LyricsQuoteForm from "@/components/admin/LyricsQuoteForm";

interface BlogPost {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  created_at: string;
  published: boolean;
}

interface LyricsQuote {
  id: string;
  lyrics: string;
  song: string;
  artist: string;
  created_at: string;
}

const Content = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [lyricsQuotes, setLyricsQuotes] = useState<LyricsQuote[]>([]);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showLyricsForm, setShowLyricsForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
    fetchContent();
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

  const fetchContent = async () => {
    try {
      // Fetch blog posts
      const { data: posts, error: postsError } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;
      setBlogPosts(posts || []);

      // Fetch lyrics quotes
      const { data: quotes, error: quotesError } = await supabase
        .from("lyrics_quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (quotesError) throw quotesError;
      setLyricsQuotes(quotes || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, type: 'blog' | 'lyrics') => {
    try {
      const { error } = await supabase
        .from(type === 'blog' ? 'blog_posts' : 'lyrics_quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (type === 'blog') {
        setBlogPosts(blogPosts.filter(post => post.id !== id));
      } else {
        setLyricsQuotes(lyricsQuotes.filter(quote => quote.id !== id));
      }

      toast({
        title: "Success",
        description: `${type === 'blog' ? 'Blog post' : 'Lyrics quote'} deleted successfully.`,
      });
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
    <div className="min-h-screen bg-primary">
      <div className="flex">
        <SidebarNav />
        <main className="flex-1">
          <div className="sticky top-0 z-10 bg-primary border-b border-gray-800 p-8">
            <h1 className="text-3xl font-bold text-white">Content Management</h1>
          </div>
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <Tabs defaultValue="blog" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="blog">Blog Posts</TabsTrigger>
                  <TabsTrigger value="lyrics">Lyrics Quotes</TabsTrigger>
                </TabsList>

                <TabsContent value="blog" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
                    <Button onClick={() => setShowBlogForm(!showBlogForm)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {showBlogForm ? 'Close Form' : 'New Blog Post'}
                    </Button>
                  </div>
                  
                  {showBlogForm && (
                    <div className="mb-8">
                      <BlogPostForm />
                    </div>
                  )}

                  <div className="rounded-md border border-gray-800">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-white">Title</TableHead>
                          <TableHead className="text-white">Author</TableHead>
                          <TableHead className="text-white">Status</TableHead>
                          <TableHead className="text-white">Created</TableHead>
                          <TableHead className="text-white text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blogPosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium text-white">{post.title}</TableCell>
                            <TableCell className="text-white">{post.author}</TableCell>
                            <TableCell className="text-white">
                              {post.published ? 'Published' : 'Draft'}
                            </TableCell>
                            <TableCell className="text-white">
                              {new Date(post.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="icon"
                                  onClick={() => handleDelete(post.id, 'blog')}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="lyrics" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Lyrics Quotes</h2>
                    <Button onClick={() => setShowLyricsForm(!showLyricsForm)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {showLyricsForm ? 'Close Form' : 'New Lyrics Quote'}
                    </Button>
                  </div>

                  {showLyricsForm && (
                    <div className="mb-8">
                      <LyricsQuoteForm />
                    </div>
                  )}

                  <div className="rounded-md border border-gray-800">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-white">Song</TableHead>
                          <TableHead className="text-white">Artist</TableHead>
                          <TableHead className="text-white">Lyrics Preview</TableHead>
                          <TableHead className="text-white">Created</TableHead>
                          <TableHead className="text-white text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lyricsQuotes.map((quote) => (
                          <TableRow key={quote.id}>
                            <TableCell className="font-medium text-white">{quote.song}</TableCell>
                            <TableCell className="text-white">{quote.artist}</TableCell>
                            <TableCell className="text-white">
                              {quote.lyrics.substring(0, 50)}...
                            </TableCell>
                            <TableCell className="text-white">
                              {new Date(quote.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="icon"
                                  onClick={() => handleDelete(quote.id, 'lyrics')}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Content;
