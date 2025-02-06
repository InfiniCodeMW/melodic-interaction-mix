import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Studio Sessions: Behind the Scenes",
      excerpt: "Take a peek into our creative process and what goes into making our music.",
      date: "March 15, 2024",
      image: "/placeholder.svg",
      author: "Sarah Chen"
    },
    {
      id: 2,
      title: "The Evolution of Our Sound",
      excerpt: "From our first collaboration to our latest release, here's how our music has grown.",
      date: "March 10, 2024",
      image: "/placeholder.svg",
      author: "Marcus Rodriguez"
    },
    {
      id: 3,
      title: "Connecting Through Music",
      excerpt: "How we're building a community through our unique blend of styles.",
      date: "March 5, 2024",
      image: "/placeholder.svg",
      author: "txtduo"
    }
  ];

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-outfit text-4xl font-bold text-white mb-4">
            Latest from the Blog
          </h2>
          <p className="font-inter text-gray-400">
            Stories, updates, and insights from our musical journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="bg-gray-900 border-gray-700 hover:border-secondary transition-colors">
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
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
                <Button variant="ghost" className="text-secondary hover:text-secondary hover:bg-gray-800">
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;