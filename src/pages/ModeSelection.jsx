import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { initializePersonalMode } from "../api/personalProjectsApi";

const ModeSelection = () => {
  const navigate = useNavigate();
  const { user, refreshClaims } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectPersonalMode = async () => {
    setLoading(true);
    setError("");
    try {
      // Call API to initialize personal mode
      await initializePersonalMode();
      
      // Refresh claims using context function to update state
      await refreshClaims(user);
      
      // Navigate to app
      navigate("/app");
    } catch (e) {
      setError(e.message || "Failed to initialize personal mode");
    } finally {
      setLoading(false);
    }
  };

  const selectTeamMode = () => {
    // Just navigate to app - team mode setup happens in Dashboard/Office creation
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Workspace
          </h1>
          <p className="text-lg text-gray-600">
            How would you like to use ProgresslyHub?
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Mode Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Mode Card */}
          <div className="card bg-white shadow-2xl border-2 border-purple-200 hover:border-purple-400 transition-all hover:scale-105 hover:shadow-purple-200/50">
            <div className="card-body items-center text-center p-8">
              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl mb-4 shadow-lg">
                🧑
              </div>
              
              {/* Title */}
              <h2 className="card-title text-3xl mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Personal
              </h2>
              
              {/* Description */}
              <p className="text-gray-600 mb-6">
                Perfect for individual use. Manage your personal projects and tasks independently.
              </p>
              
              {/* Features List */}
              <ul className="text-left space-y-3 mb-8 w-full">
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs font-bold mt-0.5">✓</span>
                  <span className="text-gray-700">Unlimited personal projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs font-bold mt-0.5">✓</span>
                  <span className="text-gray-700">Private task management</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs font-bold mt-0.5">✓</span>
                  <span className="text-gray-700">Personal progress tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs font-bold mt-0.5">✓</span>
                  <span className="text-gray-700">No team collaboration needed</span>
                </li>
              </ul>

              {/* Button */}
              <button
                className="btn w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                onClick={selectPersonalMode}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Setting up...
                  </>
                ) : (
                  "Use Personal Mode"
                )}
              </button>
            </div>
          </div>

          {/* Team/Organization Mode Card */}
          <div className="card bg-white shadow-2xl border-2 border-pink-200 hover:border-pink-400 transition-all hover:scale-105 hover:shadow-pink-200/50">
            <div className="card-body items-center text-center p-8">
              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-4xl mb-4 shadow-lg">
                👥
              </div>
              
              {/* Title */}
              <h2 className="card-title text-3xl mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Team/Organization
              </h2>
              
              {/* Description */}
              <p className="text-gray-600 mb-6">
                For teams and organizations. Collaborate with others and manage roles.
              </p>
              
              {/* Features List */}
              <ul className="text-left space-y-3 mb-8 w-full">
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-xs font-bold mt-0.5">✓</span>
                  <span className="text-gray-700">Create or join offices</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-xs font-bold mt-0.5">✓</span>
                  <span className="text-gray-700">Role-based access control</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-xs font-bold mt-0.5">✓</span>
                  <span className="text-gray-700">Team collaboration tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-xs font-bold mt-0.5">✓</span>
                  <span className="text-gray-700">Assign tasks to members</span>
                </li>
              </ul>

              {/* Button */}
              <button
                className="btn w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white border-none hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                onClick={selectTeamMode}
                disabled={loading}
              >
                Use Team Mode
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-10">
          <p className="text-sm text-gray-600 bg-white/50 backdrop-blur-sm rounded-full px-6 py-3 inline-block shadow-sm">
            💡 You can switch between modes anytime from your dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;
