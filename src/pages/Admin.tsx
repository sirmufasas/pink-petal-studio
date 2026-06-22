import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Trash2, ImagePlus, Sparkles, CalendarDays, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getGalleryItems, addGalleryItem, deleteGalleryItem } from "@/lib/gallery-store";
import type { GalleryItem } from "@/lib/gallery-store";
import {
  getBookings,
  deleteBooking,
  getBlockedDays,
  toggleBlockedDay,
  type Booking,
} from "@/lib/booking-store";

// ── Change this to your desired password ──────────────────────────────────────
const ADMIN_PASSWORD = "admin123";
const SESSION_KEY = "admin_unlocked";
// ─────────────────────────────────────────────────────────────────────────────

// ── Password Gate ─────────────────────────────────────────────────────────────
const PasswordGate = ({ onUnlock }: { onUnlock: () => void }) => {
  const [value, setValue] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onUnlock();
    } else {
      setShake(true);
      setValue("");
      setTimeout(() => setShake(false), 500);
      toast.error("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Lock icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-hero p-4 rounded-2xl shadow-glow">
            <Lock className="h-8 w-8 text-white" />
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">
          Admin Access
        </h1>
        <p className="text-muted-foreground font-body text-center text-sm mb-8">
          Enter your password to manage the portfolio.
        </p>

        <form onSubmit={handleSubmit}>
          <motion.div
            animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-2xl border border-border/50 shadow-soft p-6 space-y-4"
          >
            <div className="relative">
              <input
                ref={inputRef}
                type={showPw ? "text" : "password"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Password"
                className="w-full bg-background border border-border rounded-xl px-4 pr-12 py-3 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPw
                  ? <EyeOff className="h-4 w-4" />
                  : <Eye className="h-4 w-4" />
                }
              </button>
            </div>

            <Button variant="hero" className="w-full" type="submit">
              Unlock
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const AdminPanel = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDays, setBlockedDays] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);

  const refresh = async () => {
    try {
      const [g, b, d] = await Promise.all([
        getGalleryItems(),
        getBookings(),
        getBlockedDays(),
      ]);
      setItems(g);
      setBookings(b);
      setBlockedDays(d);
    } catch (e: any) {
      toast.error(e?.message || "Could not load data");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const blockedDates = useMemo(
    () => blockedDays.map((d) => new Date(d + "T00:00:00")),
    [blockedDays]
  );

  const handleToggleBlocked = async (d: Date | undefined) => {
    if (!d) return;
    const ds = format(d, "yyyy-MM-dd");
    try {
      const next = await toggleBlockedDay(ds);
      setBlockedDays(next);
      toast.success(next.includes(ds) ? "Day marked as unavailable" : "Day reopened");
    } catch (e: any) {
      toast.error(e?.message || "Could not update day");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteBooking(id);
      setBookings(await getBookings());
      toast.success("Booking removed");
    } catch (e: any) {
      toast.error(e?.message || "Could not delete booking");
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
      }
    } catch {
      toast.error("Could not access camera. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    setPreview(canvas.toDataURL("image/jpeg", 0.85));
    stopCamera();
  };

  const handleSave = () => {
    if (!preview) { toast.error("Please add an image first"); return; }
    if (!description.trim()) { toast.error("Please add a description"); return; }
    addGalleryItem({ imageUrl: preview, description: description.trim() });
    setItems(getGalleryItems());
    setPreview(null);
    setDescription("");
    toast.success("Photo added to portfolio! 🎉");
  };

  const handleDelete = (id: string) => {
    deleteGalleryItem(id);
    setItems(getGalleryItems());
    toast.success("Photo removed");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-body tracking-[0.3em] uppercase text-primary">Admin Panel</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">Manage Portfolio</h1>
          <p className="text-muted-foreground font-body mt-3">
            Take photos or upload images of your nails & makeup work.
          </p>
        </motion.div>

        {/* Upload / Camera Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-card rounded-2xl border border-border/50 shadow-soft p-4 sm:p-8">
            <div className="flex gap-2 mb-6">
              <Button
                variant={mode === "upload" ? "default" : "outline"}
                onClick={() => { setMode("upload"); stopCamera(); }}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
              <Button
                variant={mode === "camera" ? "default" : "outline"}
                onClick={() => setMode("camera")}
                className="flex-1"
              >
                <Camera className="mr-2 h-4 w-4" />
                Camera
              </Button>
            </div>

            {mode === "upload" && !preview && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 sm:p-12 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <ImagePlus className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground font-body text-sm sm:text-base">
                  Click to upload or drag & drop
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            {mode === "camera" && !preview && (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden bg-foreground/5 aspect-[4/3]">
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                  {!streaming && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button variant="hero" onClick={startCamera}>
                        <Camera className="mr-2 h-5 w-5" />
                        Start Camera
                      </Button>
                    </div>
                  )}
                </div>
                {streaming && (
                  <Button variant="hero" className="w-full" onClick={capturePhoto}>
                    <Camera className="mr-2 h-5 w-5" />
                    Take Photo
                  </Button>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {preview && (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden">
                  <img src={preview} alt="Preview" className="w-full rounded-xl" />
                  <button
                    onClick={() => setPreview(null)}
                    className="absolute top-3 right-3 bg-destructive text-destructive-foreground rounded-full p-2 hover:opacity-80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-body font-bold text-foreground mb-2">
                    Description *
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this nail set… e.g. 'Pink ombré with crystal accents'"
                    rows={2}
                    className="bg-background"
                  />
                </div>
                <Button variant="hero" className="w-full" onClick={handleSave}>
                  <ImagePlus className="mr-2 h-5 w-5" />
                  Add to Portfolio
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Existing items */}
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            Portfolio Items ({items.length})
          </h2>
          {items.length === 0 && (
            <p className="text-center text-muted-foreground font-body py-12">
              No photos yet. Upload or take your first photo above!
            </p>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-soft"
                >
                  <img src={item.imageUrl} alt={item.description} className="w-full aspect-square object-cover" />
                  <div className="p-4 flex items-start justify-between gap-2">
                    <p className="text-sm text-foreground font-body flex-1">{item.description}</p>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:opacity-70 transition-opacity shrink-0 mt-0.5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Booked Days Calendar */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground">Mark Booked Days</h2>
          </div>
          <p className="text-muted-foreground font-body mb-4 text-sm">
            Click a day to mark it as <strong className="text-destructive">booked / unavailable</strong>.
            Click again to reopen it.
          </p>
          <div className="bg-card rounded-2xl border border-border/50 shadow-soft p-4 inline-block w-full sm:w-auto">
            <CalendarUI
              mode="single"
              onSelect={handleToggleBlocked}
              modifiers={{ blocked: blockedDates }}
              modifiersClassNames={{ blocked: "bg-destructive/20 text-destructive line-through" }}
              className={cn("p-3 pointer-events-auto")}
            />
          </div>
          {blockedDays.length > 0 && (
            <p className="text-xs text-muted-foreground font-body mt-3">
              {blockedDays.length} day{blockedDays.length === 1 ? "" : "s"} marked as booked.
            </p>
          )}
        </div>

        {/* Bookings */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            Upcoming Bookings ({bookings.length})
          </h2>
          {bookings.length === 0 ? (
            <p className="text-center text-muted-foreground font-body py-12">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {bookings
                .slice()
                .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
                .map((b) => (
                  <div
                    key={b.id}
                    className="bg-card rounded-xl border border-border/50 p-4 flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-display text-lg font-bold text-foreground">{b.name}</span>
                        <span className="text-primary font-body text-sm">{b.service}</span>
                      </div>
                      <p className="text-sm text-muted-foreground font-body mt-1">
                        {format(new Date(b.date + "T00:00:00"), "EEE, dd MMM yyyy")} @ {b.time}
                      </p>
                      <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1 text-sm text-primary mt-1">
                        <Phone className="h-3 w-3" />
                        {b.phone}
                      </a>
                      {b.notes && (
                        <p className="text-xs text-muted-foreground italic mt-2 truncate">"{b.notes}"</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteBooking(b.id)}
                      className="text-destructive hover:opacity-70 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Root export — shows gate until unlocked ───────────────────────────────────
const Admin = () => {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  );

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return <AdminPanel />;
};

export default Admin;