import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function AdminHeader() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between p-4 text-white bg-green-800">
        <Link to="/" className="text-xl font-bold">
          QFLORA Admin
        </Link>
        <div className="flex items-center gap-4">
          <span>{user?.email}</span>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
