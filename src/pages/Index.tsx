import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import MusicShowcase from "@/components/MusicShowcase";
import ArtistSection from "@/components/ArtistSection";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      <Hero />
      <MusicShowcase />
      <ArtistSection />
      <Contact />
    </div>
  );
};

export default Index;