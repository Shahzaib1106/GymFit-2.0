import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  LogOut,
  Menu,
  RefreshCw,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth.jsx";

const API_URL = "http://localhost:5000/api/admin";

const request = async (endpoint, token) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load admin data.");
  }

  return data;
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const statCards = [
  {
    key: "totalMembers",
    label: "Total Members",
    icon: Users,
    description: "Registered members",
  },
  {
    key: "activeWorkouts",
    label: "Active Sessions",
    icon: Activity,
    description: "Currently in progress",
  },
  {
    key: "completedWorkouts",
    label: "Completed Workouts",
    icon: CheckCircle2,
    description: "Completed sessions",
  },
  {
    key: "totalCalories",
    label: "Calories Burned",
    icon: Flame,
    description: "Across all sessions",
  },
  {
    key: "totalWorkouts",
    label: "Workout Plans",
    icon: Dumbbell,
    description: "Active workout plans",
  },
  {
    key: "totalExercises",
    label: "Exercises",
    icon: BarChart3,
    description: "Exercise library",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [members, setMembers] = useState([]);
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const loadAdminData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError("");

      const [dashboardData, membersData, logsData] =
        await Promise.all([
          request("/dashboard", token),
          request("/members", token),
          request("/workout-logs", token),
        ]);

      setDashboard(dashboardData.dashboard);
      setMembers(membersData.members || []);
      setLogs(logsData.logs || []);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError(err.message || "Failed to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadAdminData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadAdminData]);

  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      navigate("/member", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const stats = dashboard?.stats || {};

  const completedRate = useMemo(() => {
    const total = Number(stats.totalSessions || 0);
    const completed = Number(stats.completedWorkouts || 0);

    if (!total) return 0;

    return Math.round((completed / total) * 100);
  }, [stats.totalSessions, stats.completedWorkouts]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <p className="text-sm text-gray-400">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <ShieldCheck className="mx-auto mb-5 text-red-400" size={42} />

          <h1 className="text-xl font-bold">
            Admin dashboard unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={loadAdminData}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            <RefreshCw size={17} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          aria-label="Close admin menu"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#080808] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <button
            type="button"
            onClick={() => navigate("/member")}
            className="text-2xl font-black"
          >
            GYM<span className="text-orange-500">FIT</span>
            <span className="ml-2 text-xs font-semibold text-gray-600">
              2.0
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b border-white/10 p-5">
          <div className="rounded-2xl bg-orange-500/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
                <ShieldCheck size={21} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {user?.name || "Administrator"}
                </p>

                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
            Admin Area
          </p>

          <div className="rounded-xl bg-orange-500 px-3 py-3 text-sm font-semibold">
            <div className="flex items-center gap-3">
              <BarChart3 size={19} />
              Dashboard
            </div>
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="lg:ml-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#080808]/90 px-5 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-white/10 p-2 text-gray-400 hover:text-white lg:hidden"
              aria-label="Open admin menu"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Admin Portal
              </p>

              <h1 className="text-lg font-bold">
                GymFit Overview
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={loadAdminData}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-orange-500/30 hover:text-white"
          >
            <RefreshCw size={17} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        <div className="space-y-8 p-5 lg:p-8">
          <section>
            <div className="mb-6">
              <p className="text-sm font-semibold text-orange-500">
                Control Center
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Welcome, {user?.name?.split(" ")[0] || "Admin"}.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Monitor members, workout activity, platform usage,
                and overall GymFit performance from one place.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {statCards.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.key}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-orange-500/20"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          {item.label}
                        </p>

                        <p className="mt-3 text-3xl font-black">
                          {Number(stats[item.key] || 0).toLocaleString()}
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          {item.description}
                        </p>
                      </div>

                      <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
                        <Icon size={20} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Platform Activity
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Workout Sessions
                  </h3>
                </div>

                <Activity className="text-orange-500" size={22} />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/[0.03] p-5">
                  <p className="text-xs text-gray-500">
                    Total Sessions
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {Number(
                      stats.totalSessions || 0
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.03] p-5">
                  <p className="text-xs text-gray-500">
                    Completed
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {Number(
                      stats.completedWorkouts || 0
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.03] p-5">
                  <p className="text-xs text-gray-500">
                    Completion Rate
                  </p>

                  <p className="mt-2 text-2xl font-black text-orange-500">
                    {completedRate}%
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Session completion
                  </span>

                  <span className="font-semibold text-white">
                    {completedRate}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all"
                    style={{
                      width: `${completedRate}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
                  <Clock3 size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Live Status
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    System Monitor
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-sm text-gray-500">
                    Active workouts
                  </span>

                  <span className="font-bold text-orange-500">
                    {stats.activeWorkouts || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-sm text-gray-500">
                    Workout plans
                  </span>

                  <span className="font-bold">
                    {stats.totalWorkouts || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Exercise library
                  </span>

                  <span className="font-bold">
                    {stats.totalExercises || 0}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Latest Accounts
              </p>

              <h3 className="mt-1 text-xl font-bold">
                Recent Members
              </h3>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              {members.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  No members found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left">
                    <thead className="border-b border-white/10 bg-white/[0.02]">
                      <tr>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Member
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Email
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Goal
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Role
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Joined
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {members.map((member) => (
                        <tr
                          key={member.id}
                          className="border-b border-white/5 last:border-0"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-sm font-bold text-orange-500">
                                {member.name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "M"}
                              </div>

                              <span className="font-semibold">
                                {member.name || "Member"}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-500">
                            {member.email}
                          </td>

                          <td className="px-5 py-4 text-sm capitalize text-gray-400">
                            {member.fitness_goal || "Not set"}
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold capitalize text-gray-400">
                              {member.role || "member"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-500">
                            {formatDate(member.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Recent Activity
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Workout Logs
                </h3>
              </div>

              <span className="text-xs text-gray-600">
                Latest {logs.length} records
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              {logs.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  No workout activity found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left">
                    <thead className="border-b border-white/10 bg-white/[0.02]">
                      <tr>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Member
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Workout
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Difficulty
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Duration
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Calories
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {logs.slice(0, 10).map((log) => (
                        <tr
                          key={log.id}
                          className="border-b border-white/5 last:border-0"
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold">
                              {log.member_name || "Member"}
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                              {log.member_email}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-semibold">
                              {log.workout_name || "Workout"}
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                              {log.category || "General"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm capitalize text-gray-400">
                            {log.difficulty || "—"}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-400">
                            {log.duration_minutes
                              ? `${log.duration_minutes} min`
                              : "—"}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-400">
                            {log.calories_burned
                              ? `${log.calories_burned} kcal`
                              : "—"}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                log.status === "completed"
                                  ? "bg-green-500/10 text-green-400"
                                  : log.status === "started"
                                    ? "bg-orange-500/10 text-orange-400"
                                    : "bg-white/5 text-gray-500"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}