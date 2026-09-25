import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    localStorage.setItem(
      "gymfit_registered_user",
      JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      })
    );

    localStorage.setItem(
      "gymfit_user",
      JSON.stringify({
        name: form.name,
        email: form.email,
      })
    );

    navigate("/member");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left */}
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg"
            alt="Fitness training"
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
                Start Today
              </p>

              <h1 className="text-5xl font-black leading-[1] xl:text-6xl">
                BUILD YOUR
                <span className="block text-orange-500">STRONGEST</span>
                VERSION.
              </h1>

              <div className="mt-8 space-y-4">
                {[
                  "Personalized workout tracking",
                  "Progress & performance analytics",
                  "Nutrition management",
                  "Digital membership management",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-gray-300"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-orange-500"
                    />
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

        {/* Right */}
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

            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                <Dumbbell size={23} />
              </div>

              <h2 className="text-4xl font-black">
                Create account.
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Join GymFit and start tracking your fitness journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Full name
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
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-4 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-700 focus:border-orange-500"
                  />
                </div>
              </div>

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
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-4 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-700 focus:border-orange-500"
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
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-4 pl-11 pr-12 text-sm outline-none transition placeholder:text-gray-700 focus:border-orange-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Confirm password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-4 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-700 focus:border-orange-500"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 py-2 text-xs leading-5 text-gray-500">
                <input
                  type="checkbox"
                  required
                  className="mt-1 accent-orange-500"
                />
                I agree to the GymFit terms and understand that this is a
                fitness management platform.
              </label>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 text-sm font-bold transition hover:bg-orange-600"
              >
                Create Account
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
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
              className="mt-7 block text-center text-xs text-gray-600 transition hover:text-gray-400"
            >
              ← Back to GymFit
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}