import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      // expected: { token, user }
      login(res.data.token, res.data.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-2xl">Sign in</h2>
          <p className="text-base-content/70">
            Login to access your office workspace.
          </p>

          {error && (
            <div className="alert alert-error mt-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                className="input input-bordered w-full"
                type="email"
                name="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
                <span className="label-text-alt">
                  <a className="link link-hover">Forgot?</a>
                </span>
              </label>
              <input
                className="input input-bordered w-full"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={onChange}
                required
              />
            </div>

            <button className="btn btn-primary w-full" disabled={loading} type="submit">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-base-content/70">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="link link-primary link-hover">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
