import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Calendar, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-nails.jpg";
import salonImg from "@/assets/gallery-sample-2.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Beautiful nail art" className="w-full h-full object-cover" />
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
                Nails • Makeup • Glam
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 text-foreground">
              Nails & Makeup
              <br />
              <span className="text-gradient-pink">That Speak Beauty</span>
            </h1>
            <p className="text-lg text-muted-foreground font-body mb-10 max-w-lg leading-relaxed">
              Luxury nail artistry and pro makeup looks — from soft glam to full bridal beauty.
              Every set, every face, crafted with precision and passion.
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
            {[
              { icon: Sparkles, title: "Acrylic Full Set", price: "R450+", desc: "Custom shaped acrylics with your choice of design" },
              { icon: Heart, title: "Gel Manicure", price: "R300+", desc: "Long-lasting gel polish with cuticle care" },
              { icon: Star, title: "Glam Makeup", price: "R550+", desc: "Soft glam, full glam, bridal & event makeup" },
            ].map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 text-center hover:shadow-glow transition-shadow duration-500"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-hero mx-auto mb-5 flex items-center justify-center">
                  <service.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2 text-foreground">{service.title}</h3>
                <p className="text-primary font-display text-2xl font-bold mb-3">{service.price}</p>
                <p className="text-muted-foreground font-body text-sm">{service.desc}</p>
              </motion.div>
            ))}
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
                src={salonImg}
                alt="Our salon"
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
                With years of experience in nails and makeup, I bring creativity and precision
                to every appointment. Whether you want a subtle, classy look, bold nail art,
                or a full glam beat — I've got you covered.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed mb-8">
                I use only premium products so your nails and makeup look stunning and last all day.
                Book your appointment today and let's create something beautiful together!
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
