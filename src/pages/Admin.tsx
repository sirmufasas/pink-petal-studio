import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Upload, Trash2, ImagePlus, Sparkles, CalendarDays, Lock, Eye, EyeOff,
  Plug, Plus, Save, Settings2, ListOrdered, Images, Star, ClipboardList, Phone,
  RefreshCw, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  useSiteData, fetchSiteData, saveSiteData, getToken, setToken, testConnection,
  addGalleryImage, deleteGalleryImage, resolveImage,
  type SiteData, type ServiceCategory, type ServiceItem, type Review,
} from "@/lib/content";
import { Stars } from "./Reviews";
import { getBookings, deleteBooking, type Booking } from "@/lib/booking-store";
import { googleCalUrl } from "@/lib/calendar";
import { parseHours } from "@/lib/content";

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
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-hero p-4 rounded-2xl shadow-glow">
            <Lock className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">Admin Access</h1>
        <p className="text-muted-foreground font-body text-center text-sm mb-8">
          Enter your password to manage the whole site.
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
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

type Tab = "photos" | "bookings" | "services" | "reviews" | "days" | "settings" | "connection";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "photos", label: "Photos", icon: Images },
  { id: "bookings", label: "Bookings", icon: ClipboardList },
  { id: "services", label: "Services & Prices", icon: ListOrdered },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "days", label: "Booked Days", icon: CalendarDays },
  { id: "settings", label: "Site Settings", icon: Settings2 },
  { id: "connection", label: "Connection", icon: Plug },
];

