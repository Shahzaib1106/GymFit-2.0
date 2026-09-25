import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Apple,
  User,
  X,
  CreditCard,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    path: "/member",
    icon: LayoutDashboard,
  },
  {
    label: "Workouts",
    path: "/member/workouts",
    icon: Dumbbell,
  },
  {
    label: "Exercises",
    path: "/member/exercises",
    icon: CalendarDays,
  },
  {
    label: "Progress",
    path: "/member/progress",
    icon: BarChart3,
  },
  {
    label: "Nutrition",
    path: "/member/nutrition",
    icon: Apple,
  },
  {
    label: "Membership",
    path: "/member/membership",
    icon: CreditCard,
  },
  {
    label: "Profile",
    path: "/member/profile",
    icon: User,
  },
];

export default function MemberSidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("gymfit_user") || '{"name":"Member"}'
  );

  const logout = () => {
    localStorage.removeItem("gymfit_user");
    navigate("/login");
  };

  return (
    <>
      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#080808] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <button
            onClick={() => navigate("/member")}
            className="text-2xl font-black"
          >
            GYM<span className="text-orange-500">FIT</span>
            <span className="ml-2 text-xs font-semibold text-gray-600">
              2.0
            </span>
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 font-black">
              {user.name?.charAt(0)?.toUpperCase() || "M"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {user.name || "Member"}
              </p>

              <p className="mt-1 text-xs text-orange-500">
                Pro Member
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
            Member Area
          </p>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/member"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "text-gray-500 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}