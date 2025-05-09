import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col items-center w-full max-w-xl">
        <img
          src="/AdminLogin.png"
          alt="Login illustration"
          className="w-48 mb-6"
        />
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Selamat Datang Admin!
        </h2>
        <p className="text-base text-gray-500 mb-6 text-center">
          Silakan login dengan akun Google Anda untuk mengelola QFlora
        </p>
        <button
          onClick={handleLogin}
          className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg shadow hover:shadow-md hover:bg-gray-50 transition text-gray-700 font-medium"
        >
          <FcGoogle size={24} />
          Login dengan Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
