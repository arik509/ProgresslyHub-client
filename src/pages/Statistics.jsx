const Statistics = () => {
    const stats = [
      {
        number: "120K+",
        label: "Active Users",
        description: "Teams and individuals trust ProgresslyHub to stay on top of their work every day.",
        icon: "👥",
        color: "from-pink-500 to-rose-500"
      },
      {
        number: "4.8",
        label: "Average Rating",
        description: "Rated by teams and individuals who track their projects with us daily.",
        icon: "⭐",
        color: "from-purple-500 to-indigo-500"
      },
      {
        number: "100%",
        label: "Data Ownership",
        description: "Complete control of your data and workflow, whether solo or with a team.",
        icon: "🔒",
        color: "from-fuchsia-500 to-pink-500"
      }
    ];
  
    return (
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 lg:px-0">
          <div className="text-center mb-12">
            <p className="text-purple-600 text-sm font-semibold uppercase tracking-wider mb-2">
              Trusted Worldwide
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Join thousands of users
            </h2>
          </div>
  
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-300 group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} text-white text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  {stat.icon}
                </div>
                
                <p className={`text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.number}
                </p>
                
                <p className="text-xl font-semibold text-gray-900 mb-3">
                  {stat.label}
                </p>
                
                <p className="text-gray-600 text-sm">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Statistics;
  