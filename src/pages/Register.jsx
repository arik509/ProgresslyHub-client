import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase";


const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
  
      if (form.name) {
        await updateProfile(cred.user, { displayName: form.name });
      }
  
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-2xl">Create account</h2>
          <p className="text-base-content/70">
            Start using ProgresslyHub for your office.
          </p>

          {error && (
            <div className="alert alert-error mt-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full name</span>
              </label>
              <input
                className="input input-bordered w-full"
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>

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
              </label>
              <input
                className="input input-bordered w-full"
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={onChange}
                minLength={6}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm password</span>
              </label>
              <input
                className="input input-bordered w-full"
                type="password"
                name="confirmPassword"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={onChange}
                minLength={6}
                required
              />
            </div>

            <button className="btn btn-primary w-full" disabled={loading} type="submit">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Register"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-base-content/70">
            Already have an account?{" "}
            <Link to="/auth/login" className="link link-primary link-hover">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
