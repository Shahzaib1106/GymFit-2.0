import { Star } from "lucide-react";

const reviews = [
  {
    name: "Usman R.",
    role: "Member",
    text: "The environment is excellent and the trainers actually care about progress.",
  },
  {
    name: "Hassan K.",
    role: "Member",
    text: "GymFit made my workout routine much more structured and consistent.",
  },
  {
    name: "Ayesha M.",
    role: "Member",
    text: "Clean environment, professional trainers and a very motivating atmosphere.",
  },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Member Stories
          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-5xl">
            Real people. Real progress.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
            >
              <div className="flex gap-1 text-orange-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill="currentColor" />
                ))}
              </div>

              <p className="mt-6 text-sm leading-7 text-gray-300">
                "{review.text}"
              </p>

              <div className="mt-7">
                <p className="font-bold">{review.name}</p>
                <p className="mt-1 text-xs text-gray-500">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}