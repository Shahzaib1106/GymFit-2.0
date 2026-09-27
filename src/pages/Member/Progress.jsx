import {
  Activity,
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import MemberSidebar from "../../components/MemberSidebar.jsx";
import MemberHeader from "../../components/MemberHeader.jsx";
import { useAuth } from "../../context/useAuth.jsx";
import { getDashboard } from "../../services/memberService.js";

export default function Progress() {
  const { token } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProgress = async () => {
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
        console.error("Progress loading failed:", err);
        setError(err.message || "Failed to load progress.");
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [token]);

  const stats = dashboard?.stats || {
    completedWorkouts: 0,
    caloriesBurned: 0,
    workoutMinutes: 0,
    activeWorkouts: 0,
  };

  const weeklyActivity = dashboard?.weeklyActivity || [];
  const recentWorkouts = dashboard?.recentWorkouts || [];

  const weeklyStats = useMemo(() => {
    return weeklyActivity.reduce(
      (total, day) => ({
        workouts: total.workouts + Number(day.workouts || 0),
        calories: total.calories + Number(day.calories || 0),
        minutes: total.minutes + Number(day.minutes || 0),
      }),
      {
        workouts: 0,
        calories: 0,
        minutes: 0,
      }
    );
  }, [weeklyActivity]);

  const consistency =
    weeklyActivity.length > 0
      ? Math.round(
          (weeklyActivity.filter(
            (day) => Number(day.workouts || 0) > 0
          ).length /
            7) *
            100
        )
      : 0;

  const averageWorkoutDuration =
    stats.completedWorkouts > 0
      ? Math.round(
          Number(stats.workoutMinutes || 0) /
            Number(stats.completedWorkouts)
        )
      : 0;

  const averageCalories =
    stats.completedWorkouts > 0
      ? Math.round(
          Number(stats.caloriesBurned || 0) /
            Number(stats.completedWorkouts)
        )
      : 0;

  const strongestDay = weeklyActivity.reduce(
    (strongest, day) => {
      if (
        Number(day.workouts || 0) >
        Number(strongest?.workouts || 0)
      ) {
        return day;
      }

      return strongest;
    },
    null
  );

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
                Loading your progress...
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
                Progress Error
              </p>

              <p className="mt-2 text-sm text-gray-400">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-xs font-bold text-white transition hover:bg-orange-600"
              >
                Retry
              </button>
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

        <main className="mx-auto max-w-[1600px] p-5 sm:p-6 lg:p-8">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500/15 via-[#111111] to-[#080808] p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                  Analytics
                </p>

                <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                  Your Progress
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                  Real training performance based on your completed
                  workout sessions.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold text-gray-400 lg:self-auto">
                <CalendarDays size={16} />
                Last 7 days
              </div>
            </div>
          </section>

          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ProgressCard
              title="Completed Workouts"
              value={stats.completedWorkouts}
              change={`${weeklyStats.workouts} this week`}
              icon={Dumbbell}
            />

            <ProgressCard
              title="Calories Burned"
              value={`${Number(
                stats.caloriesBurned || 0
              ).toLocaleString()} kcal`}
              change={`${weeklyStats.calories.toLocaleString()} this week`}
              icon={Flame}
            />

            <ProgressCard
              title="Training Time"
              value={`${stats.workoutMinutes || 0} min`}
              change={`${weeklyStats.minutes} min this week`}
              icon={Clock3}
            />

            <ProgressCard
              title="Consistency"
              value={`${consistency}%`}
              change={`${weeklyActivity.filter(
                (day) => Number(day.workouts || 0) > 0
              ).length}/7 active days`}
              icon={TrendingUp}
            />
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7 xl:col-span-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                    Weekly Activity
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    Training performance
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Your workout activity over the last 7 days.
                  </p>
                </div>

                <Activity
                  size={20}
                  className="text-orange-500"
                />
              </div>

              <div className="mt-8">
                {weeklyActivity.length === 0 ? (
                  <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-white/10">
                    <div className="text-center">
                      <Dumbbell
                        size={28}
                        className="mx-auto mb-3 text-gray-600"
                      />

                      <p className="text-sm font-semibold text-gray-400">
                        No progress data yet
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        Complete a workout to start tracking your
                        progress.
                      </p>
                    </div>
                  </div>
                ) : (
                  <WeeklyChart data={weeklyActivity} />
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
                  <Target size={20} />
                </div>

                <div>
                  <p className="text-xs text-gray-600">
                    Training overview
                  </p>

                  <h3 className="font-bold">
                    Performance
                  </h3>
                </div>
              </div>

              <div className="mt-7 space-y-5">
                <MetricRow
                  label="Total workouts"
                  value={stats.completedWorkouts}
                  icon={Dumbbell}
                />

                <MetricRow
                  label="Total training time"
                  value={`${stats.workoutMinutes || 0} min`}
                  icon={Clock3}
                />

                <MetricRow
                  label="Calories burned"
                  value={`${Number(
                    stats.caloriesBurned || 0
                  ).toLocaleString()} kcal`}
                  icon={Flame}
                />

                <MetricRow
                  label="Average workout"
                  value={`${averageWorkoutDuration} min`}
                  icon={TrendingUp}
                />

                <MetricRow
                  label="Average calories"
                  value={`${averageCalories} kcal`}
                  icon={Flame}
                />

                <MetricRow
                  label="Active sessions"
                  value={stats.activeWorkouts}
                  icon={Activity}
                />
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                  Weekly Summary
                </p>

                <h3 className="mt-2 text-xl font-black">
                  This week's performance
                </h3>
              </div>

              {strongestDay && Number(strongestDay.workouts) > 0 && (
                <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-xs">
                  <span className="text-gray-500">
                    Most active day
                  </span>

                  <span className="ml-2 font-bold text-orange-400">
                    {new Date(
                      strongestDay.date
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <SummaryCard
                title="Workouts"
                value={weeklyStats.workouts}
                subtitle="completed this week"
                icon={Dumbbell}
              />

              <SummaryCard
                title="Training Time"
                value={`${weeklyStats.minutes} min`}
                subtitle="total this week"
                icon={Clock3}
              />

              <SummaryCard
                title="Calories"
                value={weeklyStats.calories.toLocaleString()}
                subtitle="kcal this week"
                icon={Flame}
              />
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                Training History
              </p>

              <h3 className="mt-2 text-xl font-black">
                Recent performance
              </h3>
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
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recentWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-1 hover:border-orange-500/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="truncate font-bold">
                          {workout.workout_name || "Workout"}
                        </h4>

                        <p className="mt-1 text-xs capitalize text-gray-500">
                          {workout.category || "General"}
                        </p>
                      </div>

                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-green-500"
                      />
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
        </main>
      </div>
    </div>
  );
}

function ProgressCard({
  title,
  value,
  change,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-orange-500/20">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </p>

        <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
          <Icon size={16} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-black">
        {value}
      </p>

      <p className="mt-2 text-xs font-semibold text-green-400">
        {change}
      </p>
    </div>
  );
}

function MetricRow({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
          <Icon size={15} />
        </div>

        <span className="text-xs text-gray-500">
          {label}
        </span>
      </div>

      <span className="text-sm font-bold">
        {value}
      </span>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/30 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-500">
          <Icon size={18} />
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </p>
      </div>

      <p className="mt-5 text-3xl font-black">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}

function WeeklyChart({ data }) {
  const maxWorkouts = Math.max(
    ...data.map((day) => Number(day.workouts || 0)),
    1
  );

  return (
    <div>
      <div className="grid h-64 grid-cols-7 items-end gap-2 sm:gap-4">
        {data.map((day) => {
          const workouts = Number(day.workouts || 0);

          const height =
            workouts === 0
              ? 8
              : Math.max(
                  15,
                  (workouts / maxWorkouts) * 100
                );

          return (
            <div
              key={day.date}
              className="flex h-full flex-col items-center justify-end gap-3"
            >
              <div className="text-center">
                <p className="text-[10px] font-bold text-orange-500">
                  {workouts}
                </p>
              </div>

              <div className="flex h-44 w-full items-end justify-center rounded-xl bg-white/[0.02] p-2">
                <div
                  className="w-full max-w-10 rounded-lg bg-orange-500 transition-all duration-500"
                  style={{
                    height: `${height}%`,
                    opacity: workouts === 0 ? 0.15 : 1,
                  }}
                  title={`${workouts} workout${workouts !== 1 ? "s" : ""}`}
                />
              </div>

              <div className="text-center">
                <p className="text-[10px] font-semibold text-gray-500">
                  {new Date(day.date).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                    }
                  )}
                </p>

                <p className="mt-1 text-[9px] text-gray-700">
                  {day.minutes}m
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <ArrowUp
            size={13}
            className="text-green-400"
          />

          <span>
            {data.filter(
              (day) => Number(day.workouts || 0) > 0
            ).length}{" "}
            active days
          </span>
        </div>

        <span>
          {data.reduce(
            (total, day) =>
              total + Number(day.calories || 0),
            0
          ).toLocaleString()}{" "}
          kcal
        </span>
      </div>
    </div>
  );
}