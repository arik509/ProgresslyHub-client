import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Banner = () => {
  const { user } = useAuth();

  const primaryCta = !user ? "/auth/register" : "/app/projects";
  const secondaryCta = !user ? "/auth/login" : "/app/tasks";

  return (
    <main className="bg-gradient-to-b from-pink-50 via-rose-50 to-amber-50">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 lg:px-0 pt-16 pb-10">
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
                    className="inline-flex items-center justify-center rounded-full bg-black text-white px-5 py-2 text-sm font-semibold hover:bg-neutral-900 transition-colors"
                  >
                    Try it free
                  </Link>
                </div>
              </div>

              <Link
                to={secondaryCta}
                className="text-sm font-medium text-base-content/70 hover:text-base-content underline-offset-4 hover:underline"
              >
                {user ? "View my tasks" : "Sign in instead"}
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-8 flex flex-wrap gap-6 items-center text-sm text-base-content/70">
              <div className="flex items-center gap-2">
                <div className="avatar-group -space-x-2">
                  <div className="avatar w-7 h-7 border border-white">
                    <div className="rounded-full bg-pink-300" />
                  </div>
                  <div className="avatar w-7 h-7 border border-white">
                    <div className="rounded-full bg-purple-300" />
                  </div>
                  <div className="avatar w-7 h-7 border border-white">
                    <div className="rounded-full bg-amber-300" />
                  </div>
                </div>
                <span className="font-semibold text-base-content">
                  120K+
                </span>
                <span className="text-base-content/60">
                  teams and individuals trust tools like this.
                </span>
              </div>
            </div>
          </div>

          {/* Right preview card */}
          <div className="lg:justify-self-end w-full max-w-md">
            <div className="rounded-3xl bg-white shadow-xl border border-white/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-base-content/80">
                  Performance
                </span>
                <span className="badge badge-ghost badge-sm">Weekly</span>
              </div>

              <div className="text-xs text-base-content/60">
                Total time worked
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-base-content">
                  16 hr 30 min
                </span>
                <span className="text-sm font-semibold text-purple-500">
                  54.34%
                </span>
              </div>

              {/* fake chart */}
              <div className="h-24 w-full rounded-2xl bg-gradient-to-tr from-purple-100 via-pink-100 to-amber-100 flex items-end px-3 pb-3 gap-1 overflow-hidden">
                <div className="flex-1 bg-purple-300/70 rounded-t-xl h-6" />
                <div className="flex-1 bg-purple-400/80 rounded-t-xl h-10" />
                <div className="flex-1 bg-purple-500 rounded-t-xl h-16" />
                <div className="flex-1 bg-purple-300/80 rounded-t-xl h-9" />
                <div className="flex-1 bg-purple-400 rounded-t-xl h-14" />
                <div className="flex-1 bg-purple-200 rounded-t-xl h-7" />
              </div>

              {/* mini task card */}
              <div className="mt-4 flex items-center justify-between bg-base-100 rounded-2xl px-4 py-3">
                <div>
                  <p className="text-xs text-base-content/60">Assigned</p>
                  <p className="text-lg font-semibold text-base-content">
                    30 tasks
                  </p>
                </div>
                <div className="avatar-group -space-x-2">
                  <div className="avatar w-7 h-7 border border-white">
                    <div className="rounded-full bg-pink-400" />
                  </div>
                  <div className="avatar w-7 h-7 border border-white">
                    <div className="rounded-full bg-purple-400" />
                  </div>
                  <div className="avatar w-7 h-7 border border-white">
                    <div className="rounded-full bg-amber-400" />
                  </div>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <Link
                  to={primaryCta}
                  className="btn btn-sm rounded-full bg-black text-white hover:bg-neutral-900"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark reports section */}
      <section className="bg-black text-white py-12">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 grid lg:grid-cols-2 gap-10 items-center">
          {/* Left chart card */}
          <div className="bg-neutral-900 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-sm text-neutral-300">
              <span>Performance</span>
              <span className="badge badge-outline badge-sm border-neutral-700 text-neutral-300">
                Weekly
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Total time worked
            </p>
            <p className="text-2xl font-semibold">16 hr 30 min</p>
            <div className="h-24 w-full rounded-2xl bg-gradient-to-tr from-purple-600/30 via-fuchsia-500/30 to-amber-400/30" />
            <div className="text-xs text-neutral-500">
              20 Aug, 2024 • 630 hr 52 min total time
            </div>
          </div>

          {/* Right text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Track real‑time progress with reports
            </h2>
            <p className="text-neutral-300 mb-6">
              Get live insights into productivity, project status, and
              team workload with powerful yet simple reporting views.
            </p>
            <Link
              to={primaryCta}
              className="inline-flex items-center rounded-full bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-neutral-100 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom stats row */}
      <section className="bg-base-100 py-10">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="text-xl font-semibold mb-1">120K+</p>
            <p className="text-base-content/70">
              Users rely on modern tools like ProgresslyHub to stay on
              top of their work.
            </p>
          </div>
          <div>
            <p className="text-xl font-semibold mb-1">4.8</p>
            <p className="text-base-content/70">
              Average rating from teams and individuals who track their
              projects every day.
            </p>
          </div>
          <div>
            <p className="text-xl font-semibold mb-1">100%</p>
            <p className="text-base-content/70">
              Ownership of your data and workflow, whether you work
              alone or with a full team.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Banner;
