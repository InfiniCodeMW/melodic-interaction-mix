
import { Play, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <div id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#2D1B69] via-[#1A1F2C] to-[#FF1B6B]/80">
      <div className="absolute inset-0 bg-[url('/images/hero.jpg')] opacity-20 bg-cover bg-center mix-blend-overlay" />
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        <Sparkles className="absolute animate-pulse text-secondary/50 w-8 h-8 top-1/4 left-1/4" />
        <Sparkles className="absolute animate-pulse delay-300 text-secondary/50 w-6 h-6 top-1/3 right-1/4" />
        <Sparkles className="absolute animate-pulse delay-700 text-secondary/50 w-7 h-7 bottom-1/4 right-1/3" />
      </div>
      
      <div className="relative z-10 text-center px-4 animate-fade-up">
        <h1 className="font-outfit text-5xl md:text-7xl font-bold text-white mb-6 hover:scale-105 transition-transform duration-300">
          Welcome to <span className="text-secondary bg-clip-text">ThxtDuo</span>
        </h1>
        <p className="font-inter text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in">
          Singer & Rapper Duo | Hip-Hop & R&B
        </p>
        <a
          href="https://open.spotify.com/artist/0JscCO1qtw0Hul9WkxQlVk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-secondary/20"
        >
          <Play size={20} className="animate-pulse" />
          Listen Now
        </a>
      </div>
    </div>
  );
};

export default Hero;
