import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";

const navItems = [
  ["Home", "home"],
  ["Features", "features"],
  ["Trainers", "trainers"],
  ["Membership", "membership"],
  ["Reviews", "reviews"],
  ["FAQ", "faq"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id) => {
    setOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <header className="gf-glass fixed left-0 right-0 top-0 z-50">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollTo("home")}
          className="group flex items-center text-2xl font-black tracking-tight"
          aria-label="GymFit 2.0 home"
        >
          <span>
            GYM<span className="text-orange-500">FIT</span>
          </span>

          <span className="ml-2 rounded-md border border-orange-500/20 bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-orange-500">
            2.0
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map(([label, id]) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className="relative text-sm font-medium text-gray-400 transition hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-orange-500 after:transition-all hover:after:w-full"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />

          <Link
            to="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:text-white"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-600 hover:shadow-orange-500/20"
          >
            Join Now
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-gray-300 transition hover:border-orange-500/30 hover:text-orange-500"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-white/10 bg-black/95 px-5 py-5 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-1">
              {navItems.map(([label, id]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  className="rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                >
                  {label}
                </button>
              ))}

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-gray-300 transition hover:border-orange-500/30 hover:text-white"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Join Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}