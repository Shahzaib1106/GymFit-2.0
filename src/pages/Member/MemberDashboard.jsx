import { useEffect, useState } from "react";

import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";

import { Link } from "react-router-dom";

import MemberSidebar from "../../components/MemberSidebar.jsx";
import MemberHeader from "../../components/MemberHeader.jsx";

import { useAuth } from "../../context/useAuth.jsx";
import { getDashboard } from "../../services/memberService.js";

function MemberDashboard() {
  const { user, token } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getDashboard(token);

        setDashboard(data.dashboard);
      } catch (err) {
        console.error("Dashboard loading failed:", err);

        setError(
          err.message || "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  const member = dashboard?.member || user;

  const firstName =
    member?.name?.split(" ")[0] || "Member";

  const stats = dashboard?.stats || {
    completedWorkouts: 0,
    caloriesBurned: 0,
    workoutMinutes: 0,
    activeWorkouts: 0,
    availableWorkouts: 0,
    availableExercises: 0,
  };

  const recentWorkouts =
    dashboard?.recentWorkouts || [];

  const weeklyActivity =
    dashboard?.weeklyActivity || [];

  const fitnessGoal =
    member?.fitness_goal
      ?.replaceAll("_", " ")
      ?.replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      ) || "General Fitness";

  const quickActions = [
    {
      title: "Start Workout",
      description: "Choose a workout and start training.",
      icon: Dumbbell,
      path: "/member/workouts",
    },
    {
      title: "Exercise Library",
      description:
        "Explore exercises and training techniques.",
      icon: Activity,
      path: "/member/exercises",
    },
    {
      title: "Track Progress",
      description:
        "Review your fitness progress and activity.",
      icon: TrendingUp,
      path: "/member/progress",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <MemberSidebar />

        <div className="lg:ml-64">
          <MemberHeader />

          <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />

              <p className="text-sm text-gray-400">
                Loading your dashboard...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <MemberSidebar />

        <div className="lg:ml-64">
          <MemberHeader />

          <main className="p-5 sm:p-6 lg:p-8">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <p className="text-sm font-semibold text-red-400">
                Dashboard Error
              </p>

              <p className="mt-2 text-sm text-gray-400">
                {error}
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MemberSidebar />

      <div className="lg:ml-64">
        <MemberHeader />

        <main className="p-5 sm:p-6 lg:p-8">
          {/* HERO */}
          <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500/15 via-[#111111] to-[#080808] p-6 sm:p-8">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                Your Fitness Dashboard
              </p>

              <h2 className="text-3xl font-black sm:text-4xl">
                Let's keep the momentum{" "}
                <span className="text-orange-500">
                  {firstName}.
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">
                Track your workouts, monitor your activity
                and stay consistent with your fitness goals.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-semibold capitalize text-orange-400">
                  Goal: {fitnessGoal}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-gray-400">
                  Member
                </span>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Completed Workouts"
              value={stats.completedWorkouts}
              unit="total"
              icon={Dumbbell}
            />

            <StatCard
              label="Calories Burned"
              value={stats.caloriesBurned.toLocaleString()}
              unit="kcal"
              icon={Flame}
            />

            <StatCard
              label="Workout Time"
              value={stats.workoutMinutes}
              unit="minutes"
              icon={Clock3}
            />

            <StatCard
              label="Active Workouts"
              value={stats.activeWorkouts}
              unit="in progress"
              icon={Activity}
            />
          </section>

          {/* ACTIVITY + QUICK ACTIONS */}
          <section className="mb-8 grid gap-6 xl:grid-cols-3">
            {/* WEEKLY ACTIVITY */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 xl:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
                    Activity
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Recent weekly activity
                  </h3>
                </div>

                <TrendingUp
                  size={20}
                  className="text-orange-500"
                />
              </div>

              {weeklyActivity.length === 0 ? (
                <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-white/10">
                  <div className="text-center">
                    <CalendarDays
                      size={24}
                      className="mx-auto mb-3 text-gray-600"
                    />

                    <p className="text-sm font-semibold text-gray-400">
                      No workout activity yet
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                      Complete your first workout to see
                      activity here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {weeklyActivity.map((day) => (
                    <div
                      key={day.workout_date}
                      className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                        <CheckCircle2 size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">
                          {new Date(
                            day.workout_date
                          ).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {day.workouts} workout
                          {day.workouts !== 1 ? "s" : ""}
                          {" · "}
                          {day.minutes} min
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-orange-500">
                        <Flame size={14} />
                        {day.calories} kcal
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FITNESS OVERVIEW */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <Target size={19} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500">
                    Fitness Overview
                  </p>

                  <h3 className="font-bold">
                    Your training
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <OverviewRow
                  label="Fitness Goal"
                  value={fitnessGoal}
                />

                <OverviewRow
                  label="Available Workouts"
                  value={stats.availableWorkouts}
                />

                <OverviewRow
                  label="Exercise Library"
                  value={stats.availableExercises}
                />

                <OverviewRow
                  label="Active Sessions"
                  value={stats.activeWorkouts}
                />
              </div>

              <Link
                to="/member/profile"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-gray-300 transition hover:border-orange-500/30 hover:text-orange-500"
              >
                View Profile
                <ArrowRight size={15} />
              </Link>
            </div>
          </section>

          {/* RECENT WORKOUTS */}
          <section className="mb-8">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
                  Training History
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Recent workouts
                </h3>
              </div>

              <Link
                to="/member/workouts"
                className="hidden items-center gap-2 text-xs font-bold text-orange-500 sm:flex"
              >
                All workouts
                <ArrowRight size={14} />
              </Link>
            </div>

            {recentWorkouts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                <Dumbbell
                  size={28}
                  className="mx-auto mb-3 text-gray-600"
                />

                <p className="text-sm font-semibold text-gray-400">
                  No workout history yet
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  Start your first workout to build your
                  history.
                </p>

                <Link
                  to="/member/workouts"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-xs font-bold text-white transition hover:bg-orange-600"
                >
                  Start Workout
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recentWorkouts.map((workout) => (
                  <div
                    key={workout.log_id}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold">
                          {workout.name || "Workout"}
                        </h4>

                        <p className="mt-1 text-xs capitalize text-gray-500">
                          {workout.category || "General"}
                        </p>
                      </div>

                      <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-bold uppercase text-green-500">
                        {workout.status}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/[0.03] p-3">
                        <p className="text-[10px] uppercase tracking-wider text-gray-600">
                          Duration
                        </p>

                        <p className="mt-1 text-sm font-bold">
                          {workout.duration_minutes || 0} min
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/[0.03] p-3">
                        <p className="text-[10px] uppercase tracking-wider text-gray-600">
                          Calories
                        </p>

                        <p className="mt-1 text-sm font-bold">
                          {workout.calories_burned || 0} kcal
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-gray-600">
                      {workout.completed_at
                        ? new Date(
                            workout.completed_at
                          ).toLocaleDateString()
                        : "Recently"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* QUICK ACTIONS */}
          <section>
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
                Quick Access
              </p>

              <h3 className="mt-1 text-xl font-bold">
                Keep moving
              </h3>
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

                    <p className="mt-2 text-xs leading-5 text-gray-500">
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
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-orange-500/20">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
          <Icon size={19} />
        </div>

        <TrendingUp
          size={16}
          className="text-green-500"
        />
      </div>

      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-black">
          {value}
        </span>

        <span className="text-xs text-gray-500">
          {unit}
        </span>
      </div>
    </div>
  );
}

function OverviewRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
      <span className="text-xs text-gray-500">
        {label}
      </span>

      <span className="max-w-40 truncate text-right text-sm font-semibold capitalize">
        {value}
      </span>
    </div>
  );
}

export default MemberDashboard;