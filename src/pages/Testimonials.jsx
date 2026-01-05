const Testimonials = () => {
    const testimonials = [
      {
        name: "Sarah Johnson",
        role: "CEO at TechStart",
        avatar: "bg-gradient-to-br from-pink-400 to-rose-500",
        comment: "ProgresslyHub transformed how our team collaborates. The hierarchy system is perfect for our organization structure.",
        rating: 5
      },
      {
        name: "Michael Chen",
        role: "Freelance Designer",
        avatar: "bg-gradient-to-br from-purple-400 to-indigo-500",
        comment: "As a solo freelancer, I love how simple yet powerful the personal mode is. It keeps me organized without overwhelming me.",
        rating: 5
      },
      {
        name: "Emily Rodriguez",
        role: "Project Manager",
        avatar: "bg-gradient-to-br from-fuchsia-400 to-pink-500",
        comment: "The real-time reporting feature saves me hours every week. I can see exactly what my team is working on at any moment.",
        rating: 5
      }
    ];
  
    return (
      <section className="bg-gradient-to-b from-purple-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-4 lg:px-0">
          <div className="text-center mb-12">
            <p className="text-purple-600 text-sm font-semibold uppercase tracking-wider mb-2">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by teams worldwide
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              See what our users have to say about their experience with ProgresslyHub.
            </p>
          </div>
  
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 border border-purple-100 hover:border-purple-300 group"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
  
                {/* Comment */}
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.comment}"
                </p>
  
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${testimonial.avatar} group-hover:scale-110 transition-transform`} />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Testimonials;
  