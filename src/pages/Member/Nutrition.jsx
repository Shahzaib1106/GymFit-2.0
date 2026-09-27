import {
  Apple,
  Droplets,
  Flame,
  Plus,
  Target,
  Utensils,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import MemberSidebar from "../../components/MemberSidebar.jsx";
import MemberHeader from "../../components/MemberHeader.jsx";

const initialMeals = [
  {
    id: 1,
    name: "Breakfast",
    calories: 480,
    protein: 32,
    carbs: 51,
    fats: 14,
    items: ["3 Eggs", "2 Toast", "Greek Yogurt"],
  },
  {
    id: 2,
    name: "Lunch",
    calories: 620,
    protein: 48,
    carbs: 62,
    fats: 18,
    items: ["Chicken Breast", "Rice", "Mixed Vegetables"],
  },
  {
    id: 3,
    name: "Snack",
    calories: 240,
    protein: 18,
    carbs: 24,
    fats: 8,
    items: ["Protein Shake", "Banana"],
  },
  {
    id: 4,
    name: "Dinner",
    calories: 500,
    protein: 42,
    carbs: 45,
    fats: 16,
    items: ["Grilled Chicken", "Sweet Potato", "Salad"],
  },
];

const targets = {
  calories: 2250,
  protein: 160,
  carbs: 250,
  fats: 70,
  water: 3,
};

export default function Nutrition() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [meals, setMeals] = useState(initialMeals);
  const [showAddMeal, setShowAddMeal] = useState(false);

  const [newMeal, setNewMeal] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    items: "",
  });

  const totals = useMemo(() => {
    return meals.reduce(
      (total, meal) => ({
        calories:
          total.calories + Number(meal.calories || 0),
        protein:
          total.protein + Number(meal.protein || 0),
        carbs:
          total.carbs + Number(meal.carbs || 0),
        fats:
          total.fats + Number(meal.fats || 0),
      }),
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      }
    );
  }, [meals]);

  const percentages = {
    calories: Math.min(
      100,
      Math.round(
        (totals.calories / targets.calories) * 100
      )
    ),
    protein: Math.min(
      100,
      Math.round(
        (totals.protein / targets.protein) * 100
      )
    ),
    carbs: Math.min(
      100,
      Math.round(
        (totals.carbs / targets.carbs) * 100
      )
    ),
    fats: Math.min(
      100,
      Math.round((totals.fats / targets.fats) * 100)
    ),
  };

  const overallProgress = Math.min(
    100,
    Math.round(
      (percentages.calories +
        percentages.protein +
        percentages.carbs +
        percentages.fats) /
        4
    )
  );

  const addMeal = (event) => {
    event.preventDefault();

    if (
      !newMeal.name.trim() ||
      !newMeal.calories ||
      !newMeal.protein ||
      !newMeal.carbs
    ) {
      return;
    }

    setMeals((currentMeals) => [
      ...currentMeals,
      {
        id: Date.now(),
        name: newMeal.name.trim(),
        calories: Number(newMeal.calories),
        protein: Number(newMeal.protein),
        carbs: Number(newMeal.carbs),
        fats: Number(newMeal.fats || 0),
        items: newMeal.items
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    ]);

    setNewMeal({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
      items: "",
    });

    setShowAddMeal(false);
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
                  Nutrition
                </p>

                <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                  Fuel Your Progress
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                  Track your daily meals, monitor your macros and
                  stay aligned with your nutrition targets.
                </p>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold text-gray-400">
                <Apple
                  size={16}
                  className="text-orange-500"
                />
                Daily Nutrition
              </div>
            </div>
          </section>

          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <NutritionCard
              icon={Flame}
              label="Calories"
              value={totals.calories.toLocaleString()}
              target={`${targets.calories.toLocaleString()} kcal`}
              progress={percentages.calories}
            />

            <NutritionCard
              icon={Target}
              label="Protein"
              value={`${totals.protein} g`}
              target={`${targets.protein} g`}
              progress={percentages.protein}
            />

            <NutritionCard
              icon={Apple}
              label="Carbohydrates"
              value={`${totals.carbs} g`}
              target={`${targets.carbs} g`}
              progress={percentages.carbs}
            />

            <NutritionCard
              icon={Droplets}
              label="Water"
              value="2.4 L"
              target={`${targets.water.toFixed(1)} L`}
              progress={80}
            />
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7 xl:col-span-2">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                    Today's meals
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Food Log
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddMeal(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-xs font-bold text-black transition hover:bg-orange-400"
                >
                  <Plus size={16} />
                  Add Meal
                </button>
              </div>

              <div className="mt-7 space-y-4">
                {meals.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
                    <Utensils
                      size={28}
                      className="mx-auto mb-3 text-gray-600"
                    />

                    <p className="text-sm font-semibold text-gray-400">
                      No meals logged yet
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                      Add your first meal to start tracking.
                    </p>
                  </div>
                ) : (
                  meals.map((meal) => (
                    <div
                      key={meal.id}
                      className="rounded-xl border border-white/5 bg-black/30 p-5 transition hover:border-orange-500/15"
                    >
                      <div className="flex flex-col justify-between gap-5 sm:flex-row">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
                              <Utensils size={17} />
                            </div>

                            <div>
                              <h4 className="font-bold">
                                {meal.name}
                              </h4>

                              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-700">
                                Meal
                              </p>
                            </div>
                          </div>

                          <p className="mt-3 text-xs leading-5 text-gray-600">
                            {meal.items.length > 0
                              ? meal.items.join(" • ")
                              : "No food items added"}
                          </p>
                        </div>

                        <div className="grid grid-cols-4 gap-4 sm:min-w-[300px]">
                          <MealStat
                            label="Calories"
                            value={meal.calories}
                            suffix=""
                          />

                          <MealStat
                            label="Protein"
                            value={meal.protein}
                            suffix="g"
                          />

                          <MealStat
                            label="Carbs"
                            value={meal.carbs}
                            suffix="g"
                          />

                          <MealStat
                            label="Fats"
                            value={meal.fats}
                            suffix="g"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                Daily targets
              </p>

              <h3 className="mt-2 text-xl font-black">
                Nutrition Balance
              </h3>

              <div className="mt-8 flex justify-center">
                <div
                  className="relative flex h-48 w-48 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(rgb(249 115 22) ${overallProgress * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                  }}
                >
                  <div className="absolute inset-3 flex items-center justify-center rounded-full bg-[#0a0a0a]">
                    <div className="text-center">
                      <p className="text-3xl font-black">
                        {overallProgress}%
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        daily target
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-5">
                <Macro
                  label="Protein"
                  value={percentages.protein}
                  current={`${totals.protein}g`}
                  target={`${targets.protein}g`}
                />

                <Macro
                  label="Carbs"
                  value={percentages.carbs}
                  current={`${totals.carbs}g`}
                  target={`${targets.carbs}g`}
                />

                <Macro
                  label="Fats"
                  value={percentages.fats}
                  current={`${totals.fats}g`}
                  target={`${targets.fats}g`}
                />
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                  Nutrition Summary
                </p>

                <h3 className="mt-2 text-xl font-black">
                  Today's intake
                </h3>
              </div>

              <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-xs">
                <span className="text-gray-500">
                  Daily completion
                </span>

                <span className="ml-2 font-bold text-orange-400">
                  {overallProgress}%
                </span>
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                label="Calories"
                value={`${totals.calories.toLocaleString()} kcal`}
                target={`${targets.calories.toLocaleString()} kcal`}
                icon={Flame}
              />

              <SummaryCard
                label="Protein"
                value={`${totals.protein} g`}
                target={`${targets.protein} g`}
                icon={Target}
              />

              <SummaryCard
                label="Carbs"
                value={`${totals.carbs} g`}
                target={`${targets.carbs} g`}
                icon={Apple}
              />

              <SummaryCard
                label="Water"
                value="2.4 L"
                target="3.0 L"
                icon={Droplets}
              />
            </div>
          </section>
        </main>
      </div>

      {showAddMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c0c0c] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                  Nutrition
                </p>

                <h3 className="mt-1 text-xl font-black">
                  Add Meal
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowAddMeal(false)}
                className="rounded-xl border border-white/10 p-2 text-gray-500 transition hover:border-white/20 hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={addMeal}
              className="mt-6 space-y-4"
            >
              <Input
                label="Meal Name"
                value={newMeal.name}
                onChange={(value) =>
                  setNewMeal((current) => ({
                    ...current,
                    name: value,
                  }))
                }
                placeholder="e.g. Breakfast"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Calories"
                  type="number"
                  value={newMeal.calories}
                  onChange={(value) =>
                    setNewMeal((current) => ({
                      ...current,
                      calories: value,
                    }))
                  }
                  placeholder="500"
                />

                <Input
                  label="Protein (g)"
                  type="number"
                  value={newMeal.protein}
                  onChange={(value) =>
                    setNewMeal((current) => ({
                      ...current,
                      protein: value,
                    }))
                  }
                  placeholder="35"
                />

                <Input
                  label="Carbs (g)"
                  type="number"
                  value={newMeal.carbs}
                  onChange={(value) =>
                    setNewMeal((current) => ({
                      ...current,
                      carbs: value,
                    }))
                  }
                  placeholder="50"
                />

                <Input
                  label="Fats (g)"
                  type="number"
                  value={newMeal.fats}
                  onChange={(value) =>
                    setNewMeal((current) => ({
                      ...current,
                      fats: value,
                    }))
                  }
                  placeholder="15"
                />
              </div>

              <Input
                label="Food Items"
                value={newMeal.items}
                onChange={(value) =>
                  setNewMeal((current) => ({
                    ...current,
                    items: value,
                  }))
                }
                placeholder="Chicken, Rice, Salad"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-orange-500 px-5 py-3.5 text-xs font-black text-black transition hover:bg-orange-400"
              >
                Add Meal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function NutritionCard({
  icon: Icon,
  label,
  value,
  target,
  progress,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-orange-500/20">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </p>

        <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
          <Icon size={17} />
        </div>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <span className="text-2xl font-black">
          {value}
        </span>

        <span className="mb-1 text-xs text-gray-700">
          / {target}
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-500"
          style={{
            width: `${Math.min(100, progress)}%`,
          }}
        />
      </div>

      <p className="mt-2 text-right text-[10px] text-gray-600">
        {progress}% complete
      </p>
    </div>
  );
}

function MealStat({
  label,
  value,
  suffix,
}) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-wider text-gray-700">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-gray-300">
        {value}
        {suffix}
      </p>
    </div>
  );
}

function Macro({
  label,
  value,
  current,
  target,
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">
          {label}
        </span>

        <span className="font-semibold text-gray-400">
          {current} / {target}
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-500"
          style={{
            width: `${Math.min(100, value)}%`,
          }}
        />
      </div>

      <p className="mt-1 text-right text-[10px] text-gray-700">
        {value}% complete
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  target,
  icon: Icon,
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 p-4">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
          <Icon size={15} />
        </div>

        <p className="text-xs font-semibold text-gray-500">
          {label}
        </p>
      </div>

      <p className="mt-4 text-lg font-black">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-gray-700">
        Target: {target}
      </p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-600">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-orange-500/40"
      />
    </label>
  );
}