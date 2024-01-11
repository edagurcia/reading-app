import { useTheme } from "@/hooks/useTheme";
import { FaRegMoon, FaRegSun, FaGithub } from "react-icons/fa6";
import { GiSpellBook } from "react-icons/gi";
import { TbWorld } from "react-icons/tb";

export const Navbar = () => {
  return (
    <header className="bg-background sticky top-0 z-10 w-full border-b">
      <div className="flex h-16 items-center px-4 sm:px-8 lg:px-44">
        <div className="mx-auto w-full max-w-3xl space-y-20">
          <div className="flex justify-between">
            <div className="flex flex-1 items-center justify-start">
              <a href="/" className="text-primary size-10 p-2">
                <GiSpellBook className="size-full" />
              </a>
            </div>
            <div className="flex flex-1 items-center justify-end">
              <nav className="flex items-center justify-end">
                <ThemeToggle />
                <a
                  href="http://"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary size-10 p-2 hover:text-[#ff0000] dark:hover:text-[#ff0000]"
                >
                  <TbWorld className="size-full" />
                </a>
                <a
                  href="http://"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary size-10 p-2 hover:text-[#4078c0] dark:hover:text-[#4078c0]"
                >
                  <FaGithub className="size-full" />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button className="text-primary size-10 p-2 hover:text-amber-500 dark:hover:text-amber-400">
      {isDarkMode ? (
        <FaRegMoon className="h-full w-full" onClick={() => toggleDarkMode()} />
      ) : (
        <FaRegSun className="h-full w-full" onClick={() => toggleDarkMode()} />
      )}
    </button>
  );
}
