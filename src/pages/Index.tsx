import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Calendar, Star, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteData, minPrice } from "@/lib/content";
import heroLashes from "@/assets/hero-lashes.jpg";
import browsImg from "@/assets/portfolio/brows-sculpted.jpg";

const CARD_ICONS = [Eye, Heart, Star, Sparkles];

const Index = () => {
  const data = useSiteData();
  const s = data?.settings;
  const cats = (data?.services || []).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroLashes} alt="Dramatic lash extensions" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-body tracking-[0.3em] uppercase text-primary">
                Lashes • Brows • Makeup
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 text-foreground">
              {s?.heroTitle || "Lashes, Brows & Makeup"}
              <br />
              <span className="text-gradient-pink">{s?.heroTagline || "That Speak Beauty"}</span>
            </h1>
            <p className="text-lg text-muted-foreground font-body mb-10 max-w-lg leading-relaxed">
              Wispy cluster lashes, sculpted brows and pro glam makeup — from soft everyday
              beauty to full bridal beats. Every lash, every brow, crafted with precision and passion.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/book">
                <Button variant="hero" size="lg" className="text-base px-10 py-6">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                </Button>
              </Link>
              <Link to="/portfolio" aria-label="View my work">
                <Button variant="hero-outline" size="lg" className="text-base px-10 py-6">
                  View My Work
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-body tracking-[0.3em] uppercase text-primary">What I Offer</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">My Services</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {cats.map((cat, i) => {
              const Icon = CARD_ICONS[i % CARD_ICONS.length];
              const from = minPrice(cat);
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 text-center hover:shadow-glow transition-shadow duration-500"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-hero mx-auto mb-5 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2 text-foreground">{cat.category}</h3>
                  <p className="text-primary font-display text-2xl font-bold mb-3">
                    {isFinite(from) ? `from R${from}` : ""}
                  </p>
                  <p className="text-muted-foreground font-body text-sm">
                    {cat.items.map((it) => it.name).join(" • ")}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="hero-outline" size="lg">View All Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About / CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={browsImg}
                alt="Sculpted brows by Kim's Glam Lab"
                className="rounded-2xl shadow-glow w-full aspect-[4/3] object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-body tracking-[0.3em] uppercase text-primary">About Me</span>
              <h2 className="font-display text-4xl font-bold mt-3 mb-6 text-foreground">
                Passion for <span className="text-gradient-pink">Perfection</span>
              </h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-6">
                With years of experience in lashes, brows and makeup, I bring creativity and
                precision to every appointment. Whether you want wispy cluster lashes, perfectly
                sculpted brows, or a full glam beat — I've got you covered.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed mb-8">
                I use only premium products so your lashes and makeup look stunning and last all
                day. Book your appointment today and let's create something beautiful together!
              </p>
              <Link to="/book">
                <Button variant="hero" size="lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
