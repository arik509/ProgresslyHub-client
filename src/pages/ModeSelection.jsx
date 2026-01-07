import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { initializePersonalMode } from "../api/personalProjectsApi";
import { initializeTeamMode } from "../api/teamApi";

const ModeSelection = () => {
  const navigate = useNavigate();
  const { user, refreshClaims } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectPersonalMode = async () => {
    setLoading(true);
    setError("");
    try {
      await initializePersonalMode();
      await refreshClaims(user);
      navigate("/app");
    } catch (e) {
      setError(e.message || "Failed to initialize personal mode");
    } finally {
      setLoading(false);
    }
  };

  const selectTeamMode = async () => {
    setLoading(true);
    setError("");
    try {
      await initializeTeamMode();
      await refreshClaims(user);
      navigate("/app");
    } catch (e) {
      // If no office membership found, still navigate to app
      // Dashboard will show "create office" prompt
      console.error("Team mode error:", e);
      setError(e.message || "Failed to initialize team mode");
      
      // Navigate anyway after a short delay
      setTimeout(() => {
        navigate("/app");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your ModeSelection component...
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
      {/* Your existing JSX */}
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Workspace
          </h1>
          <p className="text-lg text-gray-600">
            How would you like to use ProgresslyHub?
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-6 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Mode Button */}
          <button
            className="btn btn-primary btn-lg"
            onClick={selectPersonalMode}
            disabled={loading}
          >
            {loading ? "Setting up..." : "Use Personal Mode"}
          </button>

          {/* Team Mode Button */}
          <button
            className="btn btn-secondary btn-lg"
            onClick={selectTeamMode}
            disabled={loading}
          >
            {loading ? "Setting up..." : "Use Team Mode"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;
