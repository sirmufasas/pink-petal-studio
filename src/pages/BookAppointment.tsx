import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Calendar, Sparkles, CheckCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  TIME_SLOTS,
  addBooking,
  getBookedTimes,
  getBlockedDays,
  isDayFullyBooked,
  WHATSAPP_HREF,
} from "@/lib/booking-store";
import { cn } from "@/lib/utils";

const serviceOptions = [
  "Acrylic Full Set — R450",
  "Acrylic Fill — R300",
  "Gel Manicure — R300",
  "Gel Pedicure — R380",
  "Gel-X Full Set — R500",
  "Nail Art & Design — R30+/nail",
  "Soft Glam Makeup — R550",
  "Full Glam Makeup — R750",
  "Bridal Makeup — R1500",
  "Matric / Event Makeup — R900",
  "Other",
];

const BookAppointment = () => {
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    time: "",
    notes: "",
  });

  const dateStr = date ? format(date, "yyyy-MM-dd") : "";
  const blockedDays = useMemo(() => getBlockedDays(), [submitted]);
  const bookedTimes = useMemo(() => (dateStr ? getBookedTimes(dateStr) : []), [dateStr, submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return toast.error("Please enter your name");
    if (!form.phone) return toast.error("Please enter your phone number");
    if (!date) return toast.error("Please pick a date");
    if (!form.time) return toast.error("Please select a time slot");
    if (!form.service) return toast.error("Please select a service");
    addBooking({
      name: form.name,
      phone: form.phone,
      email: form.email,
      service: form.service,
      date: dateStr,
      time: form.time,
      notes: form.notes,
    });

    const msg =
      `Hi Kim! I'd like to book an appointment 💖\n\n` +
      `*Name:* ${form.name}\n` +
      `*Phone:* ${form.phone}\n` +
      (form.email ? `*Email:* ${form.email}\n` : "") +
      `*Service:* ${form.service}\n` +
      `*Date:* ${format(date, "EEE, dd MMM yyyy")}\n` +
      `*Time:* ${form.time}\n` +
      (form.notes ? `*Notes:* ${form.notes}\n` : "");
    const waUrl = `${WHATSAPP_HREF}&text=${encodeURIComponent(msg)}`;
    setWhatsappUrl(waUrl);
    setWhatsappMessage(msg);

    setSubmitted(true);
    toast.success("Booking details are ready to send");
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
          <p className="text-muted-foreground font-body mb-6">
            Your booking for <strong className="text-primary">{form.service}</strong> on{" "}
            <strong className="text-foreground">{dateStr}</strong> at{" "}
            <strong className="text-foreground">{form.time}</strong> is ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <a
              href={whatsappUrl || WHATSAPP_HREF}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-hero text-primary-foreground shadow-soft hover:opacity-90 transition-opacity font-body font-bold"
            >
              <Phone className="h-5 w-5" />
              Open WhatsApp App
            </a>
            <Button
              type="button"
              variant="hero-outline"
              className="px-8 py-4 rounded-full"
              onClick={async () => {
                await navigator.clipboard.writeText(whatsappMessage);
                toast.success("Booking message copied");
              }}
            >
              Copy Message
            </Button>
          </div>
          <p className="text-xs text-muted-foreground font-body mb-6">
            If WhatsApp is blocked in preview, copy the message and paste it into WhatsApp.
          </p>
          <div>
            <Button
              variant="hero-outline"
              onClick={() => {
                setSubmitted(false);
                setDate(undefined);
                setWhatsappUrl("");
                setForm({ name: "", phone: "", email: "", service: "", time: "", notes: "" });
              }}
            >
              Book Another
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
            Pick an available day, choose your time and service, and Kim will confirm your booking.
          </p>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Kim"
            className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-hero text-primary-foreground shadow-soft mt-4"
          >
            <Phone className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-card rounded-2xl border border-border/50 shadow-soft p-8 space-y-6"
        >
          {/* Calendar */}
          <div>
            <label className="block text-sm font-body font-bold text-foreground mb-3">
              Pick a Date *
            </label>
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="bg-background rounded-xl border border-border/50 p-2 mx-auto">
                <CalendarUI
                  mode="single"
                  selected={date}
                  onSelect={(d) => { setDate(d); setForm({ ...form, time: "" }); }}
                  disabled={(d) => {
                    const ds = format(d, "yyyy-MM-dd");
                    return d < today || blockedDays.includes(ds);
                  }}
                  className={cn("p-3 pointer-events-auto")}
                />
              </div>
              <div className="flex-1 space-y-3 text-sm font-body">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Selected day</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-muted" />
                  <span className="text-muted-foreground">Unavailable / fully booked</span>
                </div>
                {date && (
                  <p className="text-foreground font-bold pt-2">
                    {format(date, "EEEE, dd MMMM yyyy")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Time slots */}
          {date && (
            <div>
              <label className="block text-sm font-body font-bold text-foreground mb-2">
                Available Times *
              </label>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((t) => {
                  const taken = bookedTimes.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={taken}
                      onClick={() => setForm({ ...form, time: t })}
                      className={`px-4 py-2 rounded-full text-sm font-body border transition-all ${
                        taken
                          ? "bg-muted text-muted-foreground border-muted cursor-not-allowed line-through opacity-60"
                          : form.time === t
                          ? "bg-primary text-primary-foreground border-primary shadow-soft"
                          : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Service */}
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

          {/* Personal info */}
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
                placeholder="071 234 5678"
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
            <label className="block text-sm font-body font-bold text-foreground mb-2">Notes / Inspo</label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Describe what you want, share inspo, etc."
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
