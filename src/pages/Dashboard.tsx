import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SidebarNav } from "@/components/admin/SidebarNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Quote, MessageSquare, ThumbsUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

interface ContentStats {
  blogPosts: number;
  lyricsQuotes: number;
  comments: number;
  likes: number;
}

interface TimeSeriesData {
  date: string;
  comments: number;
  likes: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<ContentStats>({
    blogPosts: 0,
    lyricsQuotes: 0,
    comments: 0,
    likes: 0,
  });
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
    fetchStats();
    fetchTimeSeriesData();
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
        { count: likesCount },
      ] = await Promise.all([
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("lyrics_quotes").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
        supabase.from("likes").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        blogPosts: blogCount || 0,
        lyricsQuotes: lyricsCount || 0,
        comments: commentsCount || 0,
        likes: likesCount || 0,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchTimeSeriesData = async () => {
    try {
      const startDate = subDays(new Date(), 30);
      
      const { data: comments } = await supabase
        .from("comments")
        .select("created_at")
        .gte("created_at", startDate.toISOString());

      const { data: likes } = await supabase
        .from("likes")
        .select("created_at")
        .gte("created_at", startDate.toISOString());

      const dateMap = new Map<string, { comments: number; likes: number }>();
      
      for (let i = 0; i < 30; i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        dateMap.set(date, { comments: 0, likes: 0 });
      }

      comments?.forEach((comment) => {
        const date = format(parseISO(comment.created_at), 'yyyy-MM-dd');
        if (dateMap.has(date)) {
          const current = dateMap.get(date)!;
          dateMap.set(date, { ...current, comments: current.comments + 1 });
        }
      });

      likes?.forEach((like) => {
        const date = format(parseISO(like.created_at), 'yyyy-MM-dd');
        if (dateMap.has(date)) {
          const current = dateMap.get(date)!;
          dateMap.set(date, { ...current, likes: current.likes + 1 });
        }
      });

      const timeSeriesArray = Array.from(dateMap.entries())
        .map(([date, counts]) => ({
          date,
          ...counts
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setTimeSeriesData(timeSeriesArray);
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

  if (!isAdmin || isLoading) {
    return (
      <div className="min-h-screen bg-primary">
        <div className="flex">
          <SidebarNav />
          <main className="flex-1">
            <div className="sticky top-0 z-10 bg-primary border-b border-gray-800 p-8">
              <Skeleton className="h-10 w-48 bg-gray-800" />
            </div>
            <div className="p-8">
              <div className="max-w-7xl mx-auto space-y-8">
                <div className="grid gap-6 md:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="bg-gray-900/50 border-gray-800">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-24 bg-gray-800" />
                        <Skeleton className="h-4 w-4 bg-gray-800" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-8 w-16 mb-1 bg-gray-800" />
                        <Skeleton className="h-4 w-32 bg-gray-800" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {[...Array(2)].map((_, i) => (
                    <Card key={i} className="bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <Skeleton className="h-6 w-48 bg-gray-800" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-[300px] w-full bg-gray-800" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
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
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="grid gap-6 md:grid-cols-4">
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
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">
                      Likes
                    </CardTitle>
                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.likes}</div>
                    <p className="text-xs text-muted-foreground">
                      Total content likes
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-white">
                      Comments Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={timeSeriesData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#9CA3AF"
                            tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
                          />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937',
                              border: '1px solid #374151',
                              borderRadius: '0.375rem',
                              color: '#E5E7EB'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="comments"
                            stroke="#3B82F6"
                            fill="#3B82F6"
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-white">
                      Likes Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={timeSeriesData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#9CA3AF"
                            tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
                          />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937',
                              border: '1px solid #374151',
                              borderRadius: '0.375rem',
                              color: '#E5E7EB'
                            }}
                          />
                          <Bar
                            dataKey="likes"
                            fill="#10B981"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
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
