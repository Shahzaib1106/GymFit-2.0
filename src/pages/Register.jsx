import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Dumbbell,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "../context/useAuth.jsx";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    fitness_goal: "general_fitness",
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

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.password) {
      setError("Please enter a password.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        fitness_goal: form.fitness_goal,
      });

      navigate("/member");
    } catch (error) {
      console.error("Registration failed:", error);
      setError(
        error.message || "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden lg:block">
          <img
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
                Start Your Journey
              </p>

              <h1 className="text-5xl font-black leading-[1] xl:text-6xl">
                BUILD YOUR
                <span className="block text-orange-500">
                  STRONGER
                </span>
                SELF.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-gray-300">
                Create your GymFit account and get access to personalized
                workouts, nutrition tracking, progress analytics and your
                membership dashboard.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Personalized workout plans",
                  "Progress tracking",
                  "Nutrition guidance",
                  "Membership management",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-gray-300"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/15 text-orange-500">
                      <Check size={14} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-500">
              © 2026 GymFit 2.0
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
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
                Create account.
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Join GymFit and start building your progress.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="name"
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-4 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-700 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* EMAIL */}
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

              {/* PASSWORD */}
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
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-4 pl-11 pr-12 text-sm outline-none transition placeholder:text-gray-700 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* FITNESS GOAL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Fitness Goal
                </label>

                <select
                  name="fitness_goal"
                  value={form.fitness_goal}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-4 text-sm text-white outline-none transition focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="general_fitness">
                    General Fitness
                  </option>
                  <option value="weight_loss">
                    Weight Loss
                  </option>
                  <option value="muscle_gain">
                    Muscle Gain
                  </option>
                  <option value="strength">
                    Strength
                  </option>
                  <option value="endurance">
                    Endurance
                  </option>
                </select>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 text-sm font-bold transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}

                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-orange-500 hover:text-orange-400"
              >
                Sign in
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

export default Register;