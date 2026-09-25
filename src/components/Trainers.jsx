import { motion } from "framer-motion";
import { Award, ArrowUpRight } from "lucide-react";

const trainers = [
  {
    name: "Ali Khan",
    role: "Strength & Conditioning",
    experience: "10+ Years",
    image:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg",
  },
  {
    name: "Hamza Ahmed",
    role: "Performance Coach",
    experience: "7+ Years",
    image:
      "https://images.pexels.com/photos/6551415/pexels-photo-6551415.jpeg",
  },
  {
    name: "Bilal Shah",
    role: "Fitness Coach",
    experience: "5+ Years",
    image:
      "https://images.pexels.com/photos/6456304/pexels-photo-6456304.jpeg",
  },
];

export default function Trainers() {
  return (
    <section id="trainers" className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
              Our Team
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Train with experts.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-gray-500">
            Experienced professionals focused on strength, performance,
            mobility and sustainable fitness.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {trainers.map((trainer, index) => (
            <motion.div
              key={trainer.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b]"
            >
              <div className="relative h-[430px] overflow-hidden">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-orange-400">
                    <Award size={15} />
                    {trainer.experience}
                  </div>

                  <h3 className="text-2xl font-black">{trainer.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">{trainer.role}</p>
                </div>

                <button className="absolute right-5 top-5 rounded-full bg-white/10 p-3 opacity-0 backdrop-blur transition group-hover:opacity-100">
                  <ArrowUpRight size={19} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}