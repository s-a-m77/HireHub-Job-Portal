import { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Briefcase,
  Mail,
  Lock,
  User as UserIcon,
  Building2,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import type { UserRole, Page } from "@/types";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, firestore } from "@/firebase/firebase";



const getDefaultPage = (role: UserRole): Page => {
  switch (role) {
    case 'student':
      return 'student-dashboard';
    case 'employer':
      return 'employer-dashboard';
    case 'admin':
      return 'admin-dashboard';
  }
};

export function LoginPage() {
  const { login: appLogin, navigate, theme } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const dk = theme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const user = await appLogin(email, password);
      if (!user) {
        setError("Invalid email or password.");
      } else {
        navigate(getDefaultPage((user as any).role));
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    }
  };

  // For Google login, we need to check if user exists and has a role
  const [pendingGoogleUser, setPendingGoogleUser] = useState<{ uid: string; email: string | null; displayName: string | null } | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Fetch user profile to get role and navigate
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        navigate(getDefaultPage(userData.role));
      } else {
        // New Google user - need to select role
        setPendingGoogleUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        });
        setShowRoleModal(true);
      }
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    }
  };

  const handleGoogleRoleSelect = async (selectedRole: UserRole) => {
    if (!pendingGoogleUser) return;

    try {
      const name = pendingGoogleUser.displayName || pendingGoogleUser.email?.split('@')[0] || 'User';
      const newUser = {
        uid: pendingGoogleUser.uid,
        id: pendingGoogleUser.uid,
        name,
        email: pendingGoogleUser.email || '',
        role: selectedRole,
        createdAt: new Date().toISOString(),
        ...(selectedRole === "employer"
          ? {
            companyName: name + "'s Company",
            companyLogo: "🏢",
            industry: "Technology",
            companyDescription: "",
            companyLocation: "",
            companySize: "",
            companyWebsite: "",
          }
          : {
            skills: [],
            education: "",
            bio: "",
            phone: "",
          }),
      };

      // Save to Firestore
      await setDoc(doc(firestore, 'users', pendingGoogleUser.uid), newUser);

      // Navigate to appropriate page
      setShowRoleModal(false);
      setPendingGoogleUser(null);
      navigate(getDefaultPage(selectedRole));
    } catch (err: any) {
      setError(err.message || "Failed to create user profile.");
      setShowRoleModal(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${dk ? "bg-gray-950" : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
        }`}
    >
      <div className="w-full max-w-md">
        <div className="mt-4">
          <button
            onClick={() => navigate("home")}
            className="w-1/4 mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 border rounded-2xl font-medium mt-2 ml-2 text-sm"
          >
            Back to Home
          </button>
        </div>
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${dk ? "text-white" : "text-gray-900"}`}>
            Welcome Back
          </h1>
          <p className={`mt-1 ${dk ? "text-gray-400" : "text-gray-500"}`}>
            Sign in to your HireHub account
          </p>
        </div>

        <div
          className={`rounded-2xl shadow-xl border p-8 ${dk
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
                className={`block text-sm font-medium mb-1 ${dk ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${dk ? "text-gray-500" : "text-gray-400"
                    }`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${dk
                      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                      : "border-gray-200"
                    }`}
                />
              </div>
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${dk ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${dk ? "text-gray-500" : "text-gray-400"
                    }`}
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${dk
                      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                      : "border-gray-200"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${dk
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
              Sign In
            </button>
          </form>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
          >
            Continue with Google
          </button>

          <div className={`mt-6 text-center text-sm ${dk ? "text-gray-400" : "text-gray-500"}`}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("register")}
              className="text-indigo-600 font-medium hover:text-indigo-700"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>

      {/* Role Selection Modal for Google Login */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl border max-w-md w-full p-6 ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-xl font-bold mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>
              Choose Your Role
            </h2>
            <p className={`mb-6 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
              Please select whether you are a Student or Employer to continue.
            </p>

            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => handleGoogleRoleSelect("student")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${dk ? "border-gray-700 hover:border-indigo-500 bg-gray-800" : "border-gray-200 hover:border-indigo-500 bg-gray-50"
                  }`}
              >
                <UserIcon className={`w-5 h-5 ${dk ? 'text-gray-400' : 'text-gray-600'}`} />
                <div className="text-left">
                  <div className={`font-medium ${dk ? 'text-white' : 'text-gray-900'}`}>Student</div>
                  <div className={`text-xs ${dk ? 'text-gray-500' : 'text-gray-500'}`}>Find jobs and apply</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleGoogleRoleSelect("employer")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${dk ? "border-gray-700 hover:border-indigo-500 bg-gray-800" : "border-gray-200 hover:border-indigo-500 bg-gray-50"
                  }`}
              >
                <Building2 className={`w-5 h-5 ${dk ? 'text-gray-400' : 'text-gray-600'}`} />
                <div className="text-left">
                  <div className={`font-medium ${dk ? 'text-white' : 'text-gray-900'}`}>Employer</div>
                  <div className={`text-xs ${dk ? 'text-gray-500' : 'text-gray-500'}`}>Post jobs and hire talent</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function RegisterPage() {
  const { register, navigate, theme, login: appLogin } = useApp();
  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [error, setError] = useState("");
  const dk = theme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError("Please select a role first.");
      return;
    }
    setError("");
    try {
      const success = await register({
        name,
        email,
        role,
        ...(role === "employer"
          ? {
            companyName: companyName || name + "'s Company",
            companyLogo: "🏢",
            industry: industry || "Technology",
            companyDescription: "",
            companyLocation: "",
            companySize: "",
            companyWebsite: "",
          }
          : {
            skills: [],
            education: "",
            bio: "",
            phone: "",
          }),
      }, password);
      if (success) {
        navigate(getDefaultPage(role));
      }
      // If success is false without an error being thrown, something unexpected happened
    } catch (err: any) {
      // Check if this is an "email already exists" error
      const errorMessage = err.message || "Registration failed.";
      setError(errorMessage);
    }
  };

  const handleGoogleRegister = async () => {
    if (!role) {
      setError("Please select a role first to continue with Google.");
      return;
    }
    setError("");
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Fetch user profile to get role and navigate
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        navigate(getDefaultPage(userData.role));
      } else {
        // New Google user - use the selected role
        const userName = user.displayName || user.email?.split('@')[0] || 'User';
        const newUser = {
          uid: user.uid,
          id: user.uid,
          name: userName,
          email: user.email || '',
          role,
          createdAt: new Date().toISOString(),
          ...(role === "employer"
            ? {
              companyName: userName + "'s Company",
              companyLogo: "🏢",
              industry: "Technology",
              companyDescription: "",
              companyLocation: "",
              companySize: "",
              companyWebsite: "",
            }
            : {
              skills: [],
              education: "",
              bio: "",
              phone: "",
            }),
        };

        await setDoc(doc(firestore, 'users', user.uid), newUser);
        navigate(getDefaultPage(role));
      }
    } catch (err: any) {
      setError(err.message || "Google sign-up failed.");
    }
  };

  const inputCls = `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${dk
      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
      : "border-gray-200"
    }`;

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${dk ? "bg-gray-950" : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
        }`}
    >
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("home")}
          className="w-1/4 mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 border rounded-2xl font-medium mt-2 ml-2 text-sm"
        >
          Back to Home
        </button>
        <div className="text-center mb-8">

          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${dk ? "text-white" : "text-gray-900"}`}>
            Create Account
          </h1>
          <p className={`mt-1 ${dk ? "text-gray-400" : "text-gray-500"}`}>
            Join HireHub and start your journey
          </p>
        </div>

        <div
          className={`rounded-2xl shadow-xl border p-8 ${dk
              ? "bg-gray-900 border-gray-800 shadow-black/30"
              : "bg-white border-gray-100 shadow-gray-200/50"
            }`}
        >
          {/* Role Selection */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${role === "student"
                  ? "border-indigo-500 bg-indigo-50"
                  : dk
                    ? "border-gray-700 hover:border-gray-600"
                    : "border-gray-100 hover:border-gray-200"
                }`}
            >
              <UserIcon
                className={`w-5 h-5 ${role === "student"
                    ? "text-indigo-600"
                    : dk
                      ? "text-gray-500"
                      : "text-gray-400"
                  }`}
              />
              <div className="text-left">
                <div
                  className={`font-medium text-sm ${role === "student"
                      ? "text-indigo-900"
                      : dk
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                >
                  Student
                </div>
                <div className={`text-xs ${dk ? "text-gray-500" : "text-gray-500"}`}>
                  Find jobs
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${role === "employer"
                  ? "border-indigo-500 bg-indigo-50"
                  : dk
                    ? "border-gray-700 hover:border-gray-600"
                    : "border-gray-100 hover:border-gray-200"
                }`}
            >
              <Building2
                className={`w-5 h-5 ${role === "employer"
                    ? "text-indigo-600"
                    : dk
                      ? "text-gray-500"
                      : "text-gray-400"
                  }`}
              />
              <div className="text-left">
                <div
                  className={`font-medium text-sm ${role === "employer"
                      ? "text-indigo-900"
                      : dk
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                >
                  Employer
                </div>
                <div className={`text-xs ${dk ? "text-gray-500" : "text-gray-500"}`}>
                  Post jobs
                </div>
              </div>
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${dk ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${dk ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${dk ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
                className={inputCls}
              />
            </div>
            {role === "employer" && (
              <>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${dk ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your company name"
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${dk ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select industry</option>
                    <option>Technology</option>
                    <option>Finance & Banking</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                    <option>Design & Creative</option>
                    <option>Energy & Environment</option>
                    <option>Marketing & Media</option>
                    <option>Retail & E-commerce</option>
                    <option>Other</option>
                  </select>
                </div>
              </>
            )}
            <button
              type="submit"
              disabled={!role}
              className={`w-full py-3 rounded-xl font-medium transition-all ${role
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                  : dk ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              Create Account
            </button>
          </form>

          {/* Google Register */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={!role}
            className={`w-full mt-4 py-3 rounded-xl font-medium transition-all ${role
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                : dk ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            Continue with Google
          </button>

          <div className={`mt-6 text-center text-sm ${dk ? "text-gray-400" : "text-gray-500"}`}>
            Already have an account?{" "}
            <button
              onClick={() => navigate("login")}
              className="text-indigo-600 font-medium hover:text-indigo-700"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
