import {
  CheckCircle2,
  CreditCard,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import MemberSidebar from "../../components/MemberSidebar";
import MemberHeader from "../../components/MemberHeader";

const features = [
  "Gym access",
  "Personalized workouts",
  "Nutrition tracking",
  "Trainer consultation",
  "Performance analytics",
];

export default function Membership() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MemberSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:pl-72">
        <MemberHeader onMenu={() => setMobileOpen(true)} />

        <main className="mx-auto max-w-[1400px] px-5 py-7 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Membership
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Your Membership
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manage your plan, billing and membership benefits.
            </p>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-3">
            <section className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-orange-500/[0.06] p-7 lg:col-span-2">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

              <div className="relative">
                <div className="flex flex-col justify-between gap-5 sm:flex-row">
                  <div>
                    <span className="rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-400">
                      ACTIVE
                    </span>

                    <h3 className="mt-5 text-3xl font-black">
                      Pro Membership
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Your current fitness membership plan.
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-3xl font-black">Rs 6,500</p>
                    <p className="mt-1 text-xs text-gray-600">
                      per month
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <Info
                    icon={CalendarDays}
                    label="Started"
                    value="September 03, 2026"
                  />

                  <Info
                    icon={CalendarDays}
                    label="Next renewal"
                    value="October 03, 2026"
                  />

                  <Info
                    icon={CreditCard}
                    label="Payment method"
                    value="•••• 4242"
                  />

                  <Info
                    icon={ShieldCheck}
                    label="Status"
                    value="Active & protected"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                Included
              </p>

              <h3 className="mt-2 text-xl font-black">
                Plan benefits
              </h3>

              <div className="mt-7 space-y-4">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-300"
                  >
                    <CheckCircle2
                      size={17}
                      className="text-orange-500"
                    />
                    {feature}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                Billing
              </p>

              <h3 className="mt-2 text-xl font-black">
                Payment history
              </h3>
            </div>

            <div className="mt-7 overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-gray-600">
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 font-medium">Description</th>
                    <th className="pb-4 font-medium">Amount</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    ["Sep 03, 2026", "Pro Membership", "Rs 6,500"],
                    ["Aug 03, 2026", "Pro Membership", "Rs 6,500"],
                    ["Jul 03, 2026", "Pro Membership", "Rs 6,500"],
                  ].map(([date, description, amount]) => (
                    <tr
                      key={date}
                      className="border-b border-white/5 text-sm"
                    >
                      <td className="py-5 text-gray-500">{date}</td>
                      <td className="py-5 font-medium">{description}</td>
                      <td className="py-5 font-semibold">{amount}</td>
                      <td className="py-5">
                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 p-4">
      <div className="flex items-center gap-2 text-gray-600">
        <Icon size={15} />
        <span className="text-[10px] uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}