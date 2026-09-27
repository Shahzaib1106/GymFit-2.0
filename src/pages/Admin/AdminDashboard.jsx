import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Edit3,
  Flame,
  LogOut,
  Menu,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth.jsx";

const API_URL = "http://localhost:5000/api/admin";

const request = async (
  endpoint,
  token,
  options = {}
) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Request failed."
    );
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

const emptyWorkout = {
  name: "",
  description: "",
  category: "",
  difficulty: "Beginner",
  durationMinutes: "",
  caloriesBurned: "",
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { user, token, logout } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [members, setMembers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] = useState("");
  const [actionError, setActionError] =
    useState("");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState("all");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [workoutSearch, setWorkoutSearch] =
    useState("");

  const [showWorkoutModal, setShowWorkoutModal] =
    useState(false);

  const [editingWorkout, setEditingWorkout] =
    useState(null);

  const [workoutForm, setWorkoutForm] =
    useState(emptyWorkout);

  const loadAdminData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError("");

      const [
        dashboardData,
        membersData,
        logsData,
        workoutsData,
      ] = await Promise.all([
        request("/dashboard", token),
        request("/members", token),
        request("/workout-logs", token),
        request("/workouts", token),
      ]);

      setDashboard(
        dashboardData.dashboard
      );

      setMembers(
        membersData.members || []
      );

      setLogs(
        logsData.logs || []
      );

      setWorkouts(
        workoutsData.workouts || []
      );
    } catch (err) {
      console.error(
        "Admin dashboard error:",
        err
      );

      setError(
        err.message ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let active = true;

    const fetchAdminData = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError("");

        const [
          dashboardData,
          membersData,
          logsData,
          workoutsData,
        ] = await Promise.all([
          request("/dashboard", token),
          request("/members", token),
          request("/workout-logs", token),
          request("/workouts", token),
        ]);

        if (!active) return;

        setDashboard(
          dashboardData.dashboard
        );

        setMembers(
          membersData.members || []
        );

        setLogs(
          logsData.logs || []
        );

        setWorkouts(
          workoutsData.workouts || []
        );
      } catch (err) {
        if (!active) return;

        console.error(
          "Admin dashboard error:",
          err
        );

        setError(
          err.message ||
            "Failed to load admin dashboard."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchAdminData();

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    if (
      !loading &&
      user &&
      user.role !== "admin"
    ) {
      navigate("/member", {
        replace: true,
      });
    }
  }, [
    user,
    loading,
    navigate,
  ]);

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  const handleStatusChange = async (
    member
  ) => {
    if (actionLoading) return;

    try {
      setActionLoading(
        `status-${member.id}`
      );

      setActionError("");

      await request(
        `/members/${member.id}/status`,
        token,
        {
          method: "PATCH",
          body: JSON.stringify({
            isActive:
              !member.is_active,
          }),
        }
      );

      setMembers((previous) =>
        previous.map((item) =>
          item.id === member.id
            ? {
                ...item,
                is_active:
                  !member.is_active,
              }
            : item
        )
      );
    } catch (err) {
      setActionError(
        err.message ||
          "Failed to update member status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteMember = async (
    member
  ) => {
    if (actionLoading) return;

    const confirmed =
      window.confirm(
        `Delete ${
          member.name ||
          "this member"
        } permanently?`
      );

    if (!confirmed) return;

    try {
      setActionLoading(
        `delete-${member.id}`
      );

      setActionError("");

      await request(
        `/members/${member.id}`,
        token,
        {
          method: "DELETE",
        }
      );

      setMembers((previous) =>
        previous.filter(
          (item) =>
            item.id !== member.id
        )
      );
    } catch (err) {
      setActionError(
        err.message ||
          "Failed to delete member."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const filteredMembers = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return members.filter(
      (member) => {
        const matchesSearch =
          !query ||
          member.name
            ?.toLowerCase()
            .includes(query) ||
          member.email
            ?.toLowerCase()
            .includes(query);

        const matchesRole =
          roleFilter === "all" ||
          member.role === roleFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter ===
            "active" &&
            member.is_active) ||
          (statusFilter ===
            "inactive" &&
            !member.is_active);

        return (
          matchesSearch &&
          matchesRole &&
          matchesStatus
        );
      }
    );
  }, [
    members,
    search,
    roleFilter,
    statusFilter,
  ]);

  const filteredWorkouts = useMemo(() => {
    const query =
      workoutSearch
        .trim()
        .toLowerCase();

    return workouts.filter(
      (workout) =>
        !query ||
        workout.name
          ?.toLowerCase()
          .includes(query) ||
        workout.category
          ?.toLowerCase()
          .includes(query) ||
        workout.difficulty
          ?.toLowerCase()
          .includes(query)
    );
  }, [
    workouts,
    workoutSearch,
  ]);

  const stats = dashboard?.stats || {};

  const completedRate = useMemo(() => {
    const total = Number(
      stats.totalSessions || 0
    );

    const completed = Number(
      stats.completedWorkouts || 0
    );

    if (!total) return 0;

    return Math.round(
      (completed / total) * 100
    );
  }, [
    stats.totalSessions,
    stats.completedWorkouts,
  ]);

  const activeMembers = members.filter(
    (member) => member.is_active
  ).length;

  const inactiveMembers =
    members.filter(
      (member) => !member.is_active
    ).length;

  const openCreateWorkout = () => {
    setEditingWorkout(null);

    setWorkoutForm(
      emptyWorkout
    );

    setActionError("");

    setShowWorkoutModal(true);
  };

  const openEditWorkout = (
    workout
  ) => {
    setEditingWorkout(workout);

    setWorkoutForm({
      name: workout.name || "",
      description:
        workout.description || "",
      category:
        workout.category || "",
      difficulty:
        workout.difficulty ||
        "Beginner",
      durationMinutes:
        workout.duration_minutes ||
        "",
      caloriesBurned:
        workout.calories_burned ||
        "",
    });

    setActionError("");

    setShowWorkoutModal(true);
  };

  const closeWorkoutModal = () => {
    if (actionLoading) return;

    setShowWorkoutModal(false);

    setEditingWorkout(null);

    setWorkoutForm(
      emptyWorkout
    );
  };

  const handleWorkoutSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (actionLoading) return;

    try {
      setActionLoading(
        editingWorkout
          ? `edit-workout-${editingWorkout.id}`
          : "create-workout"
      );

      setActionError("");

      const endpoint =
        editingWorkout
          ? `/workouts/${editingWorkout.id}`
          : "/workouts";

      const method =
        editingWorkout
          ? "PATCH"
          : "POST";

      const data = await request(
        endpoint,
        token,
        {
          method,
          body: JSON.stringify(
            workoutForm
          ),
        }
      );

      if (editingWorkout) {
        setWorkouts((previous) =>
          previous.map((item) =>
            item.id ===
            editingWorkout.id
              ? {
                  ...item,
                  ...data.workout,
                }
              : item
          )
        );
      } else {
        setWorkouts((previous) => [
          data.workout,
          ...previous,
        ]);
      }

      setShowWorkoutModal(false);

      setEditingWorkout(null);

      setWorkoutForm(
        emptyWorkout
      );
    } catch (err) {
      setActionError(
        err.message ||
          "Failed to save workout."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleWorkoutDeactivate =
    async (workout) => {
      if (actionLoading) return;

      const confirmed =
        window.confirm(
          `Deactivate "${workout.name}"?`
        );

      if (!confirmed) return;

      try {
        setActionLoading(
          `workout-${workout.id}`
        );

        setActionError("");

        await request(
          `/workouts/${workout.id}`,
          token,
          {
            method: "DELETE",
          }
        );

        setWorkouts((previous) =>
          previous.map((item) =>
            item.id === workout.id
              ? {
                  ...item,
                  is_active: false,
                }
              : item
          )
        );
      } catch (err) {
        setActionError(
          err.message ||
            "Failed to deactivate workout."
        );
      } finally {
        setActionLoading(null);
      }
    };

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
          <ShieldCheck
            className="mx-auto mb-5 text-red-400"
            size={42}
          />

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
          onClick={() =>
            setMobileOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          aria-label="Close admin menu"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#080808] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <button
            type="button"
            onClick={() =>
              navigate("/member")
            }
            className="text-2xl font-black"
          >
            GYM
            <span className="text-orange-500">
              FIT
            </span>

            <span className="ml-2 text-xs font-semibold text-gray-600">
              2.0
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setMobileOpen(false)
            }
            className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close admin menu"
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
                  {user?.name ||
                    "Administrator"}
                </p>

                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
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
              onClick={() =>
                setMobileOpen(true)
              }
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

            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>
        </header>

        <div className="space-y-8 p-5 lg:p-8">
          <section>
            <div className="mb-6">
              <p className="text-sm font-semibold text-orange-500">
                Control Center
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Welcome,{" "}
                {user?.name?.split(
                  " "
                )[0] || "Admin"}
                .
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Monitor members, workout activity,
                platform usage, and overall GymFit
                performance from one place.
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
                          {Number(
                            stats[
                              item.key
                            ] || 0
                          ).toLocaleString()}
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

                <Activity
                  className="text-orange-500"
                  size={22}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/[0.03] p-5">
                  <p className="text-xs text-gray-500">
                    Total Sessions
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {Number(
                      stats.totalSessions ||
                        0
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.03] p-5">
                  <p className="text-xs text-gray-500">
                    Completed
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {Number(
                      stats.completedWorkouts ||
                        0
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
                    {stats.activeWorkouts ||
                      0}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-sm text-gray-500">
                    Workout plans
                  </span>

                  <span className="font-bold">
                    {stats.totalWorkouts ||
                      0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Exercise library
                  </span>

                  <span className="font-bold">
                    {stats.totalExercises ||
                      0}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Member Management
              </p>

              <h3 className="mt-1 text-xl font-bold">
                Manage Accounts
              </h3>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-gray-500">
                  Total Accounts
                </p>

                <p className="mt-2 text-2xl font-black">
                  {members.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-gray-500">
                  Active Accounts
                </p>

                <p className="mt-2 text-2xl font-black text-green-400">
                  {activeMembers}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-gray-500">
                  Inactive Accounts
                </p>

                <p className="mt-2 text-2xl font-black text-red-400">
                  {inactiveMembers}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="border-b border-white/10 p-5">
                <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search by name or email..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500/40"
                    />
                  </div>

                  <select
                    value={roleFilter}
                    onChange={(event) =>
                      setRoleFilter(
                        event.target.value
                      )
                    }
                    className="rounded-xl border border-white/10 bg-[#0c0c0c] px-4 py-3 text-sm text-gray-300 outline-none focus:border-orange-500/40"
                  >
                    <option value="all">
                      All Roles
                    </option>

                    <option value="member">
                      Members
                    </option>

                    <option value="trainer">
                      Trainers
                    </option>

                    <option value="admin">
                      Admins
                    </option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value
                      )
                    }
                    className="rounded-xl border border-white/10 bg-[#0c0c0c] px-4 py-3 text-sm text-gray-300 outline-none focus:border-orange-500/40"
                  >
                    <option value="all">
                      All Status
                    </option>

                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>
                  </select>
                </div>

                {actionError && (
                  <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                    {actionError}
                  </div>
                )}
              </div>

              {filteredMembers.length ===
              0 ? (
                <div className="p-10 text-center">
                  <Users
                    className="mx-auto mb-3 text-gray-700"
                    size={36}
                  />

                  <p className="text-sm font-semibold text-gray-400">
                    No accounts found
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[950px] text-left">
                    <thead className="border-b border-white/10 bg-white/[0.02]">
                      <tr>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Account
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Goal
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Role
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Status
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Joined
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredMembers.map(
                        (member) => {
                          const statusLoading =
                            actionLoading ===
                            `status-${member.id}`;

                          const deleteLoading =
                            actionLoading ===
                            `delete-${member.id}`;

                          return (
                            <tr
                              key={member.id}
                              className="border-b border-white/5 last:border-0"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 font-bold text-orange-500">
                                    {member.name
                                      ?.charAt(
                                        0
                                      )
                                      ?.toUpperCase() ||
                                      "U"}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="truncate font-semibold">
                                      {member.name ||
                                        "Unknown User"}
                                    </p>

                                    <p className="mt-1 truncate text-xs text-gray-600">
                                      {member.email}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-4 text-sm capitalize text-gray-400">
                                {member.fitness_goal ||
                                  "Not set"}
                              </td>

                              <td className="px-5 py-4">
                                <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold capitalize text-gray-400">
                                  {member.role ||
                                    "member"}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                    member.is_active
                                      ? "bg-green-500/10 text-green-400"
                                      : "bg-red-500/10 text-red-400"
                                  }`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      member.is_active
                                        ? "bg-green-400"
                                        : "bg-red-400"
                                    }`}
                                  />

                                  {member.is_active
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-sm text-gray-500">
                                {formatDate(
                                  member.created_at
                                )}
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleStatusChange(
                                        member
                                      )
                                    }
                                    disabled={
                                      statusLoading ||
                                      deleteLoading ||
                                      member.id ===
                                        user?.id
                                    }
                                    className={`rounded-lg border p-2 transition disabled:cursor-not-allowed disabled:opacity-30 ${
                                      member.is_active
                                        ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
                                        : "border-green-500/20 text-green-400 hover:bg-green-500/10"
                                    }`}
                                  >
                                    {statusLoading ? (
                                      <RefreshCw
                                        size={16}
                                        className="animate-spin"
                                      />
                                    ) : member.is_active ? (
                                      <UserX
                                        size={16}
                                      />
                                    ) : (
                                      <UserCheck
                                        size={16}
                                      />
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteMember(
                                        member
                                      )
                                    }
                                    disabled={
                                      statusLoading ||
                                      deleteLoading ||
                                      member.id ===
                                        user?.id
                                    }
                                    className="rounded-lg border border-red-500/20 p-2 text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                                  >
                                    {deleteLoading ? (
                                      <RefreshCw
                                        size={16}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Trash2
                                        size={16}
                                      />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="border-t border-white/10 px-5 py-4 text-xs text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-400">
                  {
                    filteredMembers.length
                  }
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-400">
                  {members.length}
                </span>{" "}
                accounts
              </div>
            </div>
          </section>

          <section>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Workout Management
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Manage Workout Plans
                </h3>
              </div>

              <button
                type="button"
                onClick={
                  openCreateWorkout
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                <Plus size={18} />
                Add Workout
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="border-b border-white/10 p-5">
                <div className="relative max-w-xl">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    type="text"
                    value={workoutSearch}
                    onChange={(event) =>
                      setWorkoutSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search workout plans..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500/40"
                  />
                </div>
              </div>

              {filteredWorkouts.length ===
              0 ? (
                <div className="p-10 text-center">
                  <Dumbbell
                    className="mx-auto mb-3 text-gray-700"
                    size={36}
                  />

                  <p className="text-sm font-semibold text-gray-400">
                    No workout plans found
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[950px] text-left">
                    <thead className="border-b border-white/10 bg-white/[0.02]">
                      <tr>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Workout
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Category
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Difficulty
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Exercises
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Duration
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredWorkouts.map(
                        (workout) => {
                          const workoutLoading =
                            actionLoading ===
                            `workout-${workout.id}`;

                          return (
                            <tr
                              key={workout.id}
                              className={`border-b border-white/5 last:border-0 ${
                                !workout.is_active
                                  ? "opacity-50"
                                  : ""
                              }`}
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                                    <Dumbbell
                                      size={18}
                                    />
                                  </div>

                                  <div>
                                    <p className="font-semibold">
                                      {
                                        workout.name
                                      }
                                    </p>

                                    <p className="mt-1 max-w-xs truncate text-xs text-gray-600">
                                      {
                                        workout.description ||
                                        "No description"
                                      }
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-4 text-sm capitalize text-gray-400">
                                {
                                  workout.category ||
                                  "General"
                                }
                              </td>

                              <td className="px-5 py-4">
                                <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
                                  {
                                    workout.difficulty
                                  }
                                </span>
                              </td>

                              <td className="px-5 py-4 text-sm text-gray-400">
                                {
                                  workout.exercise_count
                                }
                              </td>

                              <td className="px-5 py-4 text-sm text-gray-400">
                                {workout.duration_minutes
                                  ? `${workout.duration_minutes} min`
                                  : "—"}
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEditWorkout(
                                        workout
                                      )
                                    }
                                    className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-orange-500/30 hover:text-orange-400"
                                  >
                                    <Edit3
                                      size={16}
                                    />
                                  </button>

                                  {workout.is_active && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleWorkoutDeactivate(
                                          workout
                                        )
                                      }
                                      disabled={
                                        workoutLoading
                                      }
                                      className="rounded-lg border border-red-500/20 p-2 text-red-400 transition hover:bg-red-500/10 disabled:opacity-30"
                                    >
                                      {workoutLoading ? (
                                        <RefreshCw
                                          size={16}
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <Trash2
                                          size={16}
                                        />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="border-t border-white/10 px-5 py-4 text-xs text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-400">
                  {
                    filteredWorkouts.length
                  }
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-400">
                  {workouts.length}
                </span>{" "}
                workout plans
              </div>
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
                      {logs
                        .slice(0, 10)
                        .map((log) => (
                          <tr
                            key={log.id}
                            className="border-b border-white/5 last:border-0"
                          >
                            <td className="px-5 py-4">
                              <p className="font-semibold">
                                {
                                  log.member_name
                                }
                              </p>

                              <p className="mt-1 text-xs text-gray-600">
                                {
                                  log.member_email
                                }
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="font-semibold">
                                {
                                  log.workout_name
                                }
                              </p>

                              <p className="mt-1 text-xs text-gray-600">
                                {
                                  log.category
                                }
                              </p>
                            </td>

                            <td className="px-5 py-4 text-sm capitalize text-gray-400">
                              {
                                log.difficulty ||
                                "—"
                              }
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
                                  log.status ===
                                  "completed"
                                    ? "bg-green-500/10 text-green-400"
                                    : log.status ===
                                        "started"
                                      ? "bg-orange-500/10 text-orange-400"
                                      : "bg-white/5 text-gray-500"
                                }`}
                              >
                                {
                                  log.status
                                }
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

      {showWorkoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Workout Management
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  {editingWorkout
                    ? "Edit Workout"
                    : "Create Workout"}
                </h3>
              </div>

              <button
                type="button"
                onClick={
                  closeWorkoutModal
                }
                className="rounded-xl p-2 text-gray-500 transition hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={
                handleWorkoutSubmit
              }
              className="space-y-5 p-6"
            >
              {actionError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  {actionError}
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Workout Name
                </label>

                <input
                  type="text"
                  required
                  value={workoutForm.name}
                  onChange={(event) =>
                    setWorkoutForm(
                      (previous) => ({
                        ...previous,
                        name: event.target
                          .value,
                      })
                    )
                  }
                  placeholder="e.g. Upper Body Power"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-orange-500/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={
                    workoutForm.description
                  }
                  onChange={(event) =>
                    setWorkoutForm(
                      (previous) => ({
                        ...previous,
                        description:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="Describe the workout plan..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-orange-500/40"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Category
                  </label>

                  <input
                    type="text"
                    value={
                      workoutForm.category
                    }
                    onChange={(event) =>
                      setWorkoutForm(
                        (previous) => ({
                          ...previous,
                          category:
                            event.target
                              .value,
                        })
                      )
                    }
                    placeholder="Strength"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-orange-500/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Difficulty
                  </label>

                  <select
                    value={
                      workoutForm.difficulty
                    }
                    onChange={(event) =>
                      setWorkoutForm(
                        (previous) => ({
                          ...previous,
                          difficulty:
                            event.target
                              .value,
                        })
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-gray-300 outline-none focus:border-orange-500/40"
                  >
                    <option value="Beginner">
                      Beginner
                    </option>

                    <option value="Intermediate">
                      Intermediate
                    </option>

                    <option value="Advanced">
                      Advanced
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Duration (minutes)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      workoutForm.durationMinutes
                    }
                    onChange={(event) =>
                      setWorkoutForm(
                        (previous) => ({
                          ...previous,
                          durationMinutes:
                            event.target
                              .value,
                        })
                      )
                    }
                    placeholder="45"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-orange-500/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Calories Burned
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      workoutForm.caloriesBurned
                    }
                    onChange={(event) =>
                      setWorkoutForm(
                        (previous) => ({
                          ...previous,
                          caloriesBurned:
                            event.target
                              .value,
                        })
                      )
                    }
                    placeholder="350"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-orange-500/40"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    closeWorkoutModal
                  }
                  disabled={
                    !!actionLoading
                  }
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    !!actionLoading
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <CheckCircle2
                      size={17}
                    />
                  )}

                  {editingWorkout
                    ? "Save Changes"
                    : "Create Workout"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}