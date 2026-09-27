import { useEffect, useMemo, useState } from "react";
import {
  Apple,
  Beef,
  Carrot,
  Check,
  Flame,
  Loader2,
  Plus,
  Trash2,
  Utensils,
  X,
} from "lucide-react";

import MemberHeader from "../../components/MemberHeader.jsx";
import MemberSidebar from "../../components/MemberSidebar.jsx";

import { useAuth } from "../../context/useAuth.jsx";

import {
  getNutritionLogs,
  createNutritionLog,
  deleteNutritionLog,
} from "../../services/memberService.js";

const mealTypes = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
];

const emptyForm = {
  mealName: "",
  mealType: "Breakfast",
  calories: "",
  proteinG: "",
  carbsG: "",
  fatsG: "",
};

export default function Nutrition() {
  const { token } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const loadNutrition = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getNutritionLogs(token);

      setLogs(data.logs || []);
    } catch (err) {
      console.error("Nutrition loading error:", err);
      setError(err.message || "Failed to load nutrition data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      Promise.resolve().then(loadNutrition);
    }
  }, [token]);

  const totals = useMemo(() => {
    return logs.reduce(
      (acc, meal) => ({
        calories: acc.calories + Number(meal.calories || 0),
        protein: acc.protein + Number(meal.protein_g || 0),
        carbs: acc.carbs + Number(meal.carbs_g || 0),
        fats: acc.fats + Number(meal.fats_g || 0),
      }),
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      }
    );
  }, [logs]);

  const calorieGoal = 2500;
  const proteinGoal = 160;
  const carbsGoal = 280;
  const fatsGoal = 75;

  const calorieProgress = Math.min(
    (totals.calories / calorieGoal) * 100,
    100
  );

  const proteinProgress = Math.min(
    (totals.protein / proteinGoal) * 100,
    100
  );

  const carbsProgress = Math.min(
    (totals.carbs / carbsGoal) * 100,
    100
  );

  const fatsProgress = Math.min(
    (totals.fats / fatsGoal) * 100,
    100
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.mealName.trim()) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = await createNutritionLog(token, {
        mealName: form.mealName.trim(),
        mealType: form.mealType,
        calories: Number(form.calories) || 0,
        proteinG: Number(form.proteinG) || 0,
        carbsG: Number(form.carbsG) || 0,
        fatsG: Number(form.fatsG) || 0,
      });

      setLogs((previous) => [
        data.log,
        ...previous,
      ]);

      setForm(emptyForm);
      setShowModal(false);
    } catch (err) {
      console.error("Meal creation error:", err);
      setError(err.message || "Failed to add meal.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      setError("");

      await deleteNutritionLog(token, id);

      setLogs((previous) =>
        previous.filter((meal) => meal.id !== id)
      );
    } catch (err) {
      console.error("Meal deletion error:", err);
      setError(err.message || "Failed to delete meal.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatTime = (value) => {
    if (!value) {
      return "";
    }

    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMealIcon = (type) => {
    if (type === "Breakfast") {
      return <Apple size={18} />;
    }

    if (type === "Lunch") {
      return <Utensils size={18} />;
    }

    if (type === "Dinner") {
      return <Beef size={18} />;
    }

    return <Carrot size={18} />;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MemberSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:ml-72">
        <MemberHeader
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                  Nutrition
                </p>

                <h1 className="text-3xl font-black sm:text-4xl">
                  Fuel Your Progress
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Track your daily nutrition and stay consistent.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setForm(emptyForm);
                  setShowModal(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                <Plus size={18} />
                Add Meal
              </button>
            </div>

            {error && (
              <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <span>{error}</span>

                <button
                  type="button"
                  onClick={loadNutrition}
                  className="font-bold text-white hover:text-orange-400"
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <Loader2
                    size={36}
                    className="mx-auto mb-4 animate-spin text-orange-500"
                  />

                  <p className="text-sm text-gray-500">
                    Loading nutrition...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                        <Flame size={20} />
                      </div>

                      <span className="text-xs text-gray-600">
                        / {calorieGoal} kcal
                      </span>
                    </div>

                    <p className="text-2xl font-black">
                      {totals.calories}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Calories
                    </p>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-orange-500 transition-all"
                        style={{
                          width: `${calorieProgress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                        <Beef size={20} />
                      </div>

                      <span className="text-xs text-gray-600">
                        / {proteinGoal} g
                      </span>
                    </div>

                    <p className="text-2xl font-black">
                      {totals.protein.toFixed(1)}g
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Protein
                    </p>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{
                          width: `${proteinProgress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                        <Carrot size={20} />
                      </div>

                      <span className="text-xs text-gray-600">
                        / {carbsGoal} g
                      </span>
                    </div>

                    <p className="text-2xl font-black">
                      {totals.carbs.toFixed(1)}g
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Carbohydrates
                    </p>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-yellow-500 transition-all"
                        style={{
                          width: `${carbsProgress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                        <Apple size={20} />
                      </div>

                      <span className="text-xs text-gray-600">
                        / {fatsGoal} g
                      </span>
                    </div>

                    <p className="text-2xl font-black">
                      {totals.fats.toFixed(1)}g
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Fats
                    </p>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-purple-500 transition-all"
                        style={{
                          width: `${fatsProgress}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                  <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                      <div>
                        <h2 className="font-bold">
                          Today's Meals
                        </h2>

                        <p className="mt-1 text-xs text-gray-600">
                          {logs.length} meal
                          {logs.length !== 1 ? "s" : ""} logged
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-orange-500"
                        aria-label="Add meal"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <div className="p-4">
                      {logs.length === 0 ? (
                        <div className="py-16 text-center">
                          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                            <Apple size={26} />
                          </div>

                          <h3 className="font-bold text-white">
                            No meals logged yet
                          </h3>

                          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600">
                            Start tracking your meals to monitor
                            calories and macros.
                          </p>

                          <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
                          >
                            Log Your First Meal
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {logs.map((meal) => (
                            <div
                              key={meal.id}
                              className="flex flex-col gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-white/10 sm:flex-row sm:items-center"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                                  {getMealIcon(meal.meal_type)}
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate font-bold text-white">
                                    {meal.meal_name}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-600">
                                    {meal.meal_type} •{" "}
                                    {formatTime(meal.logged_at)}
                                  </p>
                                </div>
                              </div>

                              <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
                                <div>
                                  <p className="text-sm font-bold text-orange-400">
                                    {meal.calories}
                                  </p>
                                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                                    kcal
                                  </p>
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-blue-400">
                                    {Number(
                                      meal.protein_g
                                    ).toFixed(1)}g
                                  </p>
                                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                                    protein
                                  </p>
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-yellow-400">
                                    {Number(
                                      meal.carbs_g
                                    ).toFixed(1)}g
                                  </p>
                                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                                    carbs
                                  </p>
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-purple-400">
                                    {Number(
                                      meal.fats_g
                                    ).toFixed(1)}g
                                  </p>
                                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                                    fats
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(meal.id)
                                }
                                disabled={
                                  deletingId === meal.id
                                }
                                className="self-end rounded-lg p-2 text-gray-600 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 sm:self-auto"
                                aria-label="Delete meal"
                              >
                                {deletingId === meal.id ? (
                                  <Loader2
                                    size={17}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2 size={17} />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>

                  <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                        Daily Summary
                      </p>

                      <h2 className="mt-2 text-xl font-black">
                        Macro Balance
                      </h2>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <div className="mb-2 flex justify-between text-xs">
                          <span className="text-gray-500">
                            Protein
                          </span>
                          <span className="font-bold text-white">
                            {totals.protein.toFixed(1)}g
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{
                              width: `${proteinProgress}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex justify-between text-xs">
                          <span className="text-gray-500">
                            Carbs
                          </span>
                          <span className="font-bold text-white">
                            {totals.carbs.toFixed(1)}g
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-yellow-500"
                            style={{
                              width: `${carbsProgress}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex justify-between text-xs">
                          <span className="text-gray-500">
                            Fats
                          </span>
                          <span className="font-bold text-white">
                            {totals.fats.toFixed(1)}g
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-purple-500"
                            style={{
                              width: `${fatsProgress}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 rounded-xl border border-orange-500/10 bg-orange-500/5 p-4">
                      <div className="flex items-start gap-3">
                        <Check
                          size={18}
                          className="mt-0.5 shrink-0 text-orange-500"
                        />

                        <div>
                          <p className="text-sm font-bold text-white">
                            Stay consistent
                          </p>

                          <p className="mt-1 text-xs leading-5 text-gray-600">
                            Track every meal to build a clearer
                            picture of your daily nutrition.
                          </p>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-lg font-black">
                  Add Meal
                </h2>

                <p className="mt-1 text-xs text-gray-600">
                  Log your nutrition for today.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-5"
            >
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Meal Name
                </label>

                <input
                  type="text"
                  name="mealName"
                  value={form.mealName}
                  onChange={handleChange}
                  placeholder="e.g. Chicken Rice Bowl"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Meal Type
                </label>

                <select
                  name="mealType"
                  value={form.mealType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-orange-500"
                >
                  {mealTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Calories
                  </label>

                  <input
                    type="number"
                    name="calories"
                    value={form.calories}
                    onChange={handleChange}
                    min="0"
                    placeholder="500"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Protein (g)
                  </label>

                  <input
                    type="number"
                    name="proteinG"
                    value={form.proteinG}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    placeholder="35"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Carbs (g)
                  </label>

                  <input
                    type="number"
                    name="carbsG"
                    value={form.carbsG}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    placeholder="50"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Fats (g)
                  </label>

                  <input
                    type="number"
                    name="fatsG"
                    value={form.fatsG}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    placeholder="15"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {saving ? "Saving..." : "Save Meal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}