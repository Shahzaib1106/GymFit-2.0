import {
  Dumbbell,
  Filter,
  Play,
  Search,
  Target,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import MemberSidebar from "../../components/MemberSidebar.jsx";
import MemberHeader from "../../components/MemberHeader.jsx";
import { useAuth } from "../../context/useAuth.jsx";
import { getExercises } from "../../services/memberService.js";

export default function Exercises() {
  const { token } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExercises = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getExercises(token, {
        search,
        difficulty,
        category,
      });

      setExercises(data.exercises || []);
    } catch (err) {
      console.error("Failed to load exercises:", err);
      setError(err.message || "Failed to load exercises.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadExercises();
    }, 300);

    return () => clearTimeout(timer);
  }, [token, search, difficulty, category]);

  const categories = useMemo(
    () => [
      ...new Set(
        exercises
          .map((exercise) => exercise.category)
          .filter(Boolean)
      ),
    ],
    [exercises]
  );

  const clearFilters = () => {
    setSearch("");
    setDifficulty("");
    setCategory("");
  };

  const hasFilters =
    search.trim() || difficulty || category;

  const getDifficultyClasses = (level) => {
    if (level === "Beginner") {
      return "bg-green-500/10 text-green-400 border-green-500/10";
    }

    if (level === "Intermediate") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/10";
    }

    if (level === "Advanced") {
      return "bg-red-500/10 text-red-400 border-red-500/10";
    }

    return "bg-white/5 text-gray-400 border-white/10";
  };

  const handleWatchDemo = (url) => {
    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MemberSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:ml-64">
        <MemberHeader
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="mx-auto max-w-[1600px] p-5 sm:p-6 lg:p-8">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500/15 via-[#111111] to-[#080808] p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                  Exercise Library
                </p>

                <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                  Find Your Exercise
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                  Explore exercises by category, target muscle
                  group and difficulty level.
                </p>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold text-gray-400">
                <Dumbbell
                  size={16}
                  className="text-orange-500"
                />

                {exercises.length} exercises
              </div>
            </div>
          </section>

          <section className="mt-7 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter
                  size={16}
                  className="text-orange-500"
                />

                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Filters
                </p>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-orange-500"
                >
                  <X size={14} />
                  Clear filters
                </button>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search exercises..."
                  className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-orange-500/40"
                />
              </div>

              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(event.target.value)
                }
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-300 outline-none focus:border-orange-500/40"
              >
                <option value="">
                  All Difficulties
                </option>

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

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-300 outline-none focus:border-orange-500/40"
              >
                <option value="">
                  All Categories
                </option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {!loading && !error && (
            <div className="mb-5 mt-7 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-bold text-white">
                    {exercises.length}
                  </span>{" "}
                  exercises
                </p>

                {hasFilters && (
                  <p className="mt-1 text-xs text-gray-700">
                    Filtered results
                  </p>
                )}
              </div>
            </div>
          )}

          {loading && (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />

              <p className="text-sm text-gray-500">
                Loading exercise library...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-6">
              <p className="text-sm font-semibold text-red-400">
                Exercise Library Error
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {error}
              </p>

              <button
                type="button"
                onClick={loadExercises}
                className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-xs font-bold text-black transition hover:bg-orange-400"
              >
                Retry
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            exercises.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.025] p-12 text-center">
                <Dumbbell
                  size={34}
                  className="mx-auto mb-4 text-gray-600"
                />

                <p className="font-semibold">
                  No exercises found
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Try another search or change your filters.
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-xl border border-white/10 px-5 py-3 text-xs font-bold text-gray-400 transition hover:border-orange-500/30 hover:text-orange-500"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

          {!loading &&
            !error &&
            exercises.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {exercises.map((exercise) => (
                  <article
                    key={exercise.id}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition duration-300 hover:-translate-y-1 hover:border-orange-500/25 hover:bg-white/[0.04]"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                          <Dumbbell size={20} />
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${getDifficultyClasses(
                            exercise.difficulty
                          )}`}
                        >
                          {exercise.difficulty ||
                            "All Levels"}
                        </span>
                      </div>

                      <h3 className="mt-5 text-lg font-black">
                        {exercise.name}
                      </h3>

                      <p className="mt-1 text-xs font-semibold text-orange-500">
                        {exercise.category ||
                          "General Training"}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                          <p className="text-[10px] uppercase tracking-wider text-gray-600">
                            Target
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <Target
                              size={14}
                              className="text-orange-500"
                            />

                            <p className="truncate text-xs font-semibold text-gray-300">
                              {exercise.muscle_group ||
                                "Full Body"}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                          <p className="text-[10px] uppercase tracking-wider text-gray-600">
                            Level
                          </p>

                          <p className="mt-2 truncate text-xs font-semibold text-gray-300">
                            {exercise.difficulty ||
                              "All Levels"}
                          </p>
                        </div>
                      </div>

                      {exercise.instructions && (
                        <div className="mt-5">
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-700">
                            Instructions
                          </p>

                          <p className="line-clamp-4 text-xs leading-5 text-gray-500">
                            {exercise.instructions}
                          </p>
                        </div>
                      )}

                      {exercise.video_url ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleWatchDemo(
                              exercise.video_url
                            )
                          }
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-xs font-bold text-black transition hover:bg-orange-400"
                        >
                          <Play
                            size={15}
                            fill="currentColor"
                          />

                          Watch Exercise Demo
                        </button>
                      ) : (
                        <div className="mt-5 flex w-full items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-xs font-semibold text-gray-700">
                          Demo unavailable
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
        </main>
      </div>
    </div>
  );
}