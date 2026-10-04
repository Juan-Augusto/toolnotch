"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AppAffiliateLink from "./AppAffiliateLink";
import AppLanguageSwitcher from "./AppLanguageSwitcher";
import AppDarkModeToggle from "./AppDarkModeToggle";
import AppLogo from "./AppLogo";
import { Search, ChevronDown } from "lucide-react";

interface NavChild {
  href: string;
  label: string;
  external?: boolean;
  partnerKey?: string;
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


export default function AppHeader({ navItems }: { navItems: NavItem[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-tertiary dark:bg-background border-b border-b-border transition-all duration-300 ${isScrolled ? " bg-background/80 backdrop-blur-md" : ""}`}
    >
      <nav
        className={`flex justify-between items-center gap-4 px-6 md:px-10 transition-all duration-300 py-4 ${!isScrolled ? "min-[1100px]:py-6" : "min-[1100px]:py-4"} flex-row`}
      >
        <div className="flex items-center gap-8">
          <AppLogo href="/" />
          <div className="hidden min-[1100px]:block">
            <AppLanguageSwitcher />
          </div>
        </div>

        <div className="hidden min-[1100px]:flex items-center gap-8">
          <button
            type="button"
            aria-label="Search"
            className="text-foreground hover:text-primary transition-colors"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>
          <MenuItemsContainer navItems={navItems} />
          <AppDarkModeToggle />
        </div>

        <div className="min-[1100px]:hidden flex items-center gap-4">
          <button type="button" aria-label="Search" className="text-foreground">
            <Search className="w-5 h-5" />
          </button>
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
        className="p-2 -mr-2 text-foreground hover:text-primary transition-colors focus:outline-none"
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
        className={`absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-md py-6 px-4 z-50 transition-all duration-300 ease-in-out origin-top ${
          isMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto visible"
            : "opacity-0 -translate-y-4 pointer-events-none invisible"
        }`}
      >
        <div className="min-[1100px]:hidden mb-6 flex justify-between items-center border-b border-border pb-4">
          <AppLanguageSwitcher />
          <AppDarkModeToggle />
        </div>
        <MenuItemsContainer
          navItems={navItems}
          onItemClick={() => setIsMenuOpen(false)}
        />
      </div>
    </div>
  );
};

const linkClass =
  "font-semibold uppercase text-foreground hover:text-primary transition-colors";

const MenuItemsContainer = ({
  navItems,
  onItemClick,
}: {
  navItems: NavItem[];
  onItemClick?: () => void;
}) => {
  return (
    <div
      className={`flex flex-col min-[1100px]:flex-row items-start min-[1100px]:items-center gap-6 min-[1100px]:gap-8 transition-all duration-300 ease-in-out ${navItems.length > 0 ? "opacity-100" : "opacity-0"}`}
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
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
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
    <div ref={ref} className="relative w-full min-[1100px]:w-auto">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`${linkClass} flex items-center gap-1 cursor-pointer select-none`}
      >
        <span>{item.label}</span>
        <ChevronDown
          size={13}
          className={`shrink-0 transition-transform duration-200 ${
            open ? "rotate-180 text-primary" : "rotate-0 text-muted-foreground"
          }`}
        />
      </button>
      {open && (
        <div
          role="menu"
          className="flex flex-col gap-0.5 mt-2 w-full min-[1100px]:absolute min-[1100px]:right-0 min-[1100px]:top-full min-[1100px]:mt-1.5 min-[1100px]:w-72 bg-tertiary border border-border rounded-[2px] shadow-lg p-1.5 z-50"
        >
          {item.children!.map((child) =>
            child.external ? (
              <AppAffiliateLink
                key={child.href}
                href={child.href}
                partnerKey={child.partnerKey ?? "unknown"}
                placement="nav-dropdown"
                onClick={close}
                className="flex items-center justify-between font-mono text-sm uppercase text-label hover:text-foreground hover:bg-background transition-colors px-3.5 py-2.5 rounded-[2px] cursor-pointer"
              >
                <span>{child.label}</span>
                <span className="text-xs opacity-40 font-mono">↗</span>
              </AppAffiliateLink>
            ) : (
              <div key={child.href} className="border-t border-border/60 mt-1 pt-1">
                <Link
                  href={child.href}
                  onClick={close}
                  className="flex items-center justify-between font-mono text-sm uppercase text-primary font-semibold hover:bg-background transition-colors px-3.5 py-2.5 rounded-[2px] cursor-pointer"
                >
                  <span>{child.label}</span>
                  <span className="text-sm">→</span>
                </Link>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
};
