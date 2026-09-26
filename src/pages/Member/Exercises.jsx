
import { useEffect, useState } from "react";

import {
  Dumbbell,
  Play,
  Search,
  Target,
} from "lucide-react";

import MemberSidebar from "../../components/MemberSidebar";
import MemberHeader from "../../components/MemberHeader";
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
    if (!token) return;

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

  const categories = [
    ...new Set(
      exercises
        .map((exercise) => exercise.category)
        .filter(Boolean)
    ),
  ];

  const getDifficultyClasses = (level) => {
    if (level === "Beginner") {
      return "bg-green-500/10 text-green-400";
    }

    if (level === "Intermediate") {
      return "bg-yellow-500/10 text-yellow-400";
    }

    return "bg-red-500/10 text-red-400";
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

      <div className="lg:pl-72">
        <MemberHeader
          onMenu={() => setMobileOpen(true)}
        />

        <main className="mx-auto max-w-[1600px] px-5 py-7 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Exercise Library
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Exercises
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Explore exercises by muscle group, category and difficulty.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-7 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <div className="grid gap-3 md:grid-cols-3">
              {/* Search */}
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

              {/* Difficulty */}
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

              {/* Category */}
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
          </div>

          {/* Count */}
          {!loading && !error && (
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-bold text-white">
                  {exercises.length}
                </span>{" "}
                exercises
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />

              <p className="text-sm text-gray-500">
                Loading exercise library...
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
            exercises.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-12 text-center">
                <Dumbbell
                  size={32}
                  className="mx-auto mb-4 text-gray-600"
                />

                <p className="font-semibold">
                  No exercises found
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Try another search or filter.
                </p>
              </div>
            )}

          {/* Exercise Grid */}
          {!loading &&
            !error &&
            exercises.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {exercises.map((exercise) => (
                  <article
                    key={exercise.id}
                    className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-orange-500/20 hover:bg-white/[0.04]"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
                        <Dumbbell size={20} />
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${getDifficultyClasses(
                          exercise.difficulty
                        )}`}
                      >
                        {exercise.difficulty || "All Levels"}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="mt-5 text-lg font-black">
                      {exercise.name}
                    </h3>

                    <p className="mt-1 text-xs text-orange-500">
                      {exercise.category || "General"}
                    </p>

                    {/* Muscle Group */}
                    <div className="mt-5 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Target size={14} />

                        {exercise.muscle_group ||
                          "Full Body"}
                      </span>
                    </div>

                    {/* Instructions */}
                    {exercise.instructions && (
                      <p className="mt-4 line-clamp-3 text-xs leading-5 text-gray-600">
                        {exercise.instructions}
                      </p>
                    )}

                    {/* Video */}
                    {exercise.video_url && (
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
                    )}
                  </article>
                ))}
              </div>
            )}
        </main>
      </div>
    </div>
  );
}