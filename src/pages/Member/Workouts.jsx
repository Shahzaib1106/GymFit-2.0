
import { useEffect, useState } from "react";

import {
  Check,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Play,
  RotateCcw,
  Target,
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
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    const loadWorkouts = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getWorkouts(token);

        setWorkouts(data.workouts || []);
      } catch (err) {
        console.error("Failed to load workouts:", err);
        setError(
          err.message || "Failed to load workouts."
        );
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, [token]);

  useEffect(() => {
    const loadDetails = async () => {
      if (
        !token ||
        workouts.length === 0 ||
        !workouts[selected]
      ) {
        return;
      }

      try {
        setDetailsLoading(true);
        setDetailsError("");
        setWorkoutDetails(null);

        const data = await getWorkoutById(
          token,
          workouts[selected].id
        );

        setWorkoutDetails(data.workout || null);
        setCurrentExercise(0);
        setCompleted([]);
      } catch (err) {
        console.error(
          "Failed to load workout details:",
          err
        );

        setDetailsError(
          err.message ||
            "Failed to load workout details."
        );
      } finally {
        setDetailsLoading(false);
      }
    };

    loadDetails();
  }, [workouts, selected, token]);

  const selectWorkout = (index) => {
    setSelected(index);
  };

  const toggleExercise = (exerciseId) => {
    setCompleted((previous) =>
      previous.includes(exerciseId)
        ? previous.filter(
            (id) => id !== exerciseId
          )
        : [...previous, exerciseId]
    );
  };

  const resetWorkout = () => {
    setCompleted([]);
    setCurrentExercise(0);
  };

  const goNext = () => {
    if (!workoutDetails?.exercises?.length) {
      return;
    }

    if (
      currentExercise <
      workoutDetails.exercises.length - 1
    ) {
      setCurrentExercise(
        (previous) => previous + 1
      );
    }
  };

  const goPrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(
        (previous) => previous - 1
      );
    }
  };

  const handleWatchDemo = (url) => {
    if (!url) {
      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const workout = workoutDetails;
  const exercises = workout?.exercises || [];
  const exercise = exercises[currentExercise];

  const progress =
    exercises.length > 0
      ? Math.round(
          (completed.length / exercises.length) * 100
        )
      : 0;

  const exerciseCompleted = exercise
    ? completed.includes(exercise.exercise_id)
    : false;

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
          {/* Page Header */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Training
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Your Workouts
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Choose a workout and follow every
              exercise step by step.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-12 text-center">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />

              <p className="text-sm text-gray-500">
                Loading workouts...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-6">
              <p className="text-sm font-semibold text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            workouts.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-12 text-center">
                <Dumbbell
                  size={34}
                  className="mx-auto mb-4 text-gray-600"
                />

                <p className="font-semibold">
                  No workouts available
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  There are no active workouts in
                  the database.
                </p>
              </div>
            )}

          {/* Main Workout Area */}
          {!loading &&
            !error &&
            workouts.length > 0 && (
              <div className="grid gap-6 xl:grid-cols-3">
                {/* Workout Plans */}
                <section className="space-y-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                      Workout Plans
                    </p>

                    <span className="text-xs text-gray-600">
                      {workouts.length} plans
                    </span>
                  </div>

                  {workouts.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        selectWorkout(index)
                      }
                      className={`w-full rounded-2xl border p-5 text-left transition ${
                        selected === index
                          ? "border-orange-500/40 bg-orange-500/[0.07]"
                          : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`rounded-xl p-3 ${
                            selected === index
                              ? "bg-orange-500/15 text-orange-500"
                              : "bg-white/5 text-gray-500"
                          }`}
                        >
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
                        {item.category ||
                          "General"}{" "}
                        •{" "}
                        {item.difficulty ||
                          "All Levels"}
                      </p>

                      <div className="mt-5 flex gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {item.duration_minutes ??
                            0}{" "}
                          min
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Flame size={14} />
                          {item.calories_burned ??
                            0}{" "}
                          kcal
                        </span>
                      </div>
                    </button>
                  ))}
                </section>

                {/* Workout Details */}
                <section className="xl:col-span-2">
                  {detailsLoading && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-12 text-center">
                      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />

                      <p className="text-sm text-gray-500">
                        Loading workout details...
                      </p>
                    </div>
                  )}

                  {!detailsLoading &&
                    detailsError && (
                      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-6">
                        <p className="text-sm font-semibold text-red-400">
                          {detailsError}
                        </p>
                      </div>
                    )}

                  {!detailsLoading &&
                    !detailsError &&
                    workout && (
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
                        {/* Workout Header */}
                        <div className="border-b border-white/10 p-6 sm:p-7">
                          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                            <div>
                              <span className="rounded-full bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-500">
                                {workout.category ||
                                  "General"}
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
                                  {workout.duration_minutes ??
                                    0}{" "}
                                  min
                                </span>

                                <span className="flex items-center gap-1.5">
                                  <Flame size={14} />
                                  {workout.calories_burned ??
                                    0}{" "}
                                  kcal
                                </span>

                                <span className="flex items-center gap-1.5">
                                  <Dumbbell size={14} />
                                  {exercises.length}{" "}
                                  exercises
                                </span>

                                <span>
                                  {workout.difficulty ||
                                    "All Levels"}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={resetWorkout}
                              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-gray-400 transition hover:border-orange-500/30 hover:text-orange-500"
                            >
                              <RotateCcw size={15} />
                              Reset
                            </button>
                          </div>

                          {/* Progress */}
                          <div className="mt-7">
                            <div className="mb-2 flex items-center justify-between text-xs">
                              <span className="font-semibold text-gray-500">
                                Workout Progress
                              </span>

                              <span className="font-bold text-orange-500">
                                {progress}%
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-white/5">
                              <div
                                className="h-full rounded-full bg-orange-500 transition-all duration-300"
                                style={{
                                  width: `${progress}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Exercise */}
                        {exercise ? (
                          <div className="p-6 sm:p-7">
                            <div className="mb-6 flex items-center justify-between">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                                  Exercise{" "}
                                  {currentExercise +
                                    1}{" "}
                                  of{" "}
                                  {exercises.length}
                                </p>

                                <h4 className="mt-2 text-xl font-black">
                                  {exercise.name}
                                </h4>
                              </div>

                              {exerciseCompleted && (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                                  <Check size={20} />
                                </div>
                              )}
                            </div>

                            {/* Exercise Stats */}
                            <div className="grid gap-3 sm:grid-cols-4">
                              <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                                  Sets
                                </p>

                                <p className="mt-2 text-lg font-black">
                                  {exercise.sets ?? "-"}
                                </p>
                              </div>

                              <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                                  Reps
                                </p>

                                <p className="mt-2 text-lg font-black">
                                  {exercise.repetitions ??
                                    "-"}
                                </p>
                              </div>

                              <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                                  Rest
                                </p>

                                <p className="mt-2 text-lg font-black">
                                  {exercise.rest_seconds
                                    ? `${exercise.rest_seconds}s`
                                    : "-"}
                                </p>
                              </div>

                              <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                                  Muscle
                                </p>

                                <p className="mt-2 truncate text-sm font-bold">
                                  {exercise.muscle_group ||
                                    "Full Body"}
                                </p>
                              </div>
                            </div>

                            {/* Instructions */}
                            {exercise.instructions && (
                              <div className="mt-6 rounded-xl border border-white/5 bg-black/20 p-5">
                                <div className="flex items-center gap-2">
                                  <Target
                                    size={16}
                                    className="text-orange-500"
                                  />

                                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Instructions
                                  </p>
                                </div>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                  {exercise.instructions}
                                </p>
                              </div>
                            )}

                            {/* Demo */}
                            {exercise.video_url && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleWatchDemo(
                                    exercise.video_url
                                  )
                                }
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
                              >
                                <Play
                                  size={17}
                                  fill="currentColor"
                                />
                                Watch Exercise Demo
                              </button>
                            )}

                            {/* Controls */}
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                              <button
                                type="button"
                                onClick={() =>
                                  toggleExercise(
                                    exercise.exercise_id
                                  )
                                }
                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                                  exerciseCompleted
                                    ? "bg-green-500/10 text-green-400 hover:bg-green-500/15"
                                    : "bg-white/10 text-white hover:bg-white/15"
                                }`}
                              >
                                <Check size={17} />

                                {exerciseCompleted
                                  ? "Exercise Completed"
                                  : "Mark as Complete"}
                              </button>

                              <button
                                type="button"
                                onClick={goPrevious}
                                disabled={
                                  currentExercise === 0
                                }
                                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-gray-400 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                Previous
                              </button>

                              <button
                                type="button"
                                onClick={goNext}
                                disabled={
                                  currentExercise ===
                                  exercises.length - 1
                                }
                                className="flex items-center justify-center gap-2 rounded-xl border border-orange-500/30 px-5 py-3 text-sm font-bold text-orange-500 transition hover:bg-orange-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                Next
                                <ChevronRight size={17} />
                              </button>
                            </div>

                            {/* Exercise Plan */}
                            <div className="mt-8">
                              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                                Exercise Plan
                              </p>

                              <div className="space-y-2">
                                {exercises.map(
                                  (item, index) => {
                                    const isDone =
                                      completed.includes(
                                        item.exercise_id
                                      );

                                    const isCurrent =
                                      index ===
                                      currentExercise;

                                    return (
                                      <button
                                        key={
                                          item.workout_exercise_id ||
                                          item.exercise_id
                                        }
                                        type="button"
                                        onClick={() =>
                                          setCurrentExercise(
                                            index
                                          )
                                        }
                                        className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                                          isCurrent
                                            ? "border-orange-500/30 bg-orange-500/[0.06]"
                                            : "border-white/5 bg-black/10 hover:bg-white/[0.03]"
                                        }`}
                                      >
                                        <div
                                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                            isDone
                                              ? "bg-green-500/10 text-green-400"
                                              : isCurrent
                                              ? "bg-orange-500 text-black"
                                              : "bg-white/5 text-gray-600"
                                          }`}
                                        >
                                          {isDone ? (
                                            <Check size={16} />
                                          ) : (
                                            index + 1
                                          )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                          <p className="truncate text-sm font-bold">
                                            {item.name}
                                          </p>

                                          <p className="mt-1 text-xs text-gray-600">
                                            {item.sets ?? "-"}{" "}
                                            sets ×{" "}
                                            {item.repetitions ??
                                              "-"}{" "}
                                            reps
                                          </p>
                                        </div>

                                        {isCurrent && (
                                          <span className="text-[10px] font-bold uppercase text-orange-500">
                                            Current
                                          </span>
                                        )}
                                      </button>
                                    );
                                  }
                                )}
                              </div>
                            </div>

                            {/* Completion */}
                            {progress === 100 && (
                              <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/[0.05] p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                                  <Check size={24} />
                                </div>

                                <h4 className="mt-4 font-black">
                                  Workout Completed
                                </h4>

                                <p className="mt-2 text-sm text-gray-500">
                                  Great work. You
                                  completed every
                                  exercise in this
                                  workout.
                                </p>

                                <button
                                  type="button"
                                  onClick={resetWorkout}
                                  className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-xs font-bold text-black hover:bg-orange-400"
                                >
                                  Start Again
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-12 text-center">
                            <Dumbbell
                              size={32}
                              className="mx-auto mb-4 text-gray-700"
                            />

                            <p className="text-sm font-semibold text-gray-500">
                              No exercises mapped
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                </section>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}
