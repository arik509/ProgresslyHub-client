import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Features = () => {
  const { user } = useAuth();
  const primaryCta = !user ? "/auth/register" : "/app/projects";

  const features = [
    {
      icon: "📊",
      title: "Real-time Analytics",
      description: "Track productivity, project status, and team workload with live reporting dashboards."
    },
    {
      icon: "👥",
      title: "Team Collaboration",
      description: "Seamless collaboration with role-based access for CEOs, managers, and employees."
    },
    {
      icon: "🎯",
      title: "Smart Task Management",
      description: "Organize tasks with priorities, deadlines, and automated progress tracking."
    },
    {
      icon: "🔒",
      title: "Secure Workspaces",
      description: "Keep every office separate and secure with enterprise-grade encryption."
    }
  ];

  return (
    <section className="bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-white py-20">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        <div className="text-center mb-12">
          <p className="text-purple-200 text-sm font-semibold uppercase tracking-wider mb-2">
            Why Choose Us
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything you need to manage work
          </h2>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Powerful features designed for both individuals and teams to boost productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-purple-100 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to={primaryCta}
            className="inline-flex items-center rounded-full bg-white text-purple-600 px-8 py-3 text-base font-semibold hover:bg-purple-50 transition-all shadow-xl hover:shadow-2xl"
          >
            Start for free
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
