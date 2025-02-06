import { Music2, Youtube, Cloud, Music, Headphones } from "lucide-react";

const MusicShowcase = () => {
  const platforms = [
    {
      name: "Spotify",
      icon: Music2,
      link: "https://open.spotify.com/artist/txtduo",
      color: "bg-green-500",
      embedUrl: "https://open.spotify.com/embed/artist/txtduo"
    },
    {
      name: "Apple Music",
      icon: Music,
      link: "https://music.apple.com/artist/txtduo",
      color: "bg-red-500",
      embedUrl: "https://embed.music.apple.com/us/artist/txtduo"
    },
    {
      name: "YouTube",
      icon: Youtube,
      link: "https://youtube.com/txtduo",
      color: "bg-red-600",
      embedUrl: "https://www.youtube.com/embed/txtduo"
    },
    {
      name: "SoundCloud",
      icon: Cloud,
      link: "https://soundcloud.com/txtduo",
      color: "bg-orange-500",
      embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/txtduo"
    },
    {
      name: "Boomplay",
      icon: Headphones,
      link: "https://www.boomplay.com/artists/txtduo",
      color: "bg-blue-500"
    }
  ];

  return (
    <section id="music" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="font-outfit text-4xl font-bold text-white mb-4">
            Discover Our Music
          </h2>
          <p className="font-inter text-gray-400">
            Explore our latest and greatest tracks across all streaming platforms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {platforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl bg-gray-800 p-6 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className={`${platform.color} p-3 rounded-lg`}>
                  <platform.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-outfit text-xl font-semibold text-white">
                  {platform.name}
                </h3>
              </div>
              <div className="mt-4">
                <p className="text-gray-400">Listen on {platform.name}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {platforms.slice(0, 2).map((platform) => platform.embedUrl && (
            <div key={`${platform.name}-embed`} className="w-full aspect-video bg-gray-800 rounded-xl overflow-hidden">
              <iframe
                src={platform.embedUrl}
                title={`${platform.name} Player`}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media"
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