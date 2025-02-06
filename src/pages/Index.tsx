import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import MusicShowcase from "@/components/MusicShowcase";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      <Hero />
      <MusicShowcase />
      <Contact />
    </div>
  );
};

export default Index;