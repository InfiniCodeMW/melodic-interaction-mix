
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Heart, MessageSquare, Send } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getClientIp } from "@/utils/ipAddress";

const LyricsQuotes = () => {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quotes, isLoading } = useQuery({
    queryKey: ['lyrics-quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lyrics_quote_details')
        .select(`
          *,
          likes (count),
          comments (count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const likeMutation = useMutation({
    mutationFn: async ({ quoteId }: { quoteId: string }) => {
      const ip = await getClientIp();
      const { error } = await supabase
        .from('likes')
        .insert({ lyrics_quote_id: quoteId, device_ip: ip });
      
      if (error && error.code === '23505') {
        // Unique constraint violation - user already liked
        await supabase
          .from('likes')
          .delete()
          .match({ lyrics_quote_id: quoteId, device_ip: ip });
      } else if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lyrics-quotes'] });
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
    mutationFn: async ({ quoteId, content, guestName }: { quoteId: string; content: string; guestName: string }) => {
      const ip = await getClientIp();
      const { error } = await supabase
        .from('comments')
        .insert({
          lyrics_quote_id: quoteId,
          content,
          device_ip: ip,
          guest_name: guestName,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lyrics-quotes'] });
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

  const handleLike = async (quoteId: string) => {
    likeMutation.mutate({ quoteId });
  };

  const handleComment = async (quoteId: string) => {
    if (!comment.trim() || !guestName.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a name and a comment",
        variant: "destructive",
      });
      return;
    }

    commentMutation.mutate({
      quoteId,
      content: comment,
      guestName: guestName,
    });
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="font-outfit text-4xl font-bold text-white mb-4 hover:scale-105 transition-transform duration-300">
            Behind the Lyrics
          </h2>
          <p className="font-inter text-gray-400">
            Explore the meaning behind our most impactful verses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quotes?.map((quote, index) => (
            <Card 
              key={quote.id} 
              className="bg-gray-900 border-gray-700 hover:scale-105 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader>
                <CardTitle className="text-white text-xl">"{quote.lyrics}"</CardTitle>
                <CardDescription className="text-gray-400">
                  From "{quote.song}" by {quote.artist}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quote.meaning && (
                    <div>
                      <h4 className="text-secondary font-semibold mb-2">Meaning</h4>
                      <p className="text-gray-300">{quote.meaning}</p>
                    </div>
                  )}
                  {quote.story && (
                    <div>
                      <h4 className="text-secondary font-semibold mb-2">The Story</h4>
                      <p className="text-gray-300">{quote.story}</p>
                    </div>
                  )}
                  
                  {/* Comments Section */}
                  {selectedQuote === quote.id && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
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
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleComment(quote.id)}
                            className="flex-1"
                          >
                            Post <Send className="ml-2 h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => setSelectedQuote(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleLike(quote.id)}
                        className="flex items-center text-gray-400 hover:text-secondary transition-colors"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{quote.likes?.[0]?.count || 0}</span>
                      </button>
                      <button 
                        onClick={() => setSelectedQuote(selectedQuote === quote.id ? null : quote.id)}
                        className="flex items-center text-gray-400 hover:text-secondary transition-colors"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{quote.comments?.[0]?.count || 0}</span>
                      </button>
                    </div>
                    {quote.admin_email && (
                      <span className="text-sm text-secondary">
                        Posted by {quote.admin_email}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LyricsQuotes;
