import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles } from "lucide-react";

const services = [
  { category: "Acrylic Nails", items: [
    { name: "Acrylic Full Set", price: "R450", duration: "2 hrs" },
    { name: "Acrylic Fill", price: "R300", duration: "1.5 hrs" },
    { name: "Acrylic Removal", price: "R150", duration: "30 min" },
    { name: "Acrylic Full Set + Design", price: "R600+", duration: "2.5 hrs" },
  ]},
  { category: "Gel Nails", items: [
    { name: "Gel Manicure", price: "R300", duration: "1 hr" },
    { name: "Gel Pedicure", price: "R380", duration: "1.5 hrs" },
    { name: "Gel-X Full Set", price: "R500", duration: "1.5 hrs" },
    { name: "Gel Removal", price: "R100", duration: "20 min" },
  ]},
  { category: "Nail Art & Extras", items: [
    { name: "Simple Nail Art (per nail)", price: "R30+", duration: "" },
    { name: "Complex Design (per nail)", price: "R70+", duration: "" },
    { name: "Chrome / Ombré", price: "R120+", duration: "30 min" },
    { name: "Rhinestones & Charms", price: "R80+", duration: "20 min" },
    { name: "Nail Repair (per nail)", price: "R70", duration: "15 min" },
  ]},
  { category: "Makeup", items: [
    { name: "Soft Glam Makeup", price: "R550", duration: "1 hr" },
    { name: "Full Glam Makeup", price: "R750", duration: "1.5 hrs" },
    { name: "Bridal Makeup", price: "R1500", duration: "2 hrs" },
    { name: "Matric Dance / Special Event", price: "R900", duration: "1.5 hrs" },
    { name: "Makeup + Lashes", price: "R650", duration: "1.5 hrs" },
    { name: "Lashes Only (Strip)", price: "R150", duration: "15 min" },
  ]},
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