const AdminPanel = () => {
  const data = useSiteData();
  const [tab, setTab] = useState<Tab>(getToken() ? "photos" : "connection");
  const [saving, setSaving] = useState(false);

  const requireToken = () => {
    if (!getToken()) {
      toast.error("Connect your GitHub token first (Connection tab).");
      setTab("connection");
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-body tracking-[0.3em] uppercase text-primary">Admin Panel</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">Manage Your Site</h1>
          <p className="text-muted-foreground font-body mt-3 max-w-xl mx-auto">
            Everything you change here is published instantly to the live website for all visitors —
            photos, prices, services, announcements and booked days.
          </p>
        </motion.div>

        {!getToken() && (
          <div className="max-w-3xl mx-auto mb-6 bg-amber-500/10 border border-amber-500/40 rounded-xl p-4 text-sm font-body text-foreground">
            ⚠️ Not connected yet. Open the <strong>Connection</strong> tab and paste your GitHub
            access token once — it is stored only on this device so you can publish changes.
          </div>
        )}

        {/* Tabs */}
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2 justify-center mb-10">
          {TABS.map((t) => (
            <Button
              key={t.id}
              variant={tab === t.id ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(t.id)}
              className="rounded-full"
            >
              <t.icon className="mr-2 h-4 w-4" />
              {t.label}
            </Button>
          ))}
        </div>

        <div className="max-w-5xl mx-auto">
          {tab === "connection" && <ConnectionTab />}
          {tab === "bookings" && <BookingsTab />}
          {tab === "photos" && <PhotosTab data={data} requireToken={requireToken} setSaving={setSaving} saving={saving} />}
          {tab === "services" && <ServicesTab data={data} requireToken={requireToken} />}
          {tab === "reviews" && <ReviewsTab data={data} requireToken={requireToken} />}
          {tab === "days" && <DaysTab data={data} requireToken={requireToken} />}
          {tab === "settings" && <SettingsTab data={data} requireToken={requireToken} />}
        </div>
      </div>
    </div>
  );
};

// ── Bookings ──────────────────────────────────────────────────────────────────
const BookingsTab = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setBookings(await getBookings());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    try {
      await deleteBooking(id);
      await load();
      toast.success("Booking removed");
    } catch (e: any) {
      toast.error(e?.message || "Could not delete booking");
    }
  };

  const sorted = bookings.slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">
          All Bookings ({bookings.length})
        </h2>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>
      <p className="text-sm text-muted-foreground font-body">
        Everyone who books on the site appears here with what they want and when — bookings also
        land on your WhatsApp with a calendar link.
      </p>
      {sorted.length === 0 ? (
        <p className="text-center text-muted-foreground font-body py-12">No bookings yet.</p>
      ) : (
        sorted.map((b) => {
          const hours = parseHours(b.service.split("—")[1]);
          const [, itemName] = b.service.split(" — ");
          return (
            <div key={b.id} className="bg-card rounded-2xl border border-border/50 shadow-soft p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-display text-lg font-bold text-foreground">{b.name}</span>
                  <span className="text-primary font-body text-sm">{b.service}</span>
                </div>
                <p className="text-sm text-muted-foreground font-body mt-1">
                  {format(new Date(b.date + "T00:00:00"), "EEE, dd MMM yyyy")} @ {b.time}
                </p>
                <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1 text-sm text-primary mt-1">
                  <Phone className="h-3 w-3" /> {b.phone}
                </a>
                {b.notes && <p className="text-xs text-muted-foreground italic mt-2">"{b.notes}"</p>}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <a
                  href={googleCalUrl({
                    title: `Kim's Glam Lab — ${itemName || b.service}`,
                    description: `Booking: ${b.name} (${b.phone})\nService: ${b.service}${b.notes ? `\nNotes: ${b.notes}` : ""}`,
                    date: b.date,
                    time: b.time,
                    hours,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" /> Add to my calendar
                </a>
                <button onClick={() => remove(b.id)} className="inline-flex items-center gap-1 text-xs text-destructive hover:opacity-70">
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

// ── Connection ─────────────────────────────────────────────────────────────────
const ConnectionTab = () => {
  const [token, setTokenValue] = useState(getToken());
  const [login, setLogin] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const test = async (t: string) => {
    setBusy(true);
    setToken(t);
    try {
      const user = await testConnection();
      setLogin(user);
      toast.success(`Connected as @${user} ✅`);
    } catch (e: any) {
      setLogin(null);
      toast.error(e?.message || "Connection failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-card rounded-2xl border border-border/50 shadow-soft p-6 sm:p-8 space-y-5">
      <h2 className="font-display text-2xl font-bold text-foreground">GitHub Connection</h2>
      <p className="text-sm text-muted-foreground font-body leading-relaxed">
        Your website's content (photos, prices, settings) is stored in your GitHub repository.
        Paste a GitHub personal access token with <strong>repo contents</strong> permission once —
        it stays saved only in this browser and powers the Publish buttons.
      </p>
      <div className="space-y-2">
        <label className="text-sm font-body font-bold text-foreground">Access token</label>
        <Input
          type="password"
          value={token}
          onChange={(e) => setTokenValue(e.target.value)}
          placeholder="github_pat_…"
          className="bg-background"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="hero" onClick={() => test(token)} disabled={busy || !token.trim()}>
          <Plug className="mr-2 h-4 w-4" />
          Save & Test Connection
        </Button>
        {getToken() && (
          <Button
            variant="outline"
            onClick={() => {
              setToken("");
              setTokenValue("");
              setLogin(null);
              toast.success("Token removed from this device");
            }}
          >
            Disconnect
          </Button>
        )}
      </div>
      {login && (
        <p className="text-sm font-body text-primary">
          Connected as <strong>@{login}</strong> — you can now publish changes.
        </p>
      )}
      <p className="text-xs text-muted-foreground font-body">
        Tip: create a fine-grained token for the <em>pink-petal-studio</em> repository with
        "Contents: Read & write" permission only.
      </p>
    </div>
  );
};

// ── Photos (global gallery) ───────────────────────────────────────────────────
const PhotosTab = ({
  data, requireToken, saving, setSaving,
}: {
  data: SiteData | null;
  requireToken: () => boolean;
  saving: boolean;
  setSaving: (b: boolean) => void;
}) => {
  const items = data?.gallery || [];
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
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
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
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

  const handleSave = async () => {
    if (!requireToken()) return;
    if (!preview) return toast.error("Please add an image first");
    if (!description.trim()) return toast.error("Please add a description");
    setSaving(true);
    try {
      await addGalleryImage(preview, description.trim());
      setPreview(null);
      setDescription("");
      toast.success("Photo published — anyone with your link can now see it! 🎉");
    } catch (e: any) {
      toast.error(e?.message || "Could not upload photo");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!requireToken()) return;
    try {
      await deleteGalleryImage(id);
      toast.success("Photo removed from the site");
    } catch (e: any) {
      toast.error(e?.message || "Could not delete photo");
    }
  };

  return (
    <div className="space-y-10">
      <div className="max-w-2xl mx-auto bg-card rounded-2xl border border-border/50 shadow-soft p-4 sm:p-8">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Add a Photo</h2>
        <p className="text-sm text-muted-foreground font-body mb-6">
          Photos are published to your website's online storage — <strong>anyone who opens your
          link</strong> will see them on the <strong>My Work</strong> page (they no longer stay on
          your device).
        </p>
        <div className="flex gap-2 mb-6">
          <Button
            variant={mode === "upload" ? "default" : "outline"}
            onClick={() => { setMode("upload"); stopCamera(); }}
            className="flex-1"
          >
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
          <Button variant={mode === "camera" ? "default" : "outline"} onClick={() => setMode("camera")} className="flex-1">
            <Camera className="mr-2 h-4 w-4" /> Camera
          </Button>
        </div>

        {mode === "upload" && !preview && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 sm:p-12 text-center cursor-pointer hover:border-primary transition-colors"
          >
            <ImagePlus className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground font-body text-sm sm:text-base">Click to upload or drag & drop</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        )}

        {mode === "camera" && !preview && (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-foreground/5 aspect-[4/3]">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              {!streaming && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="hero" onClick={startCamera}>
                    <Camera className="mr-2 h-5 w-5" /> Start Camera
                  </Button>
                </div>
              )}
            </div>
            {streaming && (
              <Button variant="hero" className="w-full" onClick={capturePhoto}>
                <Camera className="mr-2 h-5 w-5" /> Take Photo
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
              <label className="block text-sm font-body font-bold text-foreground mb-2">Description *</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 'Wispy cat-eye clusters 💕'"
                rows={2}
                className="bg-background"
              />
            </div>
            <Button variant="hero" className="w-full" onClick={handleSave} disabled={saving}>
              <ImagePlus className="mr-2 h-5 w-5" />
              {saving ? "Publishing…" : "Publish to Site"}
            </Button>
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
          Live on the Site ({items.length})
        </h2>
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
                <img src={resolveImage(item.path)} alt={item.description} className="w-full aspect-square object-cover" />
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
    </div>
  );
};

// ── Services & prices ─────────────────────────────────────────────────────────
const ServicesTab = ({ data, requireToken }: { data: SiteData | null; requireToken: () => boolean }) => {
  const [draft, setDraft] = useState<ServiceCategory[]>(() => JSON.parse(JSON.stringify(data?.services || [])));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) setDraft(JSON.parse(JSON.stringify(data.services)));
  }, [data?.services]);

  const updateItem = (ci: number, ii: number, patch: Partial<ServiceItem>) => {
    const next = [...draft];
    next[ci].items[ii] = { ...next[ci].items[ii], ...patch };
    setDraft(next);
  };

  const save = async () => {
    if (!requireToken()) return;
    const cleaned = draft
      .map((c) => ({
        ...c,
        category: c.category.trim() || "Category",
        items: c.items.filter((i) => i.name.trim()),
      }))
      .filter((c) => c.items.length > 0);
    setBusy(true);
    try {
      const full = await fetchSiteData(false);
      full.services = cleaned;
      await saveSiteData(full, "🛠️ Update services & prices");
      toast.success("Prices published to the live site ✅");
    } catch (e: any) {
      toast.error(e?.message || "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      <p className="text-xs text-muted-foreground font-body text-center -mt-4">
        Tip: leave a price blank to list the service without showing a price (like your nail services).
      </p>
      {draft.map((cat, ci) => (
        <div key={cat.id} className="bg-card rounded-2xl border border-border/50 shadow-soft p-6">
          <div className="flex items-center gap-3 mb-4">
            <Input
              value={cat.category}
              onChange={(e) => {
                const next = [...draft];
                next[ci].category = e.target.value;
                setDraft(next);
              }}
              className="bg-background font-bold max-w-xs"
            />
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/40 hover:text-destructive"
              onClick={() => setDraft(draft.filter((_, i) => i !== ci))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {cat.items.map((item, ii) => (
              <div key={ii} className="grid grid-cols-[1fr_90px_90px_36px] gap-2 items-center">
                <Input
                  value={item.name}
                  placeholder="Service name"
                  onChange={(e) => updateItem(ci, ii, { name: e.target.value })}
                  className="bg-background"
                />
                <Input
                  value={item.price}
                  placeholder="R000"
                  onChange={(e) => updateItem(ci, ii, { price: e.target.value })}
                  className="bg-background"
                />
                <Input
                  value={item.duration || ""}
                  placeholder="1 hr"
                  onChange={(e) => updateItem(ci, ii, { duration: e.target.value })}
                  className="bg-background"
                />
                <button
                  onClick={() => {
                    const next = [...draft];
                    next[ci].items = next[ci].items.filter((_, i) => i !== ii);
                    setDraft(next);
                  }}
                  className="text-destructive hover:opacity-70"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              const next = [...draft];
              next[ci].items.push({ name: "", price: "R", duration: "" });
              setDraft(next);
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> Add item
          </Button>
        </div>
      ))}

      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          variant="outline"
          onClick={() =>
            setDraft([
              ...draft,
              { id: `cat-${Date.now()}`, category: "New Category", items: [{ name: "", price: "R", duration: "" }] },
            ])
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Add category
        </Button>
        <Button variant="hero" onClick={save} disabled={busy}>
          <Save className="mr-2 h-4 w-4" />
          {busy ? "Publishing…" : "Publish Changes"}
        </Button>
      </div>
    </div>
  );
};

// ── Reviews ───────────────────────────────────────────────────────────────────
const ReviewsTab = ({ data, requireToken }: { data: SiteData | null; requireToken: () => boolean }) => {
  const [draft, setDraft] = useState<Review[]>(() => JSON.parse(JSON.stringify(data?.reviews || [])));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) setDraft(JSON.parse(JSON.stringify(data.reviews)));
  }, [data?.reviews]);

  const update = (i: number, patch: Partial<Review>) => {
    const next = [...draft];
    next[i] = { ...next[i], ...patch };
    setDraft(next);
  };

  const save = async () => {
    if (!requireToken()) return;
    const cleaned = draft.filter((r) => r.name.trim() && r.text.trim());
    setBusy(true);
    try {
      const full = await fetchSiteData(false);
      full.reviews = cleaned;
      await saveSiteData(full, "⭐ Update reviews");
      toast.success("Reviews published to the live site ✅");
    } catch (e: any) {
      toast.error(e?.message || "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto text-center text-sm text-muted-foreground font-body">
        Add your Google reviews here (copy them from your Google listing) or publish reviews
        clients sent you — they appear on the Reviews page for everyone.
      </div>
      {draft.map((r, i) => (
        <div key={r.id} className="max-w-2xl mx-auto bg-card rounded-2xl border border-border/50 shadow-soft p-6 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Input value={r.name} placeholder="Client name" onChange={(e) => update(i, { name: e.target.value })} className="bg-background max-w-xs" />
            <div className="flex items-center gap-3">
              <select
                value={r.rating}
                onChange={(e) => update(i, { rating: Number(e.target.value) })}
                className="bg-background border border-border rounded-lg px-2 py-1.5 text-sm font-body text-foreground"
              >
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
              <select
                value={r.source}
                onChange={(e) => update(i, { source: e.target.value as Review["source"] })}
                className="bg-background border border-border rounded-lg px-2 py-1.5 text-sm font-body text-foreground"
              >
                <option value="Google">Google</option>
                <option value="Site">Client</option>
              </select>
              <button onClick={() => setDraft(draft.filter((_, x) => x !== i))} className="text-destructive hover:opacity-70">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <Stars n={r.rating} size="h-4 w-4" />
          <Textarea value={r.text} rows={3} placeholder="Review text" onChange={(e) => update(i, { text: e.target.value })} className="bg-background" />
        </div>
      ))}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          variant="outline"
          onClick={() =>
            setDraft([
              ...draft,
              { id: `rev-${Date.now()}`, name: "", rating: 5, text: "", source: "Google", createdAt: new Date().toISOString() },
            ])
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Add review
        </Button>
        <Button variant="hero" onClick={save} disabled={busy}>
          <Save className="mr-2 h-4 w-4" />
          {busy ? "Publishing…" : "Publish Reviews"}
        </Button>
      </div>
    </div>
  );
};

// ── Booked days ───────────────────────────────────────────────────────────────
const DaysTab = ({ data, requireToken }: { data: SiteData | null; requireToken: () => boolean }) => {
  // local state = instant select AND unselect (no stale re-fetches)
  const [local, setLocal] = useState<string[] | null>(null);
  useEffect(() => {
    if (data && local === null) setLocal(data.blockedDays);
  }, [data, local]);

  const blockedDays = local ?? data?.blockedDays ?? [];
  const blockedDates = useMemo(() => blockedDays.map((d) => new Date(d + "T00:00:00")), [blockedDays]);

  const handleToggle = async (d: Date | undefined) => {
    if (!d) return;
    if (!requireToken()) return;
    const ds = format(d, "yyyy-MM-dd");
    const next = blockedDays.includes(ds)
      ? blockedDays.filter((x) => x !== ds)
      : [...blockedDays, ds];
    setLocal(next); // optimistic — unselect works immediately
    try {
      const full = await fetchSiteData(false);
      full.blockedDays = next;
      await saveSiteData(full, "📅 Update booked days");
      toast.success(next.includes(ds) ? "Day marked as unavailable" : "Day reopened");
    } catch (e: any) {
      toast.error(e?.message || "Could not update day");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-card rounded-2xl border border-border/50 shadow-soft p-6 sm:p-8">
      <h2 className="font-display text-2xl font-bold text-foreground mb-2">Mark Booked / Unavailable Days</h2>
      <p className="text-sm text-muted-foreground font-body mb-6">
        Click a day to block it from the booking calendar (click again to reopen). Changes publish
        instantly. Bookings themselves arrive on your WhatsApp with a calendar link.
      </p>
      <div className="inline-block w-full sm:w-auto">
        <CalendarUI
          mode="single"
          onSelect={handleToggle}
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
  );
};

// ── Settings ──────────────────────────────────────────────────────────────────
const SettingsTab = ({ data, requireToken }: { data: SiteData | null; requireToken: () => boolean }) => {
  const s = data?.settings;
  const [draft, setDraft] = useState({ ...s });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (s) setDraft({ ...s });
  }, [data?.settings]);

  const save = async () => {
    if (!requireToken()) return;
    setBusy(true);
    try {
      const full = await fetchSiteData(false);
      const digits = (draft.whatsappNumber || "").replace(/\D/g, "");
      full.settings = {
        ...draft,
        whatsappNumber: digits,
        phoneHref: `tel:+${digits}`,
      };
      await saveSiteData(full, "⚙️ Update site settings");
      toast.success("Settings published ✅");
    } catch (e: any) {
      toast.error(e?.message || "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-card rounded-2xl border border-border/50 shadow-soft p-6 sm:p-8 space-y-5">
      <h2 className="font-display text-2xl font-bold text-foreground">Site Settings</h2>
      <div>
        <label className="block text-sm font-body font-bold text-foreground mb-2">
          Announcement (shows on every page — leave empty to hide)
        </label>
        <Textarea
          value={draft?.announcement || ""}
          onChange={(e) => setDraft({ ...draft, announcement: e.target.value })}
          placeholder="e.g. December special: Cat-eye clusters R100 this week only! 💖"
          rows={2}
          className="bg-background"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-body font-bold text-foreground mb-2">Phone (display)</label>
          <Input
            value={draft?.phoneDisplay || ""}
            onChange={(e) => setDraft({ ...draft, phoneDisplay: e.target.value })}
            className="bg-background"
          />
        </div>
        <div>
          <label className="block text-sm font-body font-bold text-foreground mb-2">WhatsApp number (digits)</label>
          <Input
            value={draft?.whatsappNumber || ""}
            onChange={(e) => setDraft({ ...draft, whatsappNumber: e.target.value })}
            placeholder="27719843649"
            className="bg-background"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-body font-bold text-foreground mb-2">
          Google reviews link (where "Post on Google" sends clients)
        </label>
        <Input
          value={draft?.googleReviewUrl || ""}
          onChange={(e) => setDraft({ ...draft, googleReviewUrl: e.target.value })}
          placeholder="https://www.google.com/search?q=kims+glam+lab"
          className="bg-background"
        />
        <p className="text-xs text-muted-foreground font-body mt-1">
          Once your Google Business Profile is live, paste its "write a review" link here.
        </p>
      </div>
      <Button variant="hero" onClick={save} disabled={busy}>
        <Save className="mr-2 h-4 w-4" />
        {busy ? "Publishing…" : "Publish Settings"}
      </Button>
    </div>
  );
};

// ── Root export — shows gate until unlocked ───────────────────────────────────
const Admin = () => {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  return <AdminPanel />;
};

export default Admin;
