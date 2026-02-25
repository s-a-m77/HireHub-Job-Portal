import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import {
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { auth } from "@/firebase/firebase";



export function AdminLoginPage() {
  const { navigate, theme, currentUser } = useApp();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [pendingAdminLogon, setPendingAdminLogon] = useState(false);
  const dk = theme === "dark";

  useEffect(() => {
    if (pendingAdminLogon && currentUser && currentUser.role === 'admin') {
      navigate('admin-dashboard');
      setPendingAdminLogon(false);
    }
  }, [pendingAdminLogon, currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const userData = await login(email, password);
      if (userData) {
        if (userData.role === 'admin') {
          setPendingAdminLogon(true);
        } else {
          // Sign out non-admin users immediately
          await auth.signOut();
          setError("Access denied. Admin privileges required.");
        }
      } else {
        setError("Invalid email or password.");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    }
  };



  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        dk ? "bg-gray-950" : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      }`}
    >
      <div className="w-full max-w-md">
        <div className="mt-4">
          <button
            onClick={() => navigate("home")}
            className="w-1/4 mx-auto bg-gradient-to-r from-indigo-300 to-purple-600 hover:from-gray-600 hover:to-purple-700 text-white py-3 border rounded-2xl font-medium mt-2 ml-2 text-sm"
          >
            Back to Home
          </button>
        </div>
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${dk ? "text-white" : "text-gray-900"}`}>
            Admin Sign In
          </h1>
          <p className={`mt-1 ${dk ? "text-gray-400" : "text-gray-500"}`}>
            Sign in to the admin dashboard
          </p>
        </div>

        <div
          className={`rounded-2xl shadow-xl border p-8 ${
            dk
              ? "bg-gray-900 border-gray-800 shadow-black/30"
              : "bg-white border-gray-100 shadow-gray-200/50"
          }`}
        >
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  dk ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    dk ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                    dk
                      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                      : "border-gray-200"
                  }`}
                />
              </div>
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  dk ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    dk ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                    dk
                      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                      : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    dk
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {showPass ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              Sign In as Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
