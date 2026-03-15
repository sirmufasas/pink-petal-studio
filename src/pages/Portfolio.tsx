import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getGalleryItems } from "@/lib/gallery-store";
import { useState, useEffect } from "react";
import type { GalleryItem } from "@/lib/gallery-store";
import sample1 from "@/assets/gallery-sample-1.jpg";
import sample2 from "@/assets/gallery-sample-2.jpg";
import sample3 from "@/assets/gallery-sample-3.jpg";
import sample4 from "@/assets/gallery-sample-4.jpg";
import sample5 from "@/assets/gallery-sample-5.jpg";
import sample6 from "@/assets/gallery-sample-6.jpg";
import heroImg from "@/assets/hero-nails.jpg";

const defaultItems = [
  { id: "d1", imageUrl: heroImg, description: "Rose gold chrome with crystal accents ✨", createdAt: "" },
  { id: "d2", imageUrl: sample1, description: "Our premium pink polish collection 💅", createdAt: "" },
  { id: "d3", imageUrl: sample3, description: "50 shades of pink — which is your fave? 💖", createdAt: "" },
  { id: "d4", imageUrl: sample4, description: "Hot pink chrome finish 💕", createdAt: "" },
  { id: "d5", imageUrl: sample2, description: "Soft pink gel with shimmer ✨", createdAt: "" },
  { id: "d6", imageUrl: sample5, description: "Pink glitter collection on display 💎", createdAt: "" },
  { id: "d7", imageUrl: sample6, description: "Pink ombré perfection 🌸", createdAt: "" },
];

const Portfolio = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedImg, setSelectedImg] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const stored = getGalleryItems();
    setItems([...stored, ...defaultItems]);
  }, []);

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
            Browse through my latest nail art creations. Every set is unique!
          </p>
        </motion.div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 max-w-6xl mx-auto">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.08 }}
              className="mb-6 break-inside-avoid cursor-pointer group"
              onClick={() => setSelectedImg(item)}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-soft border border-border/50 hover:shadow-glow transition-shadow duration-500">
                <img
                  src={item.imageUrl}
                  alt={item.description}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <p className="text-primary-foreground font-body text-sm">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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
              src={selectedImg.imageUrl}
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
