
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const ArtistSection = () => {
  const artists = [
    {
      name: "Telvin Moore",
      role: "Singer",
      description: "A classically trained vocalist with a modern R&B twist, Telvin Awesome brings soulful melodies and powerful vocals to Thxtduo.",
      image: "/images/telvin.jpg"
    },
    {
      name: "JYC9_JR",
      role: "Rapper",
      description: "With sharp lyrics and dynamic flow, JYC9_JR adds the perfect hip-hop edge to complete Thxtduo's unique sound.",
      image: "/images/jyce.jpg"
    }
  ];

  return (
    <section id="artists" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="font-outfit text-4xl font-bold text-white mb-4">
            Meet the Artists
          </h2>
          <p className="font-inter text-gray-400">
            The voices and minds behind ThxtDuo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {artists.map((artist, index) => (
            <div 
              key={artist.name} 
              className="bg-gray-800 rounded-xl p-6 flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300"
              style={{
                animation: `fade-in 0.5s ease-out forwards ${index * 0.2}s`,
                opacity: 0
              }}
            >
              <Avatar className="w-32 h-32 mb-6 hover:scale-110 transition-transform duration-300">
                <AvatarImage src={artist.image} alt={artist.name} />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-bold text-white mb-2">{artist.name}</h3>
              <p className="text-secondary mb-4">{artist.role}</p>
              <p className="text-gray-400">{artist.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtistSection;
