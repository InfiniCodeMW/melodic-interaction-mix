
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SidebarNav } from "@/components/admin/SidebarNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Quote, MessageSquare } from "lucide-react";

interface ContentStats {
  blogPosts: number;
  lyricsQuotes: number;
  comments: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<ContentStats>({
    blogPosts: 0,
    lyricsQuotes: 0,
    comments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
    fetchStats();
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

  const fetchStats = async () => {
    try {
      const [
        { count: blogCount },
        { count: lyricsCount },
        { count: commentsCount },
      ] = await Promise.all([
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("lyrics_quotes").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        blogPosts: blogCount || 0,
        lyricsQuotes: lyricsCount || 0,
        comments: commentsCount || 0,
      });
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

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="flex">
        <SidebarNav />
        <main className="flex-1">
          <div className="sticky top-0 z-10 bg-primary border-b border-gray-800 p-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          </div>
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">
                      Blog Posts
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.blogPosts}</div>
                    <p className="text-xs text-muted-foreground">
                      Total published articles
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">
                      Lyrics Quotes
                    </CardTitle>
                    <Quote className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.lyricsQuotes}</div>
                    <p className="text-xs text-muted-foreground">
                      Total quotes added
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">
                      Comments
                    </CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.comments}</div>
                    <p className="text-xs text-muted-foreground">
                      Total user comments
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
