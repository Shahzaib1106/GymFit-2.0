import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="bg-black py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Contact
          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-5xl">
            Ready to start?
          </h2>

          <p className="mt-5 max-w-lg leading-7 text-gray-500">
            Have questions about membership, training or our fitness programs?
            Send us a message and our team will get back to you.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="mt-1 font-semibold">+92 300 1234567</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="mt-1 font-semibold">hello@gymfit.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="mt-1 font-semibold">Lahore, Pakistan</p>
              </div>
            </div>
          </div>
        </div>

        <form className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Your name"
              className="rounded-xl border border-white/10 bg-black px-4 py-4 text-sm outline-none transition placeholder:text-gray-600 focus:border-orange-500"
            />

            <input
              type="email"
              placeholder="Email address"
              className="rounded-xl border border-white/10 bg-black px-4 py-4 text-sm outline-none transition placeholder:text-gray-600 focus:border-orange-500"
            />
          </div>

          <input
            type="text"
            placeholder="Subject"
            className="mt-5 w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-sm outline-none transition placeholder:text-gray-600 focus:border-orange-500"
          />

          <textarea
            rows="6"
            placeholder="Tell us how we can help..."
            className="mt-5 w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-4 text-sm outline-none transition placeholder:text-gray-600 focus:border-orange-500"
          />

          <button
            type="button"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 text-sm font-bold transition hover:bg-orange-600"
          >
            Send Message
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}