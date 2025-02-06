import { Play } from "lucide-react";

const Hero = () => {
  return (
    <div id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary/80">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-20 bg-cover bg-center" />
      
      <div className="relative z-10 text-center px-4 animate-fade-up">
        <h1 className="font-outfit text-5xl md:text-7xl font-bold text-white mb-6">
          Welcome to <span className="text-secondary">txtduo</span>
        </h1>
        <p className="font-inter text-xl md:text-2xl text-gray-300 mb-8">
          Singer & Rapper Duo | Hip-Hop & R&B
        </p>
        <a
          href="https://open.spotify.com/artist/txtduo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-medium py-3 px-6 rounded-full transition-colors"
        >
          <Play size={20} />
          Listen Now
        </a>
      </div>
    </div>
  );
};

export default Hero;