import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-secondary/50 border-t border-border py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">
            Glow<span className="text-gradient-pink">Nails</span>
          </span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground font-body">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
          <Link to="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link>
          <Link to="/book" className="hover:text-primary transition-colors">Book Now</Link>
        </div>
        <p className="text-xs text-muted-foreground font-body">
          © 2026 GlowNails. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
