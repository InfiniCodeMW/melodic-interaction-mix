
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SidebarNav } from "@/components/admin/SidebarNav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string | null;
  blog_post_id: string | null;
  lyrics_quote_id: string | null;
  approved: boolean | null;
  guest_name: string | null;
  device_ip: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  updated_at: string;
  profiles?: {
    email: string | null;
  } | null;
  blog_posts?: {
    title: string;
  } | null;
}

const Comments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
    fetchComments();
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
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles (
            email
          ),
          blog_posts (
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setComments(data || []);
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

  const handleApproval = async (commentId: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from("comments")
        .update({ approved: approve })
        .eq("id", commentId);

      if (error) throw error;

      setComments(comments.map(comment =>
        comment.id === commentId ? { ...comment, approved: approve } : comment
      ));

      toast({
        title: "Success",
        description: `Comment ${approve ? 'approved' : 'rejected'} successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="flex">
        <SidebarNav />
        <main className="flex-1">
          <div className="sticky top-0 z-10 bg-primary border-b border-gray-800 p-8">
            <h1 className="text-3xl font-bold text-white">Comments Management</h1>
          </div>
          <div className="p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {isLoading ? (
                <div className="text-center text-white">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="text-center text-white">No comments to review</div>
              ) : (
                comments.map((comment) => (
                  <Card key={comment.id} className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">
                            {comment.profiles?.email || comment.guest_name || 'Anonymous'}
                          </CardTitle>
                          <CardDescription>
                            {format(new Date(comment.created_at), "PPP")}
                          </CardDescription>
                        </div>
                        <Badge variant={comment.approved ? "default" : "secondary"}>
                          {comment.approved ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white">{comment.content}</p>
                      {comment.blog_posts && (
                        <p className="mt-2 text-sm text-gray-400">
                          On post: {comment.blog_posts.title}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      {!comment.approved && (
                        <>
                          <Button
                            variant="destructive"
                            onClick={() => handleApproval(comment.id, false)}
                          >
                            Reject
                          </Button>
                          <Button
                            onClick={() => handleApproval(comment.id, true)}
                          >
                            Approve
                          </Button>
                        </>
                      )}
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Comments;
