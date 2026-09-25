import { useState } from "react";
import { Search, Dumbbell, PlayCircle, Filter } from "lucide-react";

import MemberSidebar from "../../components/MemberSidebar";
import MemberHeader from "../../components/MemberHeader";

const exercises = [
  {
    name: "Barbell Bench Press",
    muscle: "Chest",
    equipment: "Barbell",
    level: "Intermediate",
  },
  {
    name: "Barbell Squat",
    muscle: "Legs",
    equipment: "Barbell",
    level: "Intermediate",
  },
  {
    name: "Deadlift",
    muscle: "Back",
    equipment: "Barbell",
    level: "Advanced",
  },
  {
    name: "Lat Pulldown",
    muscle: "Back",
    equipment: "Cable",
    level: "Beginner",
  },
  {
    name: "Shoulder Press",
    muscle: "Shoulders",
    equipment: "Dumbbell",
    level: "Beginner",
  },
  {
    name: "Bicep Curl",
    muscle: "Biceps",
    equipment: "Dumbbell",
    level: "Beginner",
  },
  {
    name: "Tricep Pushdown",
    muscle: "Triceps",
    equipment: "Cable",
    level: "Beginner",
  },
  {
    name: "Leg Press",
    muscle: "Legs",
    equipment: "Machine",
    level: "Beginner",
  },
  {
    name: "Romanian Deadlift",
    muscle: "Hamstrings",
    equipment: "Barbell",
    level: "Intermediate",
  },
];

export default function Exercises() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [muscle, setMuscle] = useState("All");

  const muscles = ["All", ...new Set(exercises.map((item) => item.muscle))];

  const filtered = exercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesMuscle =
      muscle === "All" || exercise.muscle === muscle;

    return matchesSearch && matchesMuscle;
  });

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
              Exercise Library
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Explore Exercises
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Find exercises by muscle group, equipment and difficulty.
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exercises..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.025] py-4 pl-11 pr-4 text-sm outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter size={17} className="shrink-0 text-gray-600" />

              {muscles.map((item) => (
                <button
                  key={item}
                  onClick={() => setMuscle(item)}
                  className={`whitespace-nowrap rounded-xl px-4 py-3 text-xs font-bold transition ${
                    muscle === item
                      ? "bg-orange-500 text-white"
                      : "border border-white/10 bg-white/[0.025] text-gray-500 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((exercise) => (
              <div
                key={exercise.name}
                className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-orange-500/20"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
                    <Dumbbell size={21} />
                  </div>

                  <button className="rounded-xl border border-white/10 p-2.5 text-gray-600 transition hover:bg-orange-500 hover:text-white">
                    <PlayCircle size={18} />
                  </button>
                </div>

                <h3 className="mt-6 font-bold">{exercise.name}</h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
                    {exercise.muscle}
                  </span>

                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
                    {exercise.equipment}
                  </span>

                  <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-[10px] font-semibold text-orange-500">
                    {exercise.level}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-12 text-center">
              <p className="font-bold">No exercises found.</p>
              <p className="mt-2 text-sm text-gray-600">
                Try another search or muscle group.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}