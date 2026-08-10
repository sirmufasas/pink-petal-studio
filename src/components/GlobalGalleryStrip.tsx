import { Link } from "react-router-dom";
import { useSiteData, resolveImage } from "@/lib/content";

/**
 * A thin auto-scrolling strip of the latest photos.
 * Rendered on EVERY page — anything the admin uploads shows globally.
 */
const GlobalGalleryStrip = () => {
  const data = useSiteData();
  const items = (data?.gallery || []).slice(0, 12);
  if (items.length === 0) return null;

  const loop = [...items, ...items];

  return (
    <section className="py-10 bg-secondary/30 border-t border-border/40 overflow-hidden">
      <div className="container mx-auto px-6 mb-5 flex items-center justify-between">
        <p className="text-sm font-body tracking-[0.3em] uppercase text-primary">✨ Latest Work</p>
        <Link to="/portfolio" className="text-xs font-body text-muted-foreground hover:text-primary transition-colors">
          View all →
        </Link>
      </div>
      <div className="relative">
        <div className="flex gap-4 glam-marquee w-max">
          {loop.map((item, i) => (
            <Link
              key={`${item.id}-${i}`}
              to="/portfolio"
              className="block shrink-0 w-40 sm:w-52 rounded-xl overflow-hidden border border-border/50 shadow-soft hover:shadow-glow transition-shadow"
              title={item.description}
            >
              <img
                src={resolveImage(item.path)}
                alt={item.description}
                loading="lazy"
                className="w-full aspect-square object-cover"
              />
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .glam-marquee { animation: glamMarquee 45s linear infinite; }
        .glam-marquee:hover { animation-play-state: paused; }
        @keyframes glamMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default GlobalGalleryStrip;
