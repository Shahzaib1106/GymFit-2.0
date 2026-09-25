import { Apple, Droplets, Flame, Plus, Target, Utensils } from "lucide-react";
import { useState } from "react";

import MemberSidebar from "../../components/MemberSidebar";
import MemberHeader from "../../components/MemberHeader";

const meals = [
  {
    name: "Breakfast",
    calories: 480,
    protein: 32,
    carbs: 51,
    fats: 14,
    items: ["3 Eggs", "2 Toast", "Greek Yogurt"],
  },
  {
    name: "Lunch",
    calories: 620,
    protein: 48,
    carbs: 62,
    fats: 18,
    items: ["Chicken Breast", "Rice", "Mixed Vegetables"],
  },
  {
    name: "Snack",
    calories: 240,
    protein: 18,
    carbs: 24,
    fats: 8,
    items: ["Protein Shake", "Banana"],
  },
  {
    name: "Dinner",
    calories: 500,
    protein: 42,
    carbs: 45,
    fats: 16,
    items: ["Grilled Chicken", "Sweet Potato", "Salad"],
  },
];

export default function Nutrition() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalCalories = meals.reduce(
    (sum, meal) => sum + meal.calories,
    0
  );

  const totalProtein = meals.reduce(
    (sum, meal) => sum + meal.protein,
    0
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MemberSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:pl-72">
        <MemberHeader onMenu={() => setMobileOpen(true)} />

        <main className="mx-auto max-w-[1600px] px-5 py-7 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Nutrition
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Fuel Your Progress
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Track your daily nutrition and stay aligned with your goals.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <NutritionCard
              icon={Flame}
              label="Calories"
              value={totalCalories.toLocaleString()}
              target="2,250 kcal"
              progress={82}
            />

            <NutritionCard
              icon={Target}
              label="Protein"
              value={`${totalProtein} g`}
              target="160 g"
              progress={88}
            />

            <NutritionCard
              icon={Apple}
              label="Carbohydrates"
              value="182 g"
              target="250 g"
              progress={73}
            />

            <NutritionCard
              icon={Droplets}
              label="Water"
              value="2.4 L"
              target="3.0 L"
              progress={80}
            />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <section className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                    Today's meals
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Food log
                  </h3>
                </div>

                <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-xs font-bold hover:bg-orange-600">
                  <Plus size={16} />
                  Add Meal
                </button>
              </div>

              <div className="mt-7 space-y-4">
                {meals.map((meal) => (
                  <div
                    key={meal.name}
                    className="rounded-xl border border-white/5 bg-black/30 p-5"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
                            <Utensils size={17} />
                          </div>

                          <h4 className="font-bold">{meal.name}</h4>
                        </div>

                        <p className="mt-3 text-xs text-gray-600">
                          {meal.items.join(" • ")}
                        </p>
                      </div>

                      <div className="flex gap-6 text-xs">
                        <div>
                          <p className="text-gray-700">Calories</p>
                          <p className="mt-1 font-bold text-gray-300">
                            {meal.calories}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-700">Protein</p>
                          <p className="mt-1 font-bold text-gray-300">
                            {meal.protein}g
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-700">Carbs</p>
                          <p className="mt-1 font-bold text-gray-300">
                            {meal.carbs}g
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                Daily targets
              </p>

              <h3 className="mt-2 text-xl font-black">
                Nutrition balance
              </h3>

              <div className="mt-8 flex justify-center">
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-[16px] border-orange-500/20">
                  <div className="absolute inset-0 rounded-full border-[16px] border-transparent border-t-orange-500 border-r-orange-500" />

                  <div className="text-center">
                    <p className="text-3xl font-black">82%</p>
                    <p className="mt-1 text-xs text-gray-600">
                      daily target
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Macro label="Protein" value="88%" />
                <Macro label="Carbs" value="73%" />
                <Macro label="Fats" value="64%" />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function NutritionCard({ icon: Icon, label, value, target, progress }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600">{label}</p>

        <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
          <Icon size={17} />
        </div>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <span className="text-2xl font-black">{value}</span>
        <span className="mb-1 text-xs text-gray-700">
          / {target}
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-orange-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 text-right text-[10px] text-gray-600">
        {progress}% complete
      </p>
    </div>
  );
}

function Macro({ label, value }) {
  const numeric = parseInt(value);

  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">{label}</span>
        <span className="font-bold">{value}</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-orange-500"
          style={{ width: `${numeric}%` }}
        />
      </div>
    </div>
  );
}