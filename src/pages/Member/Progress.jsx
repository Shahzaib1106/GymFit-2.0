import { ArrowDown, ArrowUp, CalendarDays, Target, TrendingUp } from "lucide-react";
import { useState } from "react";

import MemberSidebar from "../../components/MemberSidebar";
import MemberHeader from "../../components/MemberHeader";

const weightData = [78, 77.5, 77.2, 76.4, 76, 75.2, 74.8, 74.2];

export default function Progress() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MemberSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:pl-72">
        <MemberHeader onMenu={() => setMobileOpen(true)} />

        <main className="mx-auto max-w-[1600px] px-5 py-7 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                Analytics
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Your Progress
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Track your body composition and training performance.
              </p>
            </div>

            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs font-semibold text-gray-400">
              <CalendarDays size={16} />
              Last 8 weeks
            </button>
          </div>

          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ProgressCard
              title="Current Weight"
              value="74.2 kg"
              change="-3.8 kg"
              positive
              icon={ArrowDown}
            />

            <ProgressCard
              title="Body Fat"
              value="18.4%"
              change="-2.1%"
              positive
              icon={ArrowDown}
            />

            <ProgressCard
              title="Workouts"
              value="28"
              change="+6"
              positive
              icon={ArrowUp}
            />

            <ProgressCard
              title="Consistency"
              value="86%"
              change="+12%"
              positive
              icon={TrendingUp}
            />
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <section className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                    Body Weight
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    74.2 kg
                  </h3>

                  <p className="mt-1 text-xs text-green-400">
                    ↓ 3.8 kg since July
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <WeightChart />
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
                  <Target size={20} />
                </div>

                <div>
                  <p className="text-xs text-gray-600">Current goal</p>
                  <h3 className="font-bold">72 kg</h3>
                </div>
              </div>

              <div className="mt-9">
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-black">74%</span>
                  <span className="text-xs text-gray-600">completed</span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-[74%] rounded-full bg-orange-500" />
                </div>

                <p className="mt-4 text-xs leading-5 text-gray-600">
                  You are 2.2 kg away from your current target.
                </p>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-xs text-gray-600">Goal deadline</p>
                <p className="mt-2 font-bold">November 15, 2026</p>
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                Performance
              </p>

              <h3 className="mt-2 text-xl font-black">
                Personal records
              </h3>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Record name="Bench Press" value="85 kg" increase="+10 kg" />
              <Record name="Squat" value="110 kg" increase="+15 kg" />
              <Record name="Deadlift" value="135 kg" increase="+20 kg" />
              <Record name="5K Run" value="27:42" increase="-2:18" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function ProgressCard({ title, value, change, positive, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600">{title}</p>

        <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
          <Icon size={16} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-black">{value}</p>

      <p
        className={`mt-2 text-xs font-semibold ${
          positive ? "text-green-400" : "text-red-400"
        }`}
      >
        {change} this period
      </p>
    </div>
  );
}

function Record({ name, value, increase }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 p-5">
      <p className="text-xs text-gray-600">{name}</p>

      <p className="mt-3 text-xl font-black">{value}</p>

      <p className="mt-2 text-xs font-semibold text-green-400">
        {increase}
      </p>
    </div>
  );
}

function WeightChart() {
  const max = Math.max(...weightData);
  const min = Math.min(...weightData);

  const points = weightData
    .map((value, index) => {
      const x = (index / (weightData.length - 1)) * 100;
      const y = 15 + ((value - min) / (max - min)) * 65;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <div className="relative h-64 rounded-xl border border-white/5 bg-black/30 p-4">
        <div className="absolute inset-5 flex flex-col justify-between">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="border-t border-white/5" />
          ))}
        </div>

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="relative h-full w-full"
        >
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            className="text-orange-500"
          />
        </svg>
      </div>

      <div className="mt-4 flex justify-between text-[10px] text-gray-700">
        <span>Aug 01</span>
        <span>Aug 15</span>
        <span>Sep 01</span>
        <span>Sep 15</span>
        <span>Sep 25</span>
      </div>
    </div>
  );
}