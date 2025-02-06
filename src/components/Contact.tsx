import { Mail, Instagram, Twitter } from "lucide-react";

const Contact = () => {
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      link: "https://instagram.com/txtduo",
    },
    {
      name: "Twitter",
      icon: Twitter,
      link: "https://twitter.com/txtduo",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="font-outfit text-4xl font-bold text-white mb-4">
            Let's Connect
          </h2>
          <p className="font-inter text-gray-300">
            Reach out for collaborations and bookings
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <a
            href="mailto:contact@txtduo.com"
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-medium py-3 px-6 rounded-full transition-colors"
          >
            <Mail size={20} />
            contact@txtduo.com
          </a>

          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <social.icon className="w-6 h-6 text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;