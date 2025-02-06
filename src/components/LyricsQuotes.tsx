import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const LyricsQuotes = () => {
  const quotes = [
    {
      id: 1,
      lyrics: "Through the city lights, we chase our dreams tonight",
      song: "City Dreams",
      artist: "Sarah Chen",
      meaning: "Represents the pursuit of ambitions in an urban landscape, reflecting the duo's journey in the music industry.",
      story: "Written during a late-night studio session, inspired by the view of the city skyline from our recording booth."
    },
    {
      id: 2,
      lyrics: "Breaking barriers, no time for carriers, we're just warriors",
      song: "No Limits",
      artist: "Marcus Rodriguez",
      meaning: "Speaks to overcoming obstacles and refusing to be limited by conventions or expectations.",
      story: "This verse came to Marcus during a breakthrough moment after facing initial skepticism about our unique musical style."
    },
    {
      id: 3,
      lyrics: "Harmony in chaos, that's where we found our sound",
      song: "Perfect Blend",
      artist: "Sarah Chen & Marcus Rodriguez",
      meaning: "Describes how txtduo's distinct style emerged from combining their different musical backgrounds.",
      story: "Created during their first successful collaboration, capturing the moment they realized their unique chemistry."
    }
  ];

  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-outfit text-4xl font-bold text-white mb-4">
            Behind the Lyrics
          </h2>
          <p className="font-inter text-gray-400">
            Explore the meaning behind our most impactful verses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quotes.map((quote) => (
            <Card key={quote.id} className="bg-gray-900 border-gray-700">
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