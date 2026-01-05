import { Link } from "react-router-dom";

const Categories = () => {
  const categories = [
    {
      title: "Personal",
      icon: "🧑",
      description: "Perfect for freelancers and solo users who need simple, effective task management.",
      features: ["Unlimited projects", "Personal dashboard", "Task tracking", "Progress reports"],
      gradient: "from-pink-500 to-rose-500"
    },
    {
      title: "Business",
      icon: "💼",
      description: "Ideal for small teams and growing businesses looking to streamline collaboration.",
      features: ["Team workspace", "Project sharing", "Collaboration tools", "Advanced analytics"],
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      title: "Enterprise",
      icon: "🏢",
      description: "Built for organizations with complex hierarchies and compliance requirements.",
      features: ["Multi-office support", "Role-based access", "Custom integrations", "Dedicated support"],
      gradient: "from-fuchsia-500 to-pink-500"
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        <div className="text-center mb-12">
          <p className="text-purple-600 text-sm font-semibold uppercase tracking-wider mb-2">
            Choose Your Plan
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Built for everyone
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Whether you're working solo or managing a team, we have the right solution for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="relative rounded-3xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 hover:border-purple-300 p-8 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 group"
            >
              <div className={`text-5xl mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {category.title}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {category.description}
              </p>

              <ul className="space-y-3 mb-6">
                {category.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/auth/register"
                className={`inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r ${category.gradient} text-white px-6 py-3 text-sm font-semibold hover:shadow-lg transition-all`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
