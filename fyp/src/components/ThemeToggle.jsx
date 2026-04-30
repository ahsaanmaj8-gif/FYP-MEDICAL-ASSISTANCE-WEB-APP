import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
<button
  onClick={toggleTheme}
  className="group relative px-3 py-2.5 rounded-full font-medium text-white
             bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
             shadow-lg shadow-purple-500/30
             transition-all duration-300
             hover:scale-105 hover:shadow-purple-500/50
             active:scale-95"
>
  <span className="flex items-center gap-2">
    {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
  </span>

  {/* glow effect */}
  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30
                   bg-white blur-md transition-all duration-300"></span>
</button>
  );
};

export default ThemeToggle;
