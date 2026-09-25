import {
  Activity,
  ArrowRight,
  ChevronRight,
  Flame,
  Target,
  TrendingUp,
  Utensils,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import MemberSidebar from "../../components/MemberSidebar";
import MemberHeader from "../../components/MemberHeader";
import { useState } from "react";

const stats = [
  {
    label: "Workout Streak",
    value: "12",
    unit: "days",
    change: "+3 this week",
    icon: Flame,
  },
  {
    label: "Workouts",
    value: "28",
    unit: "completed",
    change: "+6 this month",
    icon: Activity,
  },
  {
    label: "Goal Progress",
    value: "74",
    unit: "%",
    change: "+8% this month",
    icon: Target,
  },
  {
    label: "Calories",
    value: "1,840",
    unit: "today",
    change: "82% of target",
    icon: Utensils,
  },
];

const week = [
  { day: "MON", date: "21", status: "done" },
  { day: "TUE", date: "22", status: "done" },
  { day: "WED", date: "23", status: "done" },
  { day: "THU", date: "24", status: "today" },
  { day: "FRI", date: "25", status: "upcoming" },
  { day: "SAT", date: "26", status: "upcoming" },
  { day: "SUN", date: "27", status: "rest" },
];

export default function MemberDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MemberSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:pl-72">
        <MemberHeader onMenu={() => setMobileOpen(true)} />

        <main className="mx-auto max-w-[1600px] px-5 py-7 lg:px-8">
          <section className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/15 via-white/[0.03] to-transparent p-7 sm:p-9">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="relative max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                Thursday • September 25
              </p>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Keep the momentum going.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
                You are building a strong consistency streak. Complete
                today's session and keep moving toward your goal.
              </p>

              <Link
                to="/member/workouts"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold transition hover:bg-orange-600"
              >
                Start Today's Workout
                <ArrowRight size={17} />
              </Link>
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        {stat.label}
                      </p>

                      <div className="mt-3 flex items-end gap-2">
                        <span className="text-3xl font-black">
                          {stat.value}
                        </span>

                        <span className="mb-1 text-xs text-gray-600">
                          {stat.unit}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-500">
                      <Icon size={19} />
                    </div>
                  </div>

                  <p className="mt-4 text-xs font-medium text-green-400">
                    {stat.change}
                  </p>
                </motion.div>
              );
            })}
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <section className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
                    Weekly activity
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Training calendar
                  </h3>
                </div>

                <Link
                  to="/member/progress"
                  className="text-xs font-semibold text-orange-500"
                >
                  View progress
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-7 gap-2">
                {week.map((item) => (
                  <div
                    key={item.day}
                    className={`rounded-xl p-3 text-center ${
                      item.status === "today"
                        ? "border border-orange-500/40 bg-orange-500/10"
                        : "border border-white/5 bg-black/30"
                    }`}
                  >
                    <p className="text-[9px] font-bold text-gray-600">
                      {item.day}
                    </p>

                    <p className="mt-2 text-lg font-black">
                      {item.date}
                    </p>

                    <div
                      className={`mx-auto mt-3 h-2 w-2 rounded-full ${
                        item.status === "done"
                          ? "bg-green-500"
                          : item.status === "today"
                            ? "bg-orange-500"
                            : item.status === "rest"
                              ? "bg-gray-700"
                              : "bg-gray-800"
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-5 text-xs text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Completed
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  Today
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gray-700" />
                  Rest
                </span>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
                    Today's plan
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Upper Body
                  </h3>
                </div>

                <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-500">
                  <DumbbellIcon />
                </div>
              </div>

              <div className="mt-7 space-y-3">
                {[
                  ["Bench Press", "4 × 10"],
                  ["Lat Pulldown", "4 × 12"],
                  ["Shoulder Press", "3 × 10"],
                  ["Cable Row", "3 × 12"],
                ].map(([name, sets]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-4 py-3"
                  >
                    <span className="text-sm font-medium">{name}</span>
                    <span className="text-xs text-gray-600">{sets}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/member/workouts"
                className="mt-5 flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/5"
              >
                Open workout
                <ChevronRight size={17} />
              </Link>
            </section>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
                    Body composition
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Current progress
                  </h3>
                </div>

                <TrendingUp className="text-orange-500" size={21} />
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <MiniStat label="Weight" value="74.2" unit="kg" />
                <MiniStat label="Body Fat" value="18.4" unit="%" />
                <MiniStat label="BMI" value="23.1" unit="" />
              </div>

              <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-[74%] rounded-full bg-orange-500" />
              </div>

              <div className="mt-3 flex justify-between text-xs text-gray-600">
                <span>Goal progress</span>
                <span>74%</span>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
                    Membership
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Pro Plan
                  </h3>
                </div>

                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                  ACTIVE
                </span>
              </div>

              <div className="mt-7 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black">6,500</p>
                  <p className="mt-1 text-xs text-gray-600">PKR / month</p>
                </div>

                <p className="text-right text-xs text-gray-500">
                  Renews
                  <br />
                  <span className="font-bold text-gray-300">
                    Oct 03, 2026
                  </span>
                </p>
              </div>

              <Link
                to="/member/membership"
                className="mt-6 flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/5"
              >
                Manage membership
                <ChevronRight size={17} />
              </Link>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function MiniStat({ label, value, unit }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 p-4">
      <p className="text-[10px] uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <div className="mt-2 flex items-end gap-1">
        <span className="text-xl font-black">{value}</span>
        <span className="text-[10px] text-gray-600">{unit}</span>
      </div>
    </div>
  );
}

function DumbbellIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6.5 6.5v11" />
      <path d="M17.5 6.5v11" />
      <path d="M3.5 9v6" />
      <path d="M20.5 9v6" />
      <path d="M6.5 12h11" />
    </svg>
  );
}