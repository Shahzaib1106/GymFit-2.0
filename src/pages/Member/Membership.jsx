import {
  BadgeCheck,
  CalendarDays,
  Check,
  CreditCard,
  Crown,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import MemberSidebar from "../../components/MemberSidebar.jsx";
import MemberHeader from "../../components/MemberHeader.jsx";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 3500,
    description: "Essential gym access for consistent training.",
    features: [
      "Gym access",
      "Basic workout plans",
      "Exercise library",
      "Progress tracking",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 6500,
    description: "Complete fitness support for serious progress.",
    features: [
      "Gym access",
      "Personalized workouts",
      "Nutrition tracking",
      "Trainer consultation",
      "Performance analytics",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: 9500,
    description: "Premium coaching and advanced fitness support.",
    features: [
      "Everything in Pro",
      "Priority trainer support",
      "Advanced nutrition guidance",
      "Personal fitness reviews",
      "Premium progress analytics",
    ],
  },
];

const initialPayments = [
  {
    id: 1,
    date: "Sep 03, 2026",
    description: "Pro Membership",
    amount: 6500,
    status: "Paid",
  },
  {
    id: 2,
    date: "Aug 03, 2026",
    description: "Pro Membership",
    amount: 6500,
    status: "Paid",
  },
  {
    id: 3,
    date: "Jul 03, 2026",
    description: "Pro Membership",
    amount: 6500,
    status: "Paid",
  },
];

const membershipStart = new Date("2026-09-03T00:00:00");

export default function Membership() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("pro");
  const [payments, setPayments] = useState(initialPayments);
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [notice, setNotice] = useState("");

  const activePlan = useMemo(
    () =>
      plans.find((plan) => plan.id === currentPlan) ||
      plans[1],
    [currentPlan]
  );

  const renewalDate = useMemo(() => {
    const date = new Date(membershipStart);
    date.setMonth(date.getMonth() + 1);

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  }, []);

  const handleSelectPlan = (plan) => {
    if (plan.id === currentPlan) {
      setNotice("You are already subscribed to this plan.");
      return;
    }

    setSelectedPlan(plan);
  };

  const confirmPlanChange = () => {
    if (!selectedPlan) return;

    const previousPlan = activePlan;

    setCurrentPlan(selectedPlan.id);

    setPayments((currentPayments) => [
      {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        description: `${selectedPlan.name} Membership`,
        amount: selectedPlan.price,
        status: "Paid",
      },
      ...currentPayments,
    ]);

    setNotice(
      `${selectedPlan.name} Membership activated successfully.`
    );

    setSelectedPlan(null);

    if (previousPlan.id !== selectedPlan.id) {
      setShowPlans(false);
    }
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
                  Membership
                </p>

                <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                  Your Membership
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                  Manage your current plan, membership benefits and
                  payment history from one place.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPlans((current) => !current);
                  setNotice("");
                }}
                className="flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-xs font-black text-black transition hover:bg-orange-400"
              >
                <Sparkles size={16} />
                {showPlans ? "Hide Plans" : "Explore Plans"}
              </button>
            </div>
          </section>

          {notice && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-orange-500/20 bg-orange-500/[0.06] px-5 py-4">
              <BadgeCheck
                size={18}
                className="shrink-0 text-orange-500"
              />

              <p className="text-sm text-gray-300">
                {notice}
              </p>

              <button
                type="button"
                onClick={() => setNotice("")}
                className="ml-auto text-gray-600 transition hover:text-white"
                aria-label="Dismiss notification"
              >
                <X size={17} />
              </button>
            </div>
          )}

          <div className="mt-7 grid gap-6 xl:grid-cols-3">
            <section className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-orange-500/[0.06] p-7 xl:col-span-2">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

              <div className="relative">
                <div className="flex flex-col justify-between gap-5 sm:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                        ACTIVE
                      </span>

                      <span className="flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-400">
                        <Crown size={12} />
                        {activePlan.name}
                      </span>
                    </div>

                    <h3 className="mt-5 text-3xl font-black">
                      {activePlan.name} Membership
                    </h3>

                    <p className="mt-2 max-w-xl text-sm text-gray-500">
                      {activePlan.description}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-3xl font-black">
                      Rs {activePlan.price.toLocaleString()}
                    </p>

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
                    value={renewalDate}
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
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
                  <Crown size={20} />
                </div>

                <div>
                  <p className="text-xs text-gray-600">
                    Current plan
                  </p>

                  <h3 className="font-bold">
                    {activePlan.name} Benefits
                  </h3>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                {activePlan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 text-sm text-gray-300"
                  >
                    <Check
                      size={17}
                      className="mt-0.5 shrink-0 text-orange-500"
                    />

                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {showPlans && (
            <section className="mt-6">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                  Membership Plans
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  Choose your plan
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Compare available plans and upgrade your fitness
                  experience.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {plans.map((plan) => {
                  const isCurrent =
                    plan.id === currentPlan;

                  return (
                    <article
                      key={plan.id}
                      className={`relative rounded-2xl border p-6 transition duration-300 ${
                        isCurrent
                          ? "border-orange-500/40 bg-orange-500/[0.06]"
                          : "border-white/10 bg-white/[0.025] hover:-translate-y-1 hover:border-orange-500/20"
                      }`}
                    >
                      {isCurrent && (
                        <span className="absolute right-5 top-5 rounded-full bg-green-500/10 px-3 py-1 text-[10px] font-bold uppercase text-green-400">
                          Current
                        </span>
                      )}

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                        {plan.id === "elite" ? (
                          <Crown size={20} />
                        ) : (
                          <Sparkles size={20} />
                        )}
                      </div>

                      <h4 className="mt-5 text-xl font-black">
                        {plan.name}
                      </h4>

                      <p className="mt-2 min-h-10 text-xs leading-5 text-gray-600">
                        {plan.description}
                      </p>

                      <div className="mt-6">
                        <span className="text-3xl font-black">
                          Rs {plan.price.toLocaleString()}
                        </span>

                        <span className="ml-1 text-xs text-gray-600">
                          / month
                        </span>
                      </div>

                      <div className="my-6 h-px bg-white/5" />

                      <div className="space-y-3">
                        {plan.features.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-start gap-2.5 text-xs text-gray-400"
                          >
                            <Check
                              size={14}
                              className="mt-0.5 shrink-0 text-orange-500"
                            />

                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={isCurrent}
                        onClick={() =>
                          handleSelectPlan(plan)
                        }
                        className={`mt-7 w-full rounded-xl px-4 py-3 text-xs font-black transition ${
                          isCurrent
                            ? "cursor-default border border-white/5 bg-white/[0.03] text-gray-700"
                            : "bg-orange-500 text-black hover:bg-orange-400"
                        }`}
                      >
                        {isCurrent
                          ? "Current Plan"
                          : `Select ${plan.name}`}
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                  Billing
                </p>

                <h3 className="mt-2 text-xl font-black">
                  Payment History
                </h3>

                <p className="mt-1 text-xs text-gray-600">
                  Recent membership payments and billing activity.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/20 px-4 py-3">
                <CreditCard
                  size={15}
                  className="text-orange-500"
                />

                <span className="text-xs text-gray-500">
                  •••• 4242
                </span>
              </div>
            </div>

            <div className="mt-7 overflow-x-auto">
              {payments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
                  <CreditCard
                    size={28}
                    className="mx-auto mb-3 text-gray-700"
                  />

                  <p className="text-sm font-semibold text-gray-500">
                    No payment history
                  </p>
                </div>
              ) : (
                <table className="w-full min-w-[650px] text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-gray-600">
                      <th className="pb-4 font-medium">
                        Date
                      </th>

                      <th className="pb-4 font-medium">
                        Description
                      </th>

                      <th className="pb-4 font-medium">
                        Amount
                      </th>

                      <th className="pb-4 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b border-white/5 text-sm"
                      >
                        <td className="py-5 text-gray-500">
                          {payment.date}
                        </td>

                        <td className="py-5 font-medium">
                          {payment.description}
                        </td>

                        <td className="py-5 font-semibold">
                          Rs{" "}
                          {payment.amount.toLocaleString()}
                        </td>

                        <td className="py-5">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                            <Check size={12} />
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <TrustCard
              icon={ShieldCheck}
              title="Secure Billing"
              text="Your membership billing information is protected."
            />

            <TrustCard
              icon={CalendarDays}
              title="Flexible Plans"
              text="Change your membership plan whenever you need."
            />

            <TrustCard
              icon={BadgeCheck}
              title="Active Benefits"
              text={`${activePlan.features.length} benefits are included in your current plan.`}
            />
          </section>
        </main>
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0c0c] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                  Membership Change
                </p>

                <h3 className="mt-2 text-xl font-black">
                  Switch to {selectedPlan.name}?
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Your new plan will be shown as the active
                  membership after confirmation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="rounded-xl border border-white/10 p-2 text-gray-500 transition hover:border-white/20 hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-orange-500/20 bg-orange-500/[0.06] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">
                    Selected plan
                  </p>

                  <p className="mt-1 text-lg font-black">
                    {selectedPlan.name}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-black">
                    Rs{" "}
                    {selectedPlan.price.toLocaleString()}
                  </p>

                  <p className="text-[10px] text-gray-600">
                    per month
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-gray-400 transition hover:border-white/20 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmPlanChange}
                className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-xs font-black text-black transition hover:bg-orange-400"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
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

      <p className="mt-2 text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}

function TrustCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
        <Icon size={18} />
      </div>

      <h4 className="mt-4 text-sm font-bold">
        {title}
      </h4>

      <p className="mt-2 text-xs leading-5 text-gray-600">
        {text}
      </p>
    </div>
  );
}