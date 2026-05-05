import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles, ShieldCheck } from "lucide-react";

const services = [
  { category: "Nails", items: [
    { name: "Gel Polish Manicure", price: "R200", duration: "1 hr" },
    { name: "Gel Polish Pedicure", price: "R200", duration: "1 hr" },
    { name: "Short Nails (Acrylic / Polygel)", price: "R150", duration: "1.5 hrs" },
    { name: "Medium Nails (Acrylic / Polygel)", price: "R180", duration: "1.5 hrs" },
    { name: "Long Nails (Acrylic / Polygel)", price: "R200", duration: "2 hrs" },
    { name: "Buff and Shine", price: "R100", duration: "30 min" },
    { name: "Soak-off", price: "R100", duration: "30 min" },
  ]},
  { category: "Eyelash Extensions", items: [
    { name: "Temporary Extensions", price: "R50", duration: "20 min" },
    { name: "Classic Set", price: "R150", duration: "1 hr" },
    { name: "Cat-eye Set", price: "R250", duration: "1.5 hrs" },
    { name: "Volume Set", price: "R300", duration: "2 hrs" },
  ]},
  { category: "Makeup", items: [
    { name: "Soft Glam", price: "R250", duration: "1 hr" },
    { name: "Full Glam", price: "R350", duration: "1.5 hrs" },
    { name: "Evening Look", price: "R350", duration: "1.5 hrs" },
    { name: "Special Effects", price: "R350", duration: "1.5 hrs" },
    { name: "Bridal Look", price: "R600", duration: "2 hrs" },
  ]},
];

const policy = [
  "Based in Winchester Hills, Johannesburg.",
  "Only 1 extra person is allowed to tag along for your appointment as there is limited space.",
  "A refundable deposit of 15% is required to secure your appointment.",
  "You will not be charged for being late, HOWEVER please let me know at least 15 minutes before your set time.",
  "I am home based and for my safety, the address will be sent to you after you have paid your deposit.",
  "Please send POP to 0655524358.",
  "An extra R100 will be added for call-out fee except for makeup clients in Johannesburg.",
];

const Services = () => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-sm font-body tracking-[0.3em] uppercase text-primary">Pricing</span>
        </div>
        <h1 className="font-display text-5xl font-bold text-foreground">Services & Prices</h1>
        <p className="text-muted-foreground font-body mt-4 max-w-lg mx-auto">
          Quality nails & makeup at fair prices. All services include prep & finishing touches.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-12">
        {services.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: gi * 0.1 }}
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-gradient-pink inline-block">
              {group.category}
            </h2>
            <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden divide-y divide-border/50">
              {group.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between px-6 py-5 hover:bg-secondary/30 transition-colors">
                  <div>
                    <h3 className="font-body font-bold text-foreground">{item.name}</h3>
                    {item.duration && (
                      <span className="text-xs text-muted-foreground font-body">{item.duration}</span>
                    )}
                  </div>
                  <span className="font-display text-xl font-bold text-primary">{item.price}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Studio Policy */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mt-20"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-sm font-body tracking-[0.3em] uppercase text-primary">The Fine Print</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-8">
          Studio <span className="text-gradient-pink">Policy</span>
        </h2>
        <div className="bg-card rounded-2xl border border-border/50 shadow-soft p-8 space-y-4">
          {policy.map((p, i) => (
            <div key={i} className="flex gap-3">
              <span className="font-display text-primary font-bold">✦</span>
              <p className="text-foreground/90 font-body leading-relaxed">{p}</p>
            </div>
          ))}
          <p className="text-center font-display text-lg font-bold text-primary pt-4 border-t border-border/50">
            STRICTLY NO FAVOURS!!
          </p>
          <p className="text-center font-body text-sm text-muted-foreground">
            Contact: <a href="tel:+27655524358" className="text-primary font-bold">065 552 4358</a>
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <p className="text-muted-foreground font-body mb-6">
          Ready to book? Choose your service and pick a time that works for you.
        </p>
        <Link to="/book">
          <Button variant="hero" size="lg" className="px-12 py-6 text-base">
            <Calendar className="mr-2 h-5 w-5" />
            Book Appointment
          </Button>
        </Link>
      </motion.div>
    </div>
  </div>
);

export default Services;
