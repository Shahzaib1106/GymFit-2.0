import { useState } from "react";

import {
  Check,
  Clock,
  Dumbbell,
  Flame,
  Play,
} from "lucide-react";

import MemberSidebar from "../../components/MemberSidebar";
import MemberHeader from "../../components/MemberHeader";
const workouts = [
  {
    title: "Upper Body Strength",
    category: "Strength",
    duration: "52 min",
    calories: "420 kcal",
    level: "Intermediate",
    exercises: [
      ["Bench Press", "4 × 10", "70 kg"],
      ["Lat Pulldown", "4 × 12", "55 kg"],
      ["Shoulder Press", "3 × 10", "25 kg"],
      ["Cable Row", "3 × 12", "50 kg"],
      ["Bicep Curl", "3 × 12", "12 kg"],
    ],
  },
  {
    title: "Lower Body Power",
    category: "Strength",
    duration: "58 min",
    calories: "510 kcal",
    level: "Intermediate",
    exercises: [
      ["Barbell Squat", "4 × 8", "90 kg"],
      ["Romanian Deadlift", "4 × 10", "70 kg"],
      ["Leg Press", "3 × 12", "150 kg"],
      ["Leg Curl", "3 × 12", "45 kg"],
      ["Calf Raise", "4 × 15", "60 kg"],
    ],
  },
  {
    title: "Push & Core",
    category: "Hypertrophy",
    duration: "45 min",
    calories: "380 kcal",
    level: "Intermediate",
    exercises: [
      ["Incline Press", "4 × 10", "55 kg"],
      ["Chest Fly", "3 × 12", "45 kg"],
      ["Lateral Raise", "4 × 15", "10 kg"],
      ["Tricep Pushdown", "3 × 12", "35 kg"],
      ["Plank", "3 × 60 sec", "Bodyweight"],
    ],
  },
];

export default function Workouts() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [completed, setCompleted] = useState([]);

  const workout = workouts[selected];

  const toggleExercise = (name) => {
    setCompleted((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

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

          <div className="grid gap-6 xl:grid-cols-3">
            <section className="space-y-4">
              {workouts.map((item, index) => (
                <button
                  key={item.title}
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
                      <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 font-bold">{item.title}</h3>

                  <p className="mt-1 text-xs text-gray-600">
                    {item.category} • {item.level}
                  </p>

                  <div className="mt-5 flex gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {item.duration}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Flame size={14} />
                      {item.calories}
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
                      {workout.category}
                    </span>

                    <h3 className="mt-4 text-2xl font-black">
                      {workout.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {workout.duration}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Flame size={14} />
                        {workout.calories}
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
                    {completed.length}/{workout.exercises.length} completed
                  </p>
                </div>

                <div className="space-y-3">
                  {workout.exercises.map(([name, sets, weight], index) => {
                    const done = completed.includes(name);

                    return (
                      <button
                        key={name}
                        onClick={() => toggleExercise(name)}
                        className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                          done
                            ? "border-green-500/20 bg-green-500/[0.05]"
                            : "border-white/5 bg-black/30 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                            done
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-white/10 text-gray-700"
                          }`}
                        >
                          {done ? <Check size={17} /> : index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-bold ${
                              done ? "text-green-400" : ""
                            }`}
                          >
                            {name}
                          </p>

                          <p className="mt-1 text-xs text-gray-600">
                            {sets}
                          </p>
                        </div>

                        <span className="text-xs font-semibold text-gray-500">
                          {weight}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all"
                    style={{
                      width: `${
                        (completed.length / workout.exercises.length) * 100
                      }%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-center text-xs text-gray-600">
                  Complete all exercises to finish this workout.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}