import { Bell, LogOut, Menu, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth.jsx";

function MemberHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const displayName = user?.name || "Member";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#080808]/90 px-5 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl border border-white/10 p-2 text-gray-400 transition hover:border-orange-500/30 hover:text-white lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">
            Member Portal
          </p>

          <h1 className="text-lg font-bold text-white">
            Welcome back, {displayName.split(" ")[0]}.
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-xl border border-white/10 p-2.5 text-gray-400 transition hover:border-orange-500/30 hover:text-white"
        >
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
        </button>

        <div className="hidden h-9 w-px bg-white/10 sm:block" />

        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
            <User size={18} />
          </div>

          <div className="max-w-32">
            <p className="truncate text-sm font-semibold text-white">
              {displayName}
            </p>

            <p className="truncate text-xs text-gray-600">
              {user?.email || "Member"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className="rounded-xl border border-white/10 p-2.5 text-gray-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}

export default MemberHeader;