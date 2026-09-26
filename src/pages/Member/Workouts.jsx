import { useEffect, useState } from "react";

import {
  Clock,
  Dumbbell,
  Flame,
  Play,
} from "lucide-react";

import MemberSidebar from "../../components/MemberSidebar";
import MemberHeader from "../../components/MemberHeader";
import { useAuth } from "../../context/useAuth.jsx";
import { getWorkouts } from "../../services/memberService.js";

export default function Workouts() {
  const { token } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [selected, setSelected] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWorkouts = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError("");

        const data = await getWorkouts(token);

        setWorkouts(data.workouts || []);
      } catch (err) {
        console.error("Failed to load workouts:", err);
        setError(err.message || "Failed to load workouts.");
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, [token]);

  const workout = workouts[selected];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MemberSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:pl-72">
        <MemberHeader onMenu={() => setMobileOpen(true)} />

        <main className="mx-auto max-w-[1600px] px-5 py-7 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Training
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Your Workouts
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Follow your structured training plan and record every session.
            </p>
          </div>

          {loading && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-10 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />

              <p className="text-sm text-gray-500">
                Loading workouts...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-6">
              <p className="text-sm font-semibold text-red-400">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && workouts.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-10 text-center">
              <Dumbbell
                size={32}
                className="mx-auto mb-4 text-gray-600"
              />

              <p className="font-semibold">
                No workouts available
              </p>

              <p className="mt-2 text-sm text-gray-600">
                There are no active workouts in the database yet.
              </p>
            </div>
          )}

          {!loading && !error && workouts.length > 0 && workout && (
            <div className="grid gap-6 xl:grid-cols-3">
              <section className="space-y-4">
                {workouts.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelected(index);
                      setCompleted([]);
                    }}
                    className={`w-full rounded-2xl border p-5 text-left transition ${
                      selected === index
                        ? "border-orange-500/40 bg-orange-500/[0.07]"
                        : "border-white/10 bg-white/[0.025] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
                        <Dumbbell size={20} />
                      </div>

                      {selected === index && (
                        <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <h3 className="mt-5 font-bold">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-600">
                      {item.category || "General"} •{" "}
                      {item.difficulty || "All Levels"}
                    </p>

                    <div className="mt-5 flex gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {item.duration_minutes ?? 0} min
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Flame size={14} />
                        {item.calories_burned ?? 0} kcal
                      </span>
                    </div>
                  </button>
                ))}
              </section>

              <section className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/[0.025]">
                <div className="border-b border-white/10 p-6 sm:p-7">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                      <span className="rounded-full bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-500">
                        {workout.category || "General"}
                      </span>

                      <h3 className="mt-4 text-2xl font-black">
                        {workout.name}
                      </h3>

                      {workout.description && (
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                          {workout.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {workout.duration_minutes ?? 0} min
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Flame size={14} />
                          {workout.calories_burned ?? 0} kcal
                        </span>

                        <span>
                          {workout.difficulty || "All Levels"}
                        </span>
                      </div>
                    </div>

                    <button className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold hover:bg-orange-600">
                      <Play size={16} fill="currentColor" />
                      Start Workout
                    </button>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                      Exercises
                    </p>

                    <p className="text-xs text-gray-600">
                      {completed.length} completed
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-black/20 p-6 text-center">
                    <Dumbbell
                      size={28}
                      className="mx-auto mb-3 text-gray-700"
                    />

                    <p className="text-sm font-semibold text-gray-500">
                      Exercise details coming next
                    </p>

                    <p className="mt-2 text-xs text-gray-700">
                      Workout exercises will be loaded from PostgreSQL.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}