import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Hero = () => {
  const { user } = useAuth();
  const primaryCta = !user ? "/auth/register" : "/app/projects";
  const secondaryCta = !user ? "/auth/login" : "/app/tasks";

  return (
    <section className="bg-gradient-to-b from-pink-50 via-rose-50 to-amber-50 py-16">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left text */}
          <div>
            <p className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60 bg-white/70 rounded-full px-4 py-1 mb-4 shadow-sm">
              Personal • Teams • Employers
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-base-content">
              Effortless task management
              <br />
              for teams and individuals
            </h1>

            <p className="mt-5 text-base md:text-lg text-base-content/70 max-w-xl">
              ProgresslyHub helps CEOs, managers, employees, and solo
              users stay organized and focused with clear projects,
              tasks, and real‑time progress.
            </p>

            {/* Email / CTA row */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="flex-1">
                <div className="flex items-center bg-white rounded-full shadow-md px-3 py-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent outline-none text-sm px-2"
                  />
                  <Link
                    to={primaryCta}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
                  >
                    Try it free
                  </Link>
                </div>
              </div>

              <Link
                to={secondaryCta}
                className="text-sm font-medium text-base-content/70 hover:text-purple-600 underline-offset-4 hover:underline transition-colors"
              >
                {user ? "View my tasks" : "Sign in instead"}
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-8 flex flex-wrap gap-6 items-center text-sm text-base-content/70">
              <div className="flex items-center gap-2">
                <div className="avatar-group -space-x-2">
                  <div className="avatar w-7 h-7 border-2 border-white">
                    <div className="rounded-full bg-gradient-to-br from-pink-400 to-rose-500" />
                  </div>
                  <div className="avatar w-7 h-7 border-2 border-white">
                    <div className="rounded-full bg-gradient-to-br from-purple-400 to-indigo-500" />
                  </div>
                  <div className="avatar w-7 h-7 border-2 border-white">
                    <div className="rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                  </div>
                </div>
                <span className="font-semibold text-purple-600">
                  120K+
                </span>
                <span className="text-base-content/60">
                  teams and individuals trust us.
                </span>
              </div>
            </div>
          </div>

          {/* Right preview card */}
          <div className="lg:justify-self-end w-full max-w-md">
            <div className="rounded-3xl bg-white shadow-2xl border border-purple-100 p-6 space-y-4 hover:shadow-purple-200/50 transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-purple-900">
                  Performance
                </span>
                <span className="badge bg-purple-50 text-purple-600 border-purple-200 badge-sm">
                  Weekly
                </span>
              </div>

              <div className="text-xs text-base-content/60">
                Total time worked
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  16 hr 30 min
                </span>
                <span className="text-sm font-semibold text-purple-500">
                  54.34%
                </span>
              </div>

              {/* fake chart */}
              <div className="h-28 w-full rounded-2xl bg-gradient-to-tr from-purple-100 via-pink-100 to-amber-100 flex items-end px-3 pb-3 gap-1 overflow-hidden">
                <div className="flex-1 bg-gradient-to-t from-purple-400 to-purple-300 rounded-t-xl h-8" />
                <div className="flex-1 bg-gradient-to-t from-pink-400 to-pink-300 rounded-t-xl h-12" />
                <div className="flex-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-xl h-20" />
                <div className="flex-1 bg-gradient-to-t from-fuchsia-400 to-fuchsia-300 rounded-t-xl h-10" />
                <div className="flex-1 bg-gradient-to-t from-pink-500 to-pink-400 rounded-t-xl h-16" />
                <div className="flex-1 bg-gradient-to-t from-purple-300 to-purple-200 rounded-t-xl h-9" />
              </div>

              {/* mini task card */}
              <div className="mt-4 flex items-center justify-between bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl px-4 py-3 border border-purple-100">
                <div>
                  <p className="text-xs text-purple-600/70">Assigned</p>
                  <p className="text-lg font-semibold text-purple-900">
                    30 tasks
                  </p>
                </div>
                <div className="avatar-group -space-x-2">
                  <div className="avatar w-8 h-8 border-2 border-white">
                    <div className="rounded-full bg-gradient-to-br from-pink-400 to-rose-500" />
                  </div>
                  <div className="avatar w-8 h-8 border-2 border-white">
                    <div className="rounded-full bg-gradient-to-br from-purple-400 to-indigo-500" />
                  </div>
                  <div className="avatar w-8 h-8 border-2 border-white">
                    <div className="rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Link
                  to={primaryCta}
                  className="btn btn-sm rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all"
                >
                  Get started →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
