import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FaUser, FaUsers } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [loginMode, setLoginMode] = useState(null); // 'personal' or 'team'
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
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // Check if user document exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        // First time login - create user document with selected mode
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          mode: loginMode,
          role: loginMode === 'team' ? 'EMPLOYEE' : null,
          createdAt: new Date().toISOString(),
        });
      } else {
        // User exists - optionally update mode if needed
        const userData = userDoc.data();
        // You can add logic here to handle mode changes if needed
      }

      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Handler
  const onGoogleSignIn = async () => {
    if (!loginMode) {
      setError("Please select a login type (Personal or Team)");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user document exists
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        // New Google user - create document with selected mode
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          mode: loginMode,
          role: loginMode === 'team' ? 'EMPLOYEE' : null,
          createdAt: new Date().toISOString(),
        });
      }

      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  // If no mode selected, show mode selection screen
  if (!loginMode) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
        <div className="card w-full max-w-4xl bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-8 lg:p-12">
            <h2 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Welcome to ProgresslyHub
            </h2>
            <p className="text-center text-base-content/70 mb-10 text-lg">
              Choose how you want to login
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Login Option */}
              <button
                onClick={() => setLoginMode('personal')}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 p-1 transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative bg-white rounded-xl p-10 h-full flex flex-col items-center justify-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
                    <FaUser className="text-white text-4xl" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">Personal</h3>
                  <p className="text-center text-gray-600 text-base">
                    Manage your individual tasks and projects
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="badge badge-lg bg-pink-100 text-pink-700 border-pink-200 px-4 py-3">
                      Solo Work
                    </span>
                    <span className="badge badge-lg bg-purple-100 text-purple-700 border-purple-200 px-4 py-3">
                      Personal Goals
                    </span>
                  </div>
                </div>
              </button>

              {/* Team/Office Login Option */}
              <button
                onClick={() => setLoginMode('team')}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-1 transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative bg-white rounded-xl p-10 h-full flex flex-col items-center justify-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <FaUsers className="text-white text-4xl" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">Team/Office</h3>
                  <p className="text-center text-gray-600 text-base">
                    Collaborate with your team and manage organization
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="badge badge-lg bg-purple-100 text-purple-700 border-purple-200 px-4 py-3">
                      Team Work
                    </span>
                    <span className="badge badge-lg bg-indigo-100 text-indigo-700 border-indigo-200 px-4 py-3">
                      Collaboration
                    </span>
                  </div>
                </div>
              </button>
            </div>

            <p className="mt-8 text-center text-base text-base-content/70">
              Don&apos;t have an account?{" "}
              <Link to="/auth/register" className="link link-primary link-hover font-semibold">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Login form (shown after mode selection)
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          {/* Mode Indicator */}
          <div className="text-center mb-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              loginMode === 'personal' 
                ? 'bg-gradient-to-r from-pink-400 to-purple-500' 
                : 'bg-gradient-to-r from-purple-500 to-indigo-600'
            } text-white text-sm font-semibold mb-3 shadow-md`}>
              {loginMode === 'personal' ? <FaUser /> : <FaUsers />}
              {loginMode === 'personal' ? 'Personal Login' : 'Team/Office Login'}
            </div>
            <button
              onClick={() => setLoginMode(null)}
              className="text-xs text-base-content/60 hover:text-base-content underline"
            >
              Change login type
            </button>
          </div>

          <h2 className="card-title text-2xl">Sign in</h2>
          <p className="text-base-content/70">
            {loginMode === 'personal' 
              ? 'Login to access your personal workspace.'
              : 'Login to access your office workspace.'}
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
                placeholder={loginMode === 'personal' ? 'you@email.com' : 'you@company.com'}
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

            <button 
              className={`btn w-full text-white ${
                loginMode === 'personal'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 border-0'
              }`}
              disabled={loading} 
              type="submit"
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">OR</div>

          {/* Google Sign-In Button */}
          <button
            className="btn btn-outline w-full gap-2"
            onClick={onGoogleSignIn}
            disabled={loading}
            type="button"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-4 text-center text-sm text-base-content/70">
            Don&apos;t have an account?{" "}
            <Link to="/auth/register" className="link link-primary link-hover">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
