'use client'
import Link from "next/link";
import ToolnotchLogo from "./ToolnotchLogo";
import { useEffect, useState } from "react";

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 5h18"/><path d="M3 12h18"/><path d="M3 19h18"/></svg>
)
const CloseIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>)

export default function Header({ navItems }: { navItems: { href: string; label: string }[] }) {
  const [showMenuIcon, setShowMenuIcon] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleResize = () => {
    if (typeof window !== 'undefined') {
      setShowMenuIcon(window.innerWidth <= 768);
    }
  };
  useEffect(() => {
    // window.innerWidth is unavailable during SSR render; synced here from the resize listener.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800  border-b border-gray-200 dark:border-gray-700">
      <nav className={`flex  justify-between gap-4 py-3 px-4 max-w-300 mx-auto ${!isMenuOpen ? 'flex-row' : 'flex-col items-center md:flex-row'}`}>
        <ToolnotchLogoContainer />
        {
          !showMenuIcon ? (
            <MenuItemsContainer navItems={navItems} />
          ) : (
            <CollapsedMenu navItems={navItems} setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
          )
        }
      </nav>
    </header>
  )
}

const CollapsedMenu = ({ navItems, setIsMenuOpen, isMenuOpen }: { navItems: { href: string; label: string }[]; setIsMenuOpen: (isOpen: boolean) => void; isMenuOpen: boolean }) => {
  return (
    <div className=" dark:bg-gray-800 z-50 transition-all duration-300 ease-in-out">
      <nav className="flex flex-col items-center gap-4 py-3 px-4 max-w-300 mx-auto transition-all duration-300 ease-in-out">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          { isMenuOpen ? 
            <div className="transition-transform duration-300 ease-in-out transform rotate-90">
              <CloseIcon /> 
            </div>
            :
            <div className="transition-transform duration-300 ease-in-out transform rotate-0">
              <MenuIcon /> 
            </div> 
          }
        </button>
        {
          isMenuOpen ? <MenuItemsContainer navItems={navItems} /> : null
        }
      </nav>
    </div>
  )
}


const MenuItemsContainer = ({ navItems }: { navItems: { href: string; label: string }[]}) => {
  return (
    <div className={`flex flex-col md:flex-row items-center gap-4 transition-all duration-300 ease-in-out ${navItems.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
      {
        navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            {item.label}
          </Link>
        ))
      }
    </div>
  )
}

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
  )
}
