import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Sparkles, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const serviceOptions = [
  "Acrylic Full Set",
  "Acrylic Fill",
  "Gel Manicure",
  "Gel Pedicure",
  "Gel-X Full Set",
  "Nail Art & Design",
  "Other",
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

const BookAppointment = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.service || !form.date || !form.time) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitted(true);
    toast.success("Appointment request sent!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-hero mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-primary-foreground" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Request Sent!
          </h2>
          <p className="text-muted-foreground font-body mb-2">
            Thank you, <strong className="text-foreground">{form.name}</strong>!
          </p>
          <p className="text-muted-foreground font-body mb-8">
            Your appointment for <strong className="text-primary">{form.service}</strong> on{" "}
            <strong className="text-foreground">{form.date}</strong> at{" "}
            <strong className="text-foreground">{form.time}</strong> has been requested. 
            I'll confirm via text/email shortly!
          </p>
          <Button variant="hero" onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", service: "", date: "", time: "", notes: "" }); }}>
            Book Another
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-body tracking-[0.3em] uppercase text-primary">Appointments</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-foreground">Book Now</h1>
          <p className="text-muted-foreground font-body mt-4 max-w-lg mx-auto">
            Pick your service, choose a date & time, and I'll get back to you to confirm!
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-card rounded-2xl border border-border/50 shadow-soft p-8 space-y-6"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-bold text-foreground mb-2">Name *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-body font-bold text-foreground mb-2">Phone *</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="bg-background"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-body font-bold text-foreground mb-2">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              className="bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-body font-bold text-foreground mb-2">Service *</label>
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, service: s })}
                  className={`px-4 py-2 rounded-full text-sm font-body border transition-all ${
                    form.service === s
                      ? "bg-primary text-primary-foreground border-primary shadow-soft"
                      : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-bold text-foreground mb-2">Preferred Date *</label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-body font-bold text-foreground mb-2">Preferred Time *</label>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, time: t })}
                    className={`px-3 py-1.5 rounded-full text-xs font-body border transition-all ${
                      form.time === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-body font-bold text-foreground mb-2">Notes / Inspo</label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Describe what you want, share inspo pics, etc."
              rows={3}
              className="bg-background"
            />
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full py-6 text-base">
            <Calendar className="mr-2 h-5 w-5" />
            Request Appointment
          </Button>
        </motion.form>
      </div>
    </div>
  );
};

export default BookAppointment;
