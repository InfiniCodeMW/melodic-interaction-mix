
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LyricsQuoteForm = () => {
  const { toast } = useToast();
  const [lyrics, setLyrics] = useState("");
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [meaning, setMeaning] = useState("");
  const [story, setStory] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("lyrics_quotes").insert({
        lyrics,
        song,
        artist,
        meaning,
        story,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lyrics quote created successfully!",
      });

      // Reset form
      setLyrics("");
      setSong("");
      setArtist("");
      setMeaning("");
      setStory("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Create Lyrics Quote</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Lyrics"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white"
        />
        <Input
          placeholder="Song"
          value={song}
          onChange={(e) => setSong(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white"
        />
        <Input
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white"
        />
        <Textarea
          placeholder="Meaning (optional)"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          className="bg-white/10 border-white/20 text-white"
        />
        <Textarea
          placeholder="Story (optional)"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className="bg-white/10 border-white/20 text-white"
        />
        <Button type="submit">Create Lyrics Quote</Button>
      </form>
    </div>
  );
};

export default LyricsQuoteForm;
