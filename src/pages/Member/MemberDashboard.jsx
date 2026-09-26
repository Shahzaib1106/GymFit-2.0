import {
  Activity,
  CalendarDays,
  Flame,
  Target,
  TrendingUp,
  Dumbbell,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import MemberSidebar from "../../components/MemberSidebar.jsx";
import MemberHeader from "../../components/MemberHeader.jsx";
import { useAuth } from "../../context/useAuth.jsx";

function MemberDashboard() {
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] || "Member";

  const stats = [
    {
      label: "Current Streak",
      value: "7",
      unit: "days",
      icon: Flame,
    },
    {
      label: "Workouts",
      value: "24",
      unit: "this month",
      icon: Dumbbell,
    },
    {
      label: "Goal Progress",
      value: "78",
      unit: "%",
      icon: Target,
    },
    {
      label: "Calories Burned",
      value: "12.4K",
      unit: "kcal",
      icon: Activity,
    },
  ];

  const quickActions = [
    {
      title: "Start Workout",
      description: "Continue your training plan",
      icon: Dumbbell,
      path: "/member/workouts",
    },
    {
      title: "Track Progress",
      description: "View your fitness analytics",
      icon: TrendingUp,
      path: "/member/progress",
    },
    {
      title: "Nutrition",
      description: "Check today's nutrition plan",
      icon: Flame,
      path: "/member/nutrition",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MemberSidebar />

      <div className="lg:ml-64">
        <MemberHeader />

        <main className="p-5 sm:p-6 lg:p-8">
          {/* HERO */}
          <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500/15 via-[#111] to-[#080808] p-6 sm:p-8">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                Your Fitness Dashboard
              </p>

              <h2 className="text-3xl font-black sm:text-4xl">
                Let's keep the momentum,
                <span className="text-orange-500">
                  {" "}
                  {firstName}.
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">
                Track your workouts, monitor your progress and stay consistent
                with your fitness goals.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-semibold text-orange-400">
                  Goal:{" "}
                  {user?.fitness_goal?.replaceAll("_", " ") ||
                    "General Fitness"}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-gray-400">
                  Member
                </span>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-orange-500/20"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                      <Icon size={19} />
                    </div>

                    <TrendingUp
                      size={16}
                      className="text-green-500"
                    />
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {stat.label}
                  </p>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black">
                      {stat.value}
                    </span>

                    <span className="text-xs text-gray-600">
                      {stat.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          {/* CONTENT GRID */}
          <section className="grid gap-6 xl:grid-cols-3">
            {/* QUICK ACTIONS */}
            <div className="xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
                    Quick Access
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Keep moving
                  </h3>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Link
                      key={action.title}
                      to={action.path}
                      className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-1 hover:border-orange-500/30 hover:bg-orange-500/[0.03]"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                        <Icon size={20} />
                      </div>

                      <h4 className="mt-5 font-bold">
                        {action.title}
                      </h4>

                      <p className="mt-2 text-xs leading-5 text-gray-600">
                        {action.description}
                      </p>

                      <div className="mt-5 flex items-center gap-2 text-xs font-bold text-orange-500">
                        Open
                        <ArrowRight
                          size={14}
                          className="transition group-hover:translate-x-1"
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* TODAY */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-600">
                    Today's Plan
                  </p>

                  <h3 className="font-bold">
                    Thursday Workout
                  </h3>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Upper Body
                </p>

                <p className="mt-2 text-sm font-bold">
                  Strength & Hypertrophy
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-600">
                  Chest, shoulders, triceps and core.
                </p>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    45 min
                  </span>

                  <span className="text-gray-600">
                    6 exercises
                  </span>
                </div>
              </div>

              <Link
                to="/member/workouts"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-xs font-bold text-white transition hover:bg-orange-600"
              >
                View Workout
                <ArrowRight size={15} />
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default MemberDashboard;