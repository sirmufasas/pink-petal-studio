import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteData, waLink } from "@/lib/content";
import logo from "@/assets/logo.jpg";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "My Work", path: "/portfolio" },
  { label: "Reviews", path: "/reviews" },
  { label: "Nail Studio", path: "/studio" },
  { label: "Book Now", path: "/book" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const data = useSiteData();
  const announcement = data?.settings.announcement?.trim() || "";
  const wa = data?.settings.whatsappNumber || "27719843649";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      {/* Global announcement bar — editable from Admin → Site Settings */}
      {announcement && (
        <div className="bg-gradient-hero text-primary-foreground text-center px-4 py-2 font-body text-sm">
          <Megaphone className="inline h-3.5 w-3.5 mr-2 -mt-0.5" />
          {announcement}
        </div>
      )}
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Kim's Glam Lab logo" className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover ring-2 ring-primary/40 shadow-soft" />
          <span className="font-display text-xl md:text-2xl font-bold text-foreground">
            Kim's <span className="text-gradient-pink">Glam Lab</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={waLink(wa, "Hi Kim! 💖")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact on WhatsApp"
            className="p-2.5 rounded-full bg-gradient-hero text-primary-foreground shadow-soft hover:opacity-90 transition-opacity"
          >
            <Phone className="h-4 w-4" />
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
