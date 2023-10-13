import { useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";

export default function useTheme() {
  const context = useContext(ThemeContext);
  if (typeof context === "undefined") {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
