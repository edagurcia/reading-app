import { useEffect, useState } from "react";

export const useTheme = (storagekey = "vite-ui-theme") => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem(storagekey)
      ? localStorage.getItem(storagekey)
      : window.matchMedia("(prefers-color-schema: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(isDarkMode ? "dark" : "light");

    localStorage.setItem(storagekey, JSON.stringify(isDarkMode));
  }, [isDarkMode, storagekey]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return { isDarkMode, toggleDarkMode };
};
