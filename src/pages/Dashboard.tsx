
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SidebarNav } from "@/components/admin/SidebarNav";
import BlogPostForm from "@/components/admin/BlogPostForm";
import LyricsQuoteForm from "@/components/admin/LyricsQuoteForm";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

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

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="flex">
        <SidebarNav />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-6">
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

            <Separator className="my-6" />

            <Tabs defaultValue="blog" className="space-y-6">
              <TabsList>
                <TabsTrigger value="blog">Blog Posts</TabsTrigger>
                <TabsTrigger value="lyrics">Lyrics Quotes</TabsTrigger>
              </TabsList>

              <TabsContent value="blog" className="space-y-6">
                <BlogPostForm />
              </TabsContent>

              <TabsContent value="lyrics" className="space-y-6">
                <LyricsQuoteForm />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
