import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem("gymfit_theme") === "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light", lightMode);

    localStorage.setItem(
      "gymfit_theme",
      lightMode ? "light" : "dark"
    );
  }, [lightMode]);

  return (
    <button
      type="button"
      onClick={() => setLightMode((current) => !current)}
      aria-label={
        lightMode
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
      title={
        lightMode
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
      className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-400 transition hover:border-orange-500/30 hover:text-orange-500"
    >
      {lightMode ? (
        <Moon
          size={18}
          className="transition-transform duration-300 group-hover:rotate-12"
        />
      ) : (
        <Sun
          size={18}
          className="transition-transform duration-300 group-hover:rotate-45"
        />
      )}
    </button>
  );
}