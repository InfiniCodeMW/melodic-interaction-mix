
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

const LyricsQuotes = () => {
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
                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <span className="text-sm text-gray-400">
                      {quote.likes?.[0]?.count || 0} likes • {quote.comments?.[0]?.count || 0} comments
                    </span>
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
