import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { WHATSAPP_HREF } from "@/lib/booking-store";
import logo from "@/assets/logo.jpg";

const Footer = () => (
  <footer className="bg-secondary/50 border-t border-border py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Kim's Glam Lab logo" className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/40" />
          <span className="font-display text-xl font-bold text-foreground">
            Kim's <span className="text-gradient-pink">Glam Lab</span>
          </span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground font-body">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
          <Link to="/portfolio" className="hover:text-primary transition-colors">My Work</Link>
          <Link to="/book" className="hover:text-primary transition-colors">Book Now</Link>
        </div>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact on WhatsApp"
          className="p-2.5 rounded-full bg-gradient-hero text-primary-foreground shadow-soft hover:opacity-90 transition-opacity"
        >
          <Phone className="h-4 w-4" />
        </a>
      </div>
      <p className="text-center text-xs text-muted-foreground font-body mt-8">
        © 2026 Kim's Glam Lab. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
