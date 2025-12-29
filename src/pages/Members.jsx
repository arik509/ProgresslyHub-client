import { useAuth } from "../context/AuthContext";

const Members = () => {
  const { role } = useAuth();

  return (
    <div className="card bg-base-100 shadow border border-base-300">
      <div className="card-body">
        <h1 className="card-title text-2xl">Members</h1>
        <p className="text-base-content/70">
          Access granted. Your role: <span className="font-semibold">{role}</span>
        </p>

        <div className="alert alert-info mt-4">
          <span>
            Next: connect to backend and implement “Create user / Set role / Assign manager”.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Members;
