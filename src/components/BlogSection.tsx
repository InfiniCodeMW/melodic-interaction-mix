
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, X } from "lucide-react";

const BlogSection = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const blogPosts = [
    {
      id: 1,
      title: "Studio Sessions: Behind the Scenes",
      excerpt: "Take a peek into our creative process and what goes into making our music.",
      content: "This is the full content of the blog post. Here you can share more details about your creative process, your inspiration, and behind-the-scenes moments.",
      date: "March 15, 2024",
      image: "/placeholder.svg",
      author: "Sarah Chen"
    },
    {
      id: 2,
      title: "The Evolution of Our Sound",
      excerpt: "From our first collaboration to our latest release, here's how our music has grown.",
      content: "A deeper dive into how our sound has evolved over time, from early inspirations to new creative approaches.",
      date: "March 10, 2024",
      image: "/placeholder.svg",
      author: "Marcus Rodriguez"
    },
    {
      id: 3,
      title: "Connecting Through Music",
      excerpt: "How we're building a community through our unique blend of styles.",
      content: "We believe music is a bridge that connects people. Here's how we're fostering a community through our unique style.",
      date: "March 5, 2024",
      image: "/placeholder.svg",
      author: "txtduo"
    }
  ];

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  return (
    <section id="blog" className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="font-outfit text-4xl font-bold text-white mb-4">
            Latest from the Blog
          </h2>
          <p className="font-inter text-gray-400">
            Stories, updates, and insights from our musical journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card 
              key={post.id} 
              className="bg-gray-900 border-gray-700 hover:border-secondary transition-colors transform hover:scale-105 transition-all duration-300"
              style={{
                animation: `fade-in 0.5s ease-out forwards ${index * 0.2}s`,
                opacity: 0
              }}
            >
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-white">{post.title}</CardTitle>
                <CardDescription className="text-gray-400">
                  {post.date} • By {post.author}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <Button 
                  variant="ghost" 
                  className="text-secondary hover:text-secondary hover:bg-gray-800 group"
                  onClick={() => openModal(post)}
                >
                  Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPost && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          style={{
            animation: 'fade-in 0.3s ease-out'
          }}
        >
          <div 
            className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full"
            style={{
              animation: 'scale-in 0.3s ease-out'
            }}
          >
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
              <h3 className="text-xl font-bold text-white">{selectedPost.title}</h3>
              <Button variant="ghost" onClick={closeModal} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-gray-400 mt-4">{selectedPost.date} • By {selectedPost.author}</p>
            <img src={selectedPost.image} alt={selectedPost.title} className="w-full rounded-lg my-4" />
            <p className="text-gray-300">{selectedPost.content}</p>
            <div className="mt-6 text-right">
              <Button onClick={closeModal} className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogSection;
