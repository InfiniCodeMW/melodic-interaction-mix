
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, X, Heart, MessageSquare, Send } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getClientIp } from "@/utils/ipAddress";

const BlogSection = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_post_details')
        .select(`
          *,
          likes:likes(count),
          comments:comments(*)
        `)
        .order('created_at', { ascending: false });
  
      if (error) throw error;
      return data;
    },
  });
  
  const likeMutation = useMutation({
    mutationFn: async ({ postId }: { postId: string }) => {
      const ip = await getClientIp();
      const { error } = await supabase
        .from('likes')
        .insert({ blog_post_id: postId, device_ip: ip });
      
      if (error && error.code === '23505') {
        // Unique constraint violation - user already liked
        await supabase
          .from('likes')
          .delete()
          .match({ blog_post_id: postId, device_ip: ip });
      } else if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async ({ postId, content, guestName }: { postId: string; content: string; guestName: string }) => {
      const ip = await getClientIp();
      const { error } = await supabase
        .from('comments')
        .insert({
          blog_post_id: postId,
          content,
          device_ip: ip,
          guest_name: guestName,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setComment("");
      setGuestName("");
      toast({
        title: "Success",
        description: "Comment posted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    },
  });

  const handleLike = async (postId: string) => {
    likeMutation.mutate({ postId });
  };

  const handleComment = async (postId: string) => {
    if (!comment.trim() || !guestName.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a name and a comment",
        variant: "destructive",
      });
      return;
    }

    commentMutation.mutate({
      postId,
      content: comment,
      guestName: guestName,
    });
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
    setComment("");
    setGuestName("");
  };

  if (isLoading) {
    return (
      <section id="blog" className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-gray-900 border-gray-700">
                <div className="aspect-video w-full">
                  <Skeleton className="w-full h-full" />
                </div>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-10 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-outfit text-4xl font-bold text-white mb-4">
            Latest from the Blog
          </h2>
          <p className="font-inter text-gray-400">
            Stories, updates, and insights from our musical journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post) => (
            <Card key={post.id} className="bg-gray-900 border-gray-700 hover:border-secondary transition-colors">
              {post.image_url && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-white">{post.title}</CardTitle>
                <CardDescription className="text-gray-400">
                  {new Date(post.created_at).toLocaleDateString()} • By {post.admin_email || 'Anonymous'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-gray-400">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center hover:text-secondary transition-colors"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{post.likes?.[0]?.count || 0}</span>
                    </button>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-secondary hover:text-secondary hover:bg-gray-800"
                    onClick={() => openModal(post)}
                  >
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
              <h3 className="text-xl font-bold text-white">{selectedPost.title}</h3>
              <Button variant="ghost" onClick={closeModal} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="my-4">
              <div className="flex items-center space-x-2 text-gray-400 mb-4">
                <span>{new Date(selectedPost.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span>By {selectedPost.admin_email || 'Anonymous'}</span>
              </div>
              {selectedPost.image_url && (
                <img 
                  src={selectedPost.image_url} 
                  alt={selectedPost.title} 
                  className="w-full rounded-lg mb-4"
                />
              )}
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">{selectedPost.content}</p>
              </div>

              {/* Comments Display Section */}
<div className="mt-8 pt-4 border-t border-gray-700">
  <h4 className="text-lg font-semibold text-white mb-4">Comments</h4>
  {selectedPost.comments?.length > 0 ? (
    <div className="space-y-4">
      {selectedPost.comments.map((comment) => (
        <div key={comment.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">{comment.guest_name || "Anonymous"}</span>
            <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-gray-300">{comment.content}</p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-400">No comments yet. Be the first to comment!</p>
  )}
</div>

              {/* Comments Section */}
              <div className="mt-8 pt-4 border-t border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Leave a Comment</h4>
                <div className="space-y-4">
                  <Input
                    placeholder="Your Name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Textarea
                    placeholder="Write your comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button 
                    onClick={() => handleComment(selectedPost.id)}
                    className="w-full"
                  >
                    Post Comment <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                <button 
                  onClick={() => handleLike(selectedPost.id)}
                  className="flex items-center text-gray-400 hover:text-secondary transition-colors"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{selectedPost.likes?.[0]?.count || 0} likes</span>
                </button>
                <Button onClick={closeModal}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogSection;
