
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
    <section id="artists" className="py-20 bg-gradient-to-b from-primary to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-outfit text-4xl font-bold text-white mb-4 hover:scale-105 transition-transform duration-300">
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
              className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-secondary/20 animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Avatar className="w-32 h-32 mb-6 ring-4 ring-secondary/20 group-hover:ring-secondary/40 transition-all duration-300 group-hover:scale-110">
                <AvatarImage src={artist.image} alt={artist.name} className="object-cover" />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-secondary transition-colors">{artist.name}</h3>
              <p className="text-secondary mb-4 font-medium">{artist.role}</p>
              <p className="text-gray-400 leading-relaxed">{artist.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtistSection;
