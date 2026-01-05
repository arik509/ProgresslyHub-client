import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Highlights = () => {
  const { user } = useAuth();
  const primaryCta = !user ? "/auth/register" : "/app/projects";

  return (
    <section className="bg-gradient-to-b from-purple-50 via-pink-50 to-amber-50 py-20">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Performance Card */}
          <div className="order-2 lg:order-1">
            <div className="bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 rounded-3xl p-8 shadow-2xl text-white">
              <div className="flex items-center justify-between text-sm text-purple-200 mb-6">
                <span className="font-medium">Performance Dashboard</span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                  Weekly
                </span>
              </div>
              
              <p className="text-xs text-purple-200 mb-2">
                Total time worked
              </p>
              <p className="text-4xl font-bold mb-6">16 hr 30 min</p>
              
              {/* Chart placeholder */}
              <div className="h-32 w-full rounded-2xl bg-gradient-to-tr from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/20 flex items-end px-4 pb-4 gap-2">
                <div className="flex-1 bg-white/30 rounded-t-lg h-10" />
                <div className="flex-1 bg-white/50 rounded-t-lg h-16" />
                <div className="flex-1 bg-white/70 rounded-t-lg h-24" />
                <div className="flex-1 bg-white/40 rounded-t-lg h-12" />
                <div className="flex-1 bg-white/60 rounded-t-lg h-20" />
                <div className="flex-1 bg-white/30 rounded-t-lg h-8" />
              </div>
              
              <div className="text-xs text-purple-200 mt-6">
                20 Aug, 2024 • 630 hr 52 min total time
              </div>
            </div>
          </div>

          {/* Right: Text */}
          <div className="order-1 lg:order-2">
            <p className="text-purple-600 text-sm font-semibold uppercase tracking-wider mb-2">
              Insights
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Track real‑time progress with reports
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Get live insights into productivity, project status, and
              team workload with powerful yet simple reporting views.
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-sm font-bold">✓</span>
                <span className="text-gray-700">Real-time collaboration and updates</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-sm font-bold">✓</span>
                <span className="text-gray-700">Customizable dashboards and views</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-sm font-bold">✓</span>
                <span className="text-gray-700">Export reports in multiple formats</span>
              </li>
            </ul>

            <Link
              to={primaryCta}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 text-base font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            >
              Get started now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Highlights;
