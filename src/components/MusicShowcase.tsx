
import { Music2, Youtube, Music, Headphones } from "lucide-react";

const MusicShowcase = () => {
  const platforms = [
    {
      name: "Spotify",
      icon: Music2,
      link: "https://open.spotify.com/artist/0JscCO1qtw0Hul9WkxQlVk",
      color: "bg-green-500",
      embedUrl: "https://open.spotify.com/embed/artist/0JscCO1qtw0Hul9WkxQlVk?utm_source=generator"
    },
    {
      name: "Apple Music",
      icon: Music,
      link: "https://music.apple.com/us/artist/thxt-duo/1582268484",
      color: "bg-red-500",
      embedUrl: "https://embed.music.apple.com/us/album/the-take-off/1713124967"
    },
    {
      name: "YouTube",
      icon: Youtube,
      link: "https://www.youtube.com/@thxtduo4028",
      color: "bg-red-600",
      embedUrl: "https://www.youtube.com/embed/b--cUrkN7Lk"
    }
  ];

  return (
    <section id="music" className="py-20 bg-gradient-to-b from-gray-900 to-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="font-outfit text-4xl font-bold text-white mb-4 hover:scale-105 transition-transform duration-300">
            Discover Our Music
          </h2>
          <p className="font-inter text-gray-400">
            Listen to our latest tracks and get a taste of our sound
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {platforms.map((platform, index) => (
            <a
              key={platform.name}
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-secondary/20 animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={`${platform.color} p-3 rounded-lg transition-transform group-hover:scale-110`}>
                  <platform.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-outfit text-xl font-semibold text-white group-hover:text-secondary transition-colors">
                  {platform.name}
                </h3>
              </div>
              <div className="mt-4">
                <p className="text-gray-400">Listen on {platform.name}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 mt-12">
          {platforms.map((platform, index) => platform.embedUrl && (
            <div 
              key={`${platform.name}-embed`} 
              className="w-full h-[352px] bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden transition-transform hover:scale-[1.02] animate-fade-up"
              style={{ animationDelay: `${(index + 3) * 150}ms` }}
            >
              <iframe
                src={platform.embedUrl}
                title={`${platform.name} Player`}
                className="w-full h-full border-0"
                sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                allow="autoplay; encrypted-media"
                loading="lazy"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MusicShowcase;
