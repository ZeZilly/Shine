import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

const menuItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetlerimiz", label: "Hizmetlerimiz" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/gizlilik", label: "Gizlilik Politikası" },
  { href: "/kosullar", label: "Kullanım Koşulları" }
];

/**
 * Renders a responsive navigation bar with both desktop and mobile layouts.
 *
 * The navigation bar is fixed at the top of the viewport and includes a clickable logo that links to the home page,
 * a horizontal list of navigation links for desktop screens, and a toggleable mobile menu for smaller screens.
 * The mobile menu features smooth animations for its appearance and disappearance using Framer Motion.
 */
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <span className="text-2xl font-serif cursor-pointer">Shining Beauty</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className="text-gray-600 hover:text-gray-900 transition-colors">
                  {item.label}
                </a>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-2 space-y-2">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className="block py-2 text-gray-600 hover:text-gray-900 cursor-pointer">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}