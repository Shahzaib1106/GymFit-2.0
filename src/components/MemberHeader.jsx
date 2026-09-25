import { Bell, Menu, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function MemberHeader({ onMenu }) {
  const user = JSON.parse(
    localStorage.getItem("gymfit_user") || '{"name":"Member"}'
  );

  const firstName = user.name?.split(" ")[0] || "Member";

  return (
    <header className="gf-glass sticky top-0 z-30 flex h-20 items-center justify-between px-5 lg:px-8">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open member menu"
          className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-gray-400 transition hover:border-orange-500/30 hover:bg-white/5 hover:text-orange-500 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div>
          <p className="hidden text-xs font-medium uppercase tracking-wider text-gray-600 sm:block">
            Member Portal
          </p>

          <h1 className="mt-0.5 text-lg font-bold">
            Good morning, {firstName}.
          </h1>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Search */}
        <button
          type="button"
          aria-label="Search"
          className="hidden rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-gray-500 transition hover:border-orange-500/30 hover:bg-white/5 hover:text-orange-500 sm:block"
        >
          <Search size={19} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-gray-500 transition hover:border-orange-500/30 hover:bg-white/5 hover:text-orange-500"
        >
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
        </button>

        {/* User Avatar */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 font-black text-white shadow-lg shadow-orange-500/10"
          title={user.name || "Member"}
        >
          {user.name?.charAt(0)?.toUpperCase() || "M"}
        </div>
      </div>
    </header>
  );
}