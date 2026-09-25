import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-black pt-20"
    >
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg"
          alt="Gym training"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Pakistan's Modern Fitness Platform
          </div>

          <h1 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl">
            BUILD YOUR
            <span className="block text-orange-500">STRONGEST</span>
            VERSION.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
            Train smarter, track your progress, follow structured workouts
            and build a healthier lifestyle with GymFit 2.0.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/register"
              className="group flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-4 font-bold transition hover:bg-orange-600"
            >
              Start Your Journey
              <ArrowRight
                size={19}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <button
              onClick={() =>
                document.getElementById("features")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-bold backdrop-blur transition hover:bg-white/10"
            >
              <Play size={17} fill="currentColor" />
              Explore GymFit
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-5 text-sm text-gray-400">
            {["Expert Trainers", "Smart Tracking", "Flexible Plans"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-orange-500" />
                  {item}
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-8 hidden lg:block">
        <div className="rounded-2xl border border-white/10 bg-black/50 p-5 backdrop-blur-xl">
          <p className="text-3xl font-black">10K+</p>
          <p className="mt-1 text-xs text-gray-500">Fitness journeys</p>
        </div>
      </div>
    </section>
  );
}