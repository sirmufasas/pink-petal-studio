import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Trash2, ImagePlus, Sparkles, CalendarDays, Phone } from "lucide-react";
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

const Admin = () => {
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

  useEffect(() => {
    setItems(getGalleryItems());
    setBookings(getBookings());
    setBlockedDays(getBlockedDays());
  }, []);

  const blockedDates = useMemo(
    () => blockedDays.map((d) => new Date(d + "T00:00:00")),
    [blockedDays]
  );

  const handleToggleBlocked = (d: Date | undefined) => {
    if (!d) return;
    const ds = format(d, "yyyy-MM-dd");
    const next = toggleBlockedDay(ds);
    setBlockedDays(next);
    toast.success(next.includes(ds) ? "Day marked as unavailable" : "Day reopened");
  };

  const handleDeleteBooking = (id: string) => {
    deleteBooking(id);
    setBookings(getBookings());
    toast.success("Booking removed");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
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
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPreview(dataUrl);
    stopCamera();
  };

  const handleSave = () => {
    if (!preview) {
      toast.error("Please add an image first");
      return;
    }
    if (!description.trim()) {
      toast.error("Please add a description");
      return;
    }
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
      <div className="container mx-auto px-6">
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
            Take photos or upload images to showcase your work.
          </p>
        </motion.div>

        {/* Upload / Camera Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-card rounded-2xl border border-border/50 shadow-soft p-8">
            {/* Mode tabs */}
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
                onClick={() => { setMode("camera"); }}
                className="flex-1"
              >
                <Camera className="mr-2 h-4 w-4" />
                Camera
              </Button>
            </div>

            {mode === "upload" && !preview && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <ImagePlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground font-body">
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
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
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
                    placeholder="Describe this nail set... e.g. 'Pink ombré with crystal accents 💎'"
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-soft group"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.description}
                    className="w-full aspect-square object-cover"
                  />
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
    </div>
  );
};

export default Admin;
