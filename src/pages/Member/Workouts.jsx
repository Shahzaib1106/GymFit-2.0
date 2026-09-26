
import { useEffect, useMemo, useState } from "react";

import {
  Check,
  Clock,
  Dumbbell,
  Flame,
  Play,
  RotateCcw,
  Timer,
} from "lucide-react";

import MemberSidebar from "../../components/MemberSidebar";
import MemberHeader from "../../components/MemberHeader";
import { useAuth } from "../../context/useAuth.jsx";
import {
  getWorkouts,
  getWorkoutById,
} from "../../services/memberService.js";

export default function Workouts() {
  const { token } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [workouts, setWorkouts] = useState([]);
  const [selected, setSelected] = useState(0);

  const [workoutDetails, setWorkoutDetails] = useState(null);

  const [completed, setCompleted] = useState([]);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

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

  useEffect(() => {
    const loadWorkoutDetails = async () => {
      if (!token || !workouts[selected]) return;

      try {
        setDetailsLoading(true);
        setCompleted([]);

        const data = await getWorkoutById(
          token,
          workouts[selected].id
        );

        setWorkoutDetails(data.workout);
      } catch (err) {
        console.error(
          "Failed to load workout details:",
          err
        );

        setWorkoutDetails(null);
      } finally {
        setDetailsLoading(false);
      }
    };

    loadWorkoutDetails();
  }, [token, selected, workouts]);

  const exercises = workoutDetails?.exercises || [];

  const completionPercentage = useMemo(() => {
    if (!exercises.length) return 0;

    return Math.round(
      (completed.length / exercises.length) * 100
    );
  }, [completed, exercises]);

  const toggleExercise = (exerciseId) => {
    setCompleted((previous) =>
      previous.includes(exerciseId)
        ? previous.filter((id) => id !== exerciseId)
        : [...previous, exerciseId]
    );
  };

  const resetWorkout = () => {
    setCompleted([]);
  };

  const formatRest = (seconds) => {
    if (!seconds) return "—";

    if (seconds < 60) {
      return `${seconds}s`;
    }

    return `${Math.floor(seconds / 60)}m`;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return null;

    if (seconds < 60) {
      return `${seconds}s`;
    }

    return `${Math.floor(seconds / 60)}m`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MemberSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:pl-72">
        <MemberHeader
          onMenu={() => setMobileOpen(true)}
        />

        <main className="mx-auto max-w-[1600px] px-5 py-7 lg:px-8">

          {/* HEADER */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Training
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Your Workouts
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Choose a workout and follow every exercise step by step.
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-10 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />

              <p className="text-sm text-gray-500">
                Loading workouts...
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-6">
              <p className="text-sm font-semibold text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            !error &&
            workouts.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-10 text-center">
                <Dumbbell
                  size={32}
                  className="mx-auto mb-4 text-gray-600"
                />

                <p className="font-semibold">
                  No workouts available
                </p>
              </div>
            )}

          {/* WORKOUTS */}
          {!loading &&
            !error &&
            workouts.length > 0 &&
            workoutDetails && (
              <div className="grid gap-6 xl:grid-cols-3">

                {/* LEFT */}
                <section className="space-y-4">

                  {workouts.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setSelected(index)}
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
                          <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold text-black">
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

                {/* RIGHT */}
                <section className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/[0.025]">

                  {/* WORKOUT HEADER */}
                  <div className="border-b border-white/10 p-6 sm:p-7">

                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">

                      <div>
                        <span className="rounded-full bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-500">
                          {workoutDetails.category || "General"}
                        </span>

                        <h3 className="mt-4 text-2xl font-black">
                          {workoutDetails.name}
                        </h3>

                        {workoutDetails.description && (
                          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                            {workoutDetails.description}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">

                          <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {workoutDetails.duration_minutes} min
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Flame size={14} />
                            {workoutDetails.calories_burned} kcal
                          </span>

                          <span>
                            {workoutDetails.difficulty}
                          </span>

                        </div>
                      </div>

                      <button
                        onClick={resetWorkout}
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-gray-400 transition hover:bg-white/5 hover:text-white"
                      >
                        <RotateCcw size={16} />
                        Reset
                      </button>

                    </div>

                    {/* PROGRESS */}
                    <div className="mt-7">

                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          Workout Progress
                        </span>

                        <span className="font-bold text-orange-500">
                          {completionPercentage}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-orange-500 transition-all duration-300"
                          style={{
                            width: `${completionPercentage}%`,
                          }}
                        />
                      </div>

                    </div>
                  </div>

                  {/* EXERCISES */}
                  <div className="p-6 sm:p-7">

                    <div className="mb-5 flex items-center justify-between">

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                          Exercises
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {exercises.length} exercises
                        </p>
                      </div>

                      <p className="text-xs text-gray-600">
                        {completed.length}/{exercises.length} completed
                      </p>

                    </div>

                    {detailsLoading ? (
                      <div className="py-12 text-center">
                        <div className="mx-auto mb-4 h-7 w-7 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />

                        <p className="text-sm text-gray-500">
                          Loading exercises...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">

                        {exercises.map((exercise, index) => {
                          const isCompleted =
                            completed.includes(
                              exercise.exercise_id
                            );

                          return (
                            <div
                              key={exercise.workout_exercise_id}
                              className={`rounded-2xl border p-5 transition ${
                                isCompleted
                                  ? "border-green-500/20 bg-green-500/[0.04]"
                                  : "border-white/10 bg-black/20"
                              }`}
                            >

                              <div className="flex gap-4">

                                {/* NUMBER */}
                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                                    isCompleted
                                      ? "bg-green-500 text-black"
                                      : "bg-orange-500/10 text-orange-500"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <Check size={18} />
                                  ) : (
                                    index + 1
                                  )}
                                </div>

                                {/* CONTENT */}
                                <div className="min-w-0 flex-1">

                                  <div className="flex flex-col justify-between gap-3 sm:flex-row">

                                    <div>
                                      <h4 className="font-bold">
                                        {exercise.name}
                                      </h4>

                                      <p className="mt-1 text-xs text-gray-600">
                                        {exercise.muscle_group || "Full Body"}
                                      </p>
                                    </div>

                                    <span className="self-start rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase text-gray-500">
                                      {exercise.difficulty}
                                    </span>

                                  </div>

                                  {/* STATS */}
                                  <div className="mt-4 flex flex-wrap gap-3">

                                    <div className="rounded-lg bg-white/5 px-3 py-2">
                                      <p className="text-[9px] uppercase text-gray-600">
                                        Sets
                                      </p>

                                      <p className="mt-1 text-sm font-bold">
                                        {exercise.sets ?? "—"}
                                      </p>
                                    </div>

                                    <div className="rounded-lg bg-white/5 px-3 py-2">
                                      <p className="text-[9px] uppercase text-gray-600">
                                        Reps
                                      </p>

                                      <p className="mt-1 text-sm font-bold">
                                        {exercise.repetitions ?? "—"}
                                      </p>
                                    </div>

                                    {exercise.duration_seconds && (
                                      <div className="rounded-lg bg-white/5 px-3 py-2">
                                        <p className="text-[9px] uppercase text-gray-600">
                                          Duration
                                        </p>

                                        <p className="mt-1 flex items-center gap-1 text-sm font-bold">
                                          <Timer size={13} />
                                          {formatDuration(
                                            exercise.duration_seconds
                                          )}
                                        </p>
                                      </div>
                                    )}

                                    <div className="rounded-lg bg-white/5 px-3 py-2">
                                      <p className="text-[9px] uppercase text-gray-600">
                                        Rest
                                      </p>

                                      <p className="mt-1 text-sm font-bold">
                                        {formatRest(
                                          exercise.rest_seconds
                                        )}
                                      </p>
                                    </div>

                                  </div>

                                  {/* INSTRUCTIONS */}
                                  {exercise.instructions && (
                                    <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-orange-500">
                                        How to perform
                                      </p>

                                      <p className="text-xs leading-5 text-gray-500">
                                        {exercise.instructions}
                                      </p>
                                    </div>
                                  )}

                                  {/* ACTIONS */}
                                  <div className="mt-4 flex flex-wrap gap-3">

                                    <button
                                      onClick={() =>
                                        toggleExercise(
                                          exercise.exercise_id
                                        )
                                      }
                                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                                        isCompleted
                                          ? "bg-green-500 text-black"
                                          : "bg-white/5 text-gray-300 hover:bg-white/10"
                                      }`}
                                    >
                                      <Check size={14} />
                                      {isCompleted
                                        ? "Completed"
                                        : "Mark Complete"}
                                    </button>

                                    {exercise.video_url && (
                                      <button
                                        onClick={() =>
                                          window.open(
                                            exercise.video_url,
                                            "_blank",
                                            "noopener,noreferrer"
                                          )
                                        }
                                        className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-black transition hover:bg-orange-400"
                                      >
                                        <Play
                                          size={14}
                                          fill="currentColor"
                                        />
                                        Watch Demo
                                      </button>
                                    )}

                                  </div>

                                </div>
                              </div>
                            </div>
                          );
                        })}

                      </div>
                    )}

                  </div>
                </section>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}

