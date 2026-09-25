import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What are the membership fees?",
    answer:
      "Our plans start from Rs 3,500 per month, with Pro and Elite options available for members who want additional services.",
  },
  {
    question: "Do you provide personal trainers?",
    answer:
      "Yes. Personal training is available with our Pro and Elite membership options.",
  },
  {
    question: "Can beginners join GymFit?",
    answer:
      "Absolutely. Our Starter plan and beginner-friendly workout programs are designed for people starting their fitness journey.",
  },
  {
    question: "Can I track my progress digitally?",
    answer:
      "Yes. GymFit 2.0 is being designed around digital workout, progress and nutrition tracking.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-[#080808] py-24">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            FAQ
          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-5xl">
            Frequently asked questions.
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-white/10 bg-white/[0.02]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 font-semibold">
                {faq.question}

                <ChevronDown
                  size={20}
                  className="text-gray-500 transition group-open:rotate-180"
                />
              </summary>

              <p className="px-6 pb-6 text-sm leading-6 text-gray-500">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}