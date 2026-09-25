import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "3,500",
    description: "For beginners building a consistent routine.",
    features: [
      "Gym access",
      "Basic workout plans",
      "Progress tracking",
      "Locker access",
    ],
  },
  {
    name: "Pro",
    price: "6,500",
    description: "For members serious about their transformation.",
    popular: true,
    features: [
      "Everything in Starter",
      "Personalized workouts",
      "Nutrition tracking",
      "Trainer consultation",
      "Performance analytics",
    ],
  },
  {
    name: "Elite",
    price: "10,000",
    description: "Premium support for maximum performance.",
    features: [
      "Everything in Pro",
      "Personal trainer",
      "Advanced nutrition plan",
      "Priority support",
      "Monthly assessment",
    ],
  },
];

export default function Membership() {
  return (
    <section id="membership" className="bg-[#080808] py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Membership
          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-5xl">
            Choose your plan.
          </h2>

          <p className="mt-5 text-gray-500">
            Simple plans designed for different fitness goals.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-8 ${
                plan.popular
                  ? "border-orange-500 bg-orange-500/[0.07]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              {plan.popular && (
                <div className="absolute right-6 top-6 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold">
                  MOST POPULAR
                </div>
              )}

              <p className="text-sm font-bold text-gray-400">{plan.name}</p>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-5xl font-black">Rs {plan.price}</span>
                <span className="mb-2 text-sm text-gray-500">/month</span>
              </div>

              <p className="mt-4 min-h-[48px] text-sm leading-6 text-gray-500">
                {plan.description}
              </p>

              <div className="my-8 h-px bg-white/10" />

              <div className="space-y-4">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-300"
                  >
                    <Check size={17} className="text-orange-500" />
                    {feature}
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className={`mt-9 block rounded-xl px-5 py-4 text-center text-sm font-bold transition ${
                  plan.popular
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "border border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                Choose {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}