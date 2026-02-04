import { Link } from "react-router-dom";
import { Container, Card, Button } from "@flx-front/ui-web";

export function HomePage() {
  const features = [
    {
      icon: "🔐",
      title: "Authentication",
      desc: "JWT-based auth with persistent sessions",
    },
    {
      icon: "🛍️",
      title: "Product Management",
      desc: "Full CRUD operations with pagination",
    },
    {
      icon: "⚡",
      title: "React Query",
      desc: "Smart caching and automatic refetching",
    },
    {
      icon: "🎨",
      title: "Tailwind v4",
      desc: "Modern utility-first CSS framework",
    },
    { icon: "📱", title: "Responsive", desc: "Mobile-first design approach" },
    {
      icon: "🔒",
      title: "TypeScript",
      desc: "Full type safety and IntelliSense",
    },
  ];

  const techStack = [
    { name: "React", version: "19.1.0", color: "from-cyan-500 to-blue-500" },
    { name: "Vite", version: "6.0.1", color: "from-purple-500 to-pink-500" },
    {
      name: "TanStack Query",
      version: "5.62.0",
      color: "from-red-500 to-orange-500",
    },
    { name: "Tailwind", version: "4.0.0", color: "from-teal-500 to-cyan-500" },
  ];

  return (
    <Container>
      {/* Hero Section */}
      <div className="m-12 text-center max-w-4xl mx-auto">
        <div className="inline-block mb-6">
          <span className="px-4 py-2 bg-linear-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium">
            🚀 Production Ready
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Flx Boilerplate
        </h1>

        <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
          A modern, full-stack React boilerplate with best practices,
          <br className="hidden sm:block" />
          ready for web and mobile development
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/login">
            <Button
              variant="primary"
              className="px-8 py-3 text-lg w-full sm:w-auto"
            >
              Try Demo Login →
            </Button>
          </Link>
          <Link to="/products">
            <Button
              variant="secondary"
              className="px-8 py-3 text-lg w-full sm:w-auto"
            >
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Demo Credentials */}
        <Card className="bg-linear-to-br from-blue-50 to-purple-50 border-2 border-blue-200/50">
          <div className="flex items-start gap-3">
            <span className="text-3xl">💡</span>
            <div className="text-left flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                Demo Credentials
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
                <span className="text-blue-700">
                  <strong>Username:</strong>{" "}
                  <code className="bg-white/60 px-2 py-1 rounded">emilys</code>
                </span>
                <span className="text-blue-700">
                  <strong>Password:</strong>{" "}
                  <code className="bg-white/60 px-2 py-1 rounded">
                    emilyspass
                  </code>
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Built With Modern Tech
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((tech, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br ${tech.color} flex items-center justify-center`}
              >
                <span className="text-white font-bold text-2xl">
                  {tech.name[0]}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">{tech.name}</h3>
              <p className="text-sm text-gray-500">v{tech.version}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <Card className="text-center bg-linear-to-br from-blue-600 to-purple-600 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
        <p className="text-blue-100 mb-6 text-lg">
          Explore the demo or dive into the code to see how everything works
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto"
            >
              Start Demo
            </Button>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="secondary"
              className="bg-white/10 text-white border-white hover:bg-white/20 w-full sm:w-auto"
            >
              View on GitHub →
            </Button>
          </a>
        </div>
      </Card>
    </Container>
  );
}
