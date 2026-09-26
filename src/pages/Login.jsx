import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Dumbbell,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";
import { useAuth } from "../context/useAuth.jsx";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const handleChange = (e) => {
setForm((previous) => ({
...previous,
[e.target.name]: e.target.value,
}));


if (error) {
  setError("");
}


};

const handleSubmit = async (e) => {
e.preventDefault();
setError("");


if (!form.email.trim() || !form.password) {
  setError("Please enter your email and password.");
  return;
}

try {
  setLoading(true);

  await login({
    email: form.email.trim(),
    password: form.password,
  });

  navigate("/member");
} catch (error) {
  console.error("Login failed:", error);
  setError(error.message || "Unable to login. Please try again.");
} finally {
  setLoading(false);
}


};

return ( <div className="min-h-screen bg-[#050505] text-white"> <div className="grid min-h-screen lg:grid-cols-2"> <div className="relative hidden overflow-hidden lg:block"> <img
         src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg"
         alt="Gym training"
         className="absolute inset-0 h-full w-full object-cover"
       />


      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/60 to-[#050505]" />

      <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
        <Link to="/" className="text-2xl font-black">
          GYM<span className="text-orange-500">FIT</span>
          <span className="ml-2 text-xs text-gray-500">2.0</span>
        </Link>

        <div className="max-w-lg">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Member Portal
          </p>

          <h1 className="text-5xl font-black leading-[1] xl:text-6xl">
            YOUR FITNESS.
            <span className="block text-orange-500">
              YOUR DATA.
            </span>
            YOUR PROGRESS.
          </h1>

          <p className="mt-6 max-w-md text-sm leading-7 text-gray-300">
            Access your personalized workouts, progress analytics,
            nutrition goals and membership information from one place.
          </p>

          <div className="mt-8 flex items-center gap-3 text-sm text-gray-400">
            <ShieldCheck size={18} className="text-orange-500" />
            Secure member experience
          </div>
        </div>

        <p className="text-xs text-gray-500">
          © 2026 GymFit 2.0
        </p>
      </div>
    </div>

    <div className="flex items-center justify-center px-5 py-12 sm:px-8 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-10 lg:hidden">
          <Link to="/" className="text-2xl font-black">
            GYM<span className="text-orange-500">FIT</span>
            <span className="ml-2 text-xs text-gray-500">2.0</span>
          </Link>
        </div>

        <div className="mb-9">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
            <Dumbbell size={23} />
          </div>

          <h2 className="text-4xl font-black">
            Welcome back.
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Sign in to continue your fitness journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-4 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-700 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-4 pl-11 pr-12 text-sm outline-none transition placeholder:text-gray-700 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-white disabled:cursor-not-allowed"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-gray-500">
              <input
                type="checkbox"
                className="accent-orange-500"
                disabled={loading}
              />
              Remember me
            </label>

            <button
              type="button"
              disabled={loading}
              className="font-semibold text-orange-500 hover:text-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 text-sm font-bold transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}

            {!loading && (
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-orange-500 hover:text-orange-400"
          >
            Create one
          </Link>
        </p>

        <Link
          to="/"
          className="mt-8 block text-center text-xs text-gray-600 transition hover:text-gray-400"
        >
          ← Back to home
        </Link>
      </motion.div>
    </div>
  </div>
</div>


);
}

export default Login;

