import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useSiteData, resolveImage, type GalleryImage } from "@/lib/content";

const Portfolio = () => {
  const data = useSiteData();
  const items: GalleryImage[] = data?.gallery || [];
  const [selectedImg, setSelectedImg] = useState<GalleryImage | null>(null);

  // keep lightbox in sync if data reloads
  useEffect(() => {
    if (selectedImg && !items.find((i) => i.id === selectedImg.id)) setSelectedImg(null);
  }, [items, selectedImg]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-body tracking-[0.3em] uppercase text-primary">My Work</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-foreground">My Work</h1>
          <p className="text-muted-foreground font-body mt-4 max-w-lg mx-auto">
            Browse my latest lash sets, brows and glam looks. Every client, every face, every set is unique!
          </p>
        </motion.div>

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground font-body py-16">
            No photos yet — check back soon! ✨
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 max-w-6xl mx-auto">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.6, rotate: -25, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: (i % 6) * 0.1,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 90,
                  damping: 14,
                }}
                whileHover={{ rotate: 1.5, scale: 1.02 }}
                className="mb-6 break-inside-avoid cursor-pointer group"
                onClick={() => setSelectedImg(item)}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-soft border border-border/50 hover:shadow-glow transition-shadow duration-500">
                  <img
                    src={resolveImage(item.path)}
                    alt={item.description}
                    loading="lazy"
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <p className="text-primary-foreground font-body text-sm">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setSelectedImg(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-3xl w-full bg-card rounded-2xl overflow-hidden shadow-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={resolveImage(selectedImg.path)}
              alt={selectedImg.description}
              className="w-full max-h-[70vh] object-contain bg-foreground/5"
            />
            <div className="p-6">
              <p className="font-body text-foreground">{selectedImg.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Portfolio;
