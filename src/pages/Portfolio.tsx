import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getGalleryItems } from "@/lib/gallery-store";
import { useState, useEffect } from "react";
import type { GalleryItem } from "@/lib/gallery-store";
import french from "@/assets/portfolio/french.jpg";
import brown from "@/assets/portfolio/brown.jpg";
import nice from "@/assets/portfolio/nice.jpg";
import pinkHearts from "@/assets/portfolio/pink-hearts.jpg";
import red from "@/assets/portfolio/red.jpg";
import emerald from "@/assets/portfolio/emerald.jpg";
import toes from "@/assets/portfolio/toes.jpg";
import face from "@/assets/portfolio/face.jpg";
import gorjass from "@/assets/portfolio/gorjass.jpg";
import faceee from "@/assets/portfolio/faceee.jpg";
import pinkOmbre from "@/assets/portfolio/pink-ombre.jpg";
import zebraStiletto from "@/assets/portfolio/zebra-stiletto.jpg";
import redHeartToes from "@/assets/portfolio/red-heart-toes.jpg";
import pinkMarble from "@/assets/portfolio/pink-marble.jpg";
import babyPink from "@/assets/portfolio/baby-pink.jpg";
import blackGold from "@/assets/portfolio/black-gold.jpg";
import glamSmile from "@/assets/portfolio/glam-smile.jpg";

const defaultItems = [
  { id: "d1", imageUrl: french, description: "Classic French tips — timeless elegance 🤍", createdAt: "" },
  { id: "d2", imageUrl: emerald, description: "Emerald green French tips for the gala 💚", createdAt: "" },
  { id: "d3", imageUrl: pinkHearts, description: "Soft pink gel with hand-painted hearts 💕", createdAt: "" },
  { id: "d4", imageUrl: brown, description: "Mocha French — warm & sophisticated ☕", createdAt: "" },
  { id: "d5", imageUrl: red, description: "Classic red gel — bold & glossy ❤️", createdAt: "" },
  { id: "d6", imageUrl: nice, description: "Crisp white French set — clean perfection ✨", createdAt: "" },
  { id: "d7", imageUrl: toes, description: "Emerald French pedicure to match 💚", createdAt: "" },
  { id: "d8", imageUrl: pinkOmbre, description: "Pink ombré gel — soft & dreamy 🌸", createdAt: "" },
  { id: "d9", imageUrl: zebraStiletto, description: "Red & zebra stiletto stunners 🦓❤️", createdAt: "" },
  { id: "d10", imageUrl: redHeartToes, description: "Red French pedi with hearts ❤️", createdAt: "" },
  { id: "d11", imageUrl: pinkMarble, description: "Bubblegum pink with marble accent 💗", createdAt: "" },
  { id: "d12", imageUrl: babyPink, description: "Clean male - Buff and Shine ✨", createdAt: "" },
  { id: "d13", imageUrl: blackGold, description: "Black stiletto with gold flake 🖤✨", createdAt: "" },
  { id: "m1", imageUrl: face, description: "Bridal glam with shimmer eyes 👰🏽", createdAt: "" },
  { id: "m2", imageUrl: gorjass, description: "Soft glam — radiant & glowing ✨", createdAt: "" },
  { id: "m3", imageUrl: faceee, description: "Sun-kissed everyday glam 💄", createdAt: "" },
  { id: "m4", imageUrl: glamSmile, description: "Glitter cut-crease — all smiles ✨", createdAt: "" },
];

const Portfolio = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedImg, setSelectedImg] = useState<GalleryItem | null>(null);

  useEffect(() => {
    getGalleryItems()
      .then((stored) => setItems([...stored, ...(defaultItems as any)]))
      .catch(() => setItems(defaultItems as any));
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
            Browse my latest nail sets and makeup looks. Every client, every face, every set is unique!
          </p>
        </motion.div>

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
