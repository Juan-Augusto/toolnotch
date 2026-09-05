"use client";
import Link from "next/link";
import ToolnotchLogo from "./ToolnotchLogo";
import { useEffect, useRef, useState } from "react";

interface NavChild {
  href: string;
  label: string;
  /** external / affiliate link — opens in a new tab, rel="sponsored nofollow" */
  external?: boolean;
}
interface NavItem {
  href: string;
  label: string;
  children?: NavChild[];
}

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path d="M3 5h18" />
    <path d="M3 12h18" />
    <path d="M3 19h18" />
  </svg>
);
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
const CaretIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function Header({ navItems }: { navItems: NavItem[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all border-bd-base duration-300 ${isScrolled ? " bg-background/80 backdrop-blur-md" : ""}`}
    >
      <nav
        className={`flex justify-between items-center gap-4 px-4 max-w-300 mx-auto transition-all duration-300 py-4 ${!isScrolled ? "md:py-6" : "md:py-3"} flex-row`}
      >
        <ToolnotchLogoContainer />

        {/* Desktop Menu */}
        <div className="hidden md:block">
          <MenuItemsContainer navItems={navItems} />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <CollapsedMenu
            navItems={navItems}
            setIsMenuOpen={setIsMenuOpen}
            isMenuOpen={isMenuOpen}
          />
        </div>
      </nav>
    </header>
  );
}

const CollapsedMenu = ({
  navItems,
  setIsMenuOpen,
  isMenuOpen,
}: {
  navItems: NavItem[];
  setIsMenuOpen: (isOpen: boolean) => void;
  isMenuOpen: boolean;
}) => {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 -mr-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors focus:outline-none"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <div className="transition-transform duration-300 ease-in-out transform rotate-90">
            <CloseIcon />
          </div>
        ) : (
          <div className="transition-transform duration-300 ease-in-out transform rotate-0">
            <MenuIcon />
          </div>
        )}
      </button>
      <div
        className={`absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-b border-gray-300 dark:border-gray-700 shadow-md py-6 px-4 z-50 transition-all duration-300 ease-in-out origin-top ${
          isMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto visible"
            : "opacity-0 -translate-y-4 pointer-events-none invisible"
        }`}
      >
        <MenuItemsContainer
          navItems={navItems}
          onItemClick={() => setIsMenuOpen(false)}
        />
      </div>
    </div>
  );
};

const linkClass =
  "text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors";

const MenuItemsContainer = ({
  navItems,
  onItemClick,
}: {
  navItems: NavItem[];
  onItemClick?: () => void;
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-6 transition-all duration-300 ease-in-out ${navItems.length > 0 ? "opacity-100" : "opacity-0"}`}
    >
      {navItems.map((item) =>
        item.children && item.children.length > 0 ? (
          <NavDropdown key={item.href} item={item} onItemClick={onItemClick} />
        ) : (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={linkClass}
          >
            {item.label}
          </Link>
        ),
      )}
    </div>
  );
};

const NavDropdown = ({
  item,
  onItemClick,
}: {
  item: NavItem;
  onItemClick?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDocPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    onItemClick?.();
  };

  return (
    <div ref={ref} className="relative w-full md:w-auto">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`${linkClass} flex items-center gap-1`}
      >
        {item.label}
        <CaretIcon />
      </button>
      {open && (
        <div
          role="menu"
          className="flex flex-col gap-1 mt-2 w-full md:absolute md:right-0 md:top-full md:mt-2 md:w-64 md:rounded-lg md:border md:border-bd-base md:bg-background md:shadow-lg md:p-2 md:z-50"
        >
          {item.children!.map((child) =>
            child.external ? (
              <a
                key={child.href}
                href={child.href}
                target="_blank"
                rel="sponsored nofollow noopener"
                onClick={close}
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors px-2 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
              >
                {child.label}
              </a>
            ) : (
              <Link
                key={child.href}
                href={child.href}
                onClick={close}
                className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline px-2 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
              >
                {child.label}
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
};

const ToolnotchLogoContainer = () => {
  return (
    <div className="flex items-center gap-2">
      <ToolnotchLogo className="text-emerald-500 w-5 h-5" />
      <Link
        href="/"
        className="text-xl font-bold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 mr-auto"
      >
        Toolnotch
      </Link>
    </div>
  );
};
