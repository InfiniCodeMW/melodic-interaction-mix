
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, X, Heart, MessageSquare } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

const BlogSection = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          likes (count),
          comments (count),
          profiles (username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
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
                  {new Date(post.created_at).toLocaleDateString()} • By {post.author}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-gray-400">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{post.likes?.[0]?.count || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{post.comments?.[0]?.count || 0}</span>
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
                <span>By {selectedPost.author}</span>
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
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-4 text-gray-400">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>{selectedPost.likes?.[0]?.count || 0} likes</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{selectedPost.comments?.[0]?.count || 0} comments</span>
                  </div>
                </div>
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
