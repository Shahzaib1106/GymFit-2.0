import {
  Dumbbell,
  BarChart3,
  Apple,
  Users,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Dumbbell,
    title: "Smart Workouts",
    text: "Structured workout plans designed around your fitness goals.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    text: "Monitor weight, workouts, performance and personal milestones.",
  },
  {
    icon: Apple,
    title: "Nutrition",
    text: "Keep your nutrition goals organized and understand your daily intake.",
  },
  {
    icon: Users,
    title: "Expert Trainers",
    text: "Get guidance from experienced fitness professionals.",
  },
  {
    icon: ShieldCheck,
    title: "Member Management",
    text: "A complete digital experience for members and gym administration.",
  },
  {
    icon: Zap,
    title: "Built for Results",
    text: "Everything you need to stay consistent and improve every week.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-y border-white/5 bg-[#080808] py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Why GymFit
          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-5xl">
            More than a gym.
            <span className="block text-gray-500">A complete fitness system.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-orange-500/30 hover:bg-white/[0.05]"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <Icon size={23} />
                </div>

                <h3 className="text-xl font-bold">{feature.title}</h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {feature.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}