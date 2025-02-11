
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const LyricsQuotes = () => {
  const quotes = [
    {
      id: 1,
      lyrics: "I pay no mind to the drama, I'm tht boy Ruebx",
      song: "Malawi Gin",
      artist: "JYC9_JR",
      meaning: "Speaks to avoiding drama and staying focused on one's path.",
      story: "Some guy in uni we call him ruebx his name is actual Rueben so every their is drama brewing he would either disappear or not pay attention to it"
    },
    {
      id: 2,
      lyrics: "Life's a journey, not a race, taking steps at my own pace",
      song: "The Take Off",
      artist: "THXT DUO",
      meaning: "Emphasizes personal growth and self-paced progress.",
      story: "Written during a period of reflection about our musical journey and growth as artists."
    },
    {
      id: 3,
      lyrics: "Every verse tells a story, every beat holds a memory",
      song: "Rhythms of Life",
      artist: "THXT DUO",
      meaning: "Highlights how music captures moments and memories.",
      story: "Inspired by our experiences creating music together and the stories behind each track."
    }
  ];

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
          {quotes.map((quote, index) => (
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
                  <div>
                    <h4 className="text-secondary font-semibold mb-2">Meaning</h4>
                    <p className="text-gray-300">{quote.meaning}</p>
                  </div>
                  <div>
                    <h4 className="text-secondary font-semibold mb-2">The Story</h4>
                    <p className="text-gray-300">{quote.story}</p>
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
