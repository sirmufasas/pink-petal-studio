import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Sparkles, ExternalLink, MessageCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSiteData, waLink, type Review } from "@/lib/content";

export const Stars = ({ n, onSet, size = "h-5 w-5" }: { n: number; onSet?: (v: number) => void; size?: string }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <button key={i} type="button" disabled={!onSet} onClick={() => onSet?.(i)} tabIndex={onSet ? 0 : -1}
        className={onSet ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}>
        <Star className={`${size} ${i <= n ? "text-primary fill-primary" : "text-muted-foreground/30"}`} />
      </button>
    ))}
  </div>
);

const ReviewCard = ({ r }: { r: Review }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-card rounded-2xl border border-border/50 shadow-soft p-6"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold">
          {r.name?.charAt(0)?.toUpperCase() || "💖"}
        </div>
        <div>
          <p className="font-body font-bold text-foreground">{r.name}</p>
          <Stars n={r.rating} size="h-3.5 w-3.5" />
        </div>
      </div>
      <span className={`text-[10px] font-body uppercase tracking-widest px-2 py-1 rounded-full border ${
        r.source === "Google" ? "text-primary border-primary/40" : "text-muted-foreground border-border"
      }`}>
        {r.source === "Google" ? "Google" : "Client"}
      </span>
    </div>
    <p className="text-foreground/90 font-body text-sm leading-relaxed">{r.text}</p>
  </motion.div>
);

const Reviews = () => {
  const data = useSiteData();
  const reviews = data?.reviews || [];
  const googleUrl = data?.settings.googleReviewUrl || "https://www.google.com/search?q=kims+glam+lab";
  const wa = data?.settings.whatsappNumber || "27719843649";

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please add your name");
    if (!rating) return toast.error("Please tap a star rating");
    if (!text.trim()) return toast.error("Please write a few words");

    // copy the review so it can be pasted onto Google in one tap
    try {
      await navigator.clipboard.writeText(`${"★".repeat(rating)}${"☆".repeat(5 - rating)} ${text.trim()}`);
    } catch {
      /* clipboard unavailable — user can still copy from WhatsApp message */
    }
    setDone(true);
    window.open(googleUrl, "_blank");
    toast.success("Thank you! Your review was copied — paste it on Google 💖");
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
            <span className="text-sm font-body tracking-[0.3em] uppercase text-primary">Reviews</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-foreground">Client Love</h1>
          <p className="text-muted-foreground font-body mt-4 max-w-lg mx-auto">
            Real words from real clients — on Google and right here.
          </p>
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <Stars n={Math.round(avg)} />
              <span className="font-display text-xl font-bold text-primary">
                {avg.toFixed(1)} · {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </span>
            </div>
          )}
          <a href={googleUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-sm font-body text-primary hover:underline">
            <ExternalLink className="h-4 w-4" />
            Find us on Google
          </a>
        </motion.div>

        {/* Existing reviews */}
        <div className="max-w-4xl mx-auto">
          {reviews.length === 0 ? (
            <p className="text-center text-muted-foreground font-body py-10">
              No reviews yet — be the first to shine ✨
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {reviews.map((r) => <ReviewCard key={r.id} r={r} />)}
            </div>
          )}
        </div>

        {/* Leave a review */}
        <div className="max-w-2xl mx-auto mt-16">
          <div className="bg-card rounded-2xl border border-border/50 shadow-soft p-6 sm:p-8">
            {done ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-hero mx-auto flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground">Thank you, {name}! 💖</h2>
                <p className="text-sm text-muted-foreground font-body">
                  Your review was copied to your clipboard and Google opened in a new tab — paste it
                  there so it reflects on Google. Send it to Kim as well so she can publish it here:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href={googleUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="hero-outline" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" /> Post on Google
                    </Button>
                  </a>
                  <a
                    href={waLink(wa, `Hi Kim! I left a review 💖\n\n*Name:* ${name}\n*Rating:* ${rating}/5\n*Review:* ${text}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="hero" className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" /> Send to Kim on WhatsApp
                    </Button>
                  </a>
                </div>
                <p className="text-xs text-muted-foreground font-body">
                  Kim publishes approved reviews to this page from her admin panel.
                </p>
                <Button variant="hero-outline" onClick={() => { setDone(false); setName(""); setRating(0); setText(""); }}>
                  Write Another
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <h2 className="font-display text-2xl font-bold text-foreground">Leave a Review</h2>
                <div>
                  <label className="block text-sm font-body font-bold text-foreground mb-2">Your name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-body font-bold text-foreground mb-2">Rating</label>
                  <Stars n={rating} onSet={setRating} size="h-7 w-7" />
                </div>
                <div>
                  <label className="block text-sm font-body font-bold text-foreground mb-2">Your review</label>
                  <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4}
                    placeholder="How were your lashes / brows / nails / glam?" className="bg-background" />
                </div>
                <Button type="submit" variant="hero" className="w-full">
                  <Star className="mr-2 h-4 w-4" /> Submit Review
                </Button>
                <p className="text-xs text-muted-foreground font-body text-center">
                  Submitting opens Google so your review reflects there too, and you can send it
                  straight to Kim's WhatsApp.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
