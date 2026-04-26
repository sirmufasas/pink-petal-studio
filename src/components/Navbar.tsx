import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PHONE_NUMBER, PHONE_HREF } from "@/lib/booking-store";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "My Work", path: "/portfolio" },
  { label: "Book Now", path: "/book" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-display text-xl md:text-2xl font-bold text-foreground">
            Kim's <span className="text-gradient-pink">Glam Lab</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={PHONE_HREF}
            className="hidden sm:flex items-center gap-2 text-sm font-body text-primary hover:text-primary/80 transition-colors"
          >
            <Phone className="h-4 w-4" />
            {PHONE_NUMBER}
          </a>
          <button
            className="text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-background border-b border-border"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-body text-sm tracking-widest uppercase ${
                    location.pathname === item.path
                      ? "text-primary font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={PHONE_HREF}
                className="sm:hidden flex items-center gap-2 text-sm font-body text-primary"
              >
                <Phone className="h-4 w-4" />
                {PHONE_NUMBER}
              </a>
              <Link to="/admin" onClick={() => setIsOpen(false)}>
                <span className="font-body text-xs text-muted-foreground uppercase tracking-widest">
                  Admin
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
