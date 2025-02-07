
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const LyricsQuotes = () => {
  const quotes = [
    {
      id: 1,
      lyrics: "I pay no mind to the drama, I'm tht boy Ruebx",
      song: "Malawi Gin",
      artist: "JYC9_JR",
      meaning: "Speaks to avoiding drama.",
      story: "some guy in uni we call him ruebx his name is ctual Rueben so every their is drama brewing he woul either disappear or not pay attention to it"
    }
  ];

  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="font-outfit text-4xl font-bold text-white mb-4">
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
              className="bg-gray-900 border-gray-700 transform hover:scale-105 transition-all duration-300"
              style={{
                animation: `fade-in 0.5s ease-out forwards ${index * 0.2}s`,
                opacity: 0
              }}
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
