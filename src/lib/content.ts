import { useEffect, useState } from "react";
import heroLashes from "@/assets/hero-lashes.jpg";
import lashCatEye from "@/assets/portfolio/lashes-cat-eye.jpg";
import browsSculpted from "@/assets/portfolio/brows-sculpted.jpg";
import face from "@/assets/portfolio/face.jpg";
import gorjass from "@/assets/portfolio/gorjass.jpg";
import faceee from "@/assets/portfolio/faceee.jpg";
import glamSmile from "@/assets/portfolio/glam-smile.jpg";
import french from "@/assets/portfolio/french.jpg";
import brown from "@/assets/portfolio/brown.jpg";
import nice from "@/assets/portfolio/nice.jpg";
import pinkHearts from "@/assets/portfolio/pink-hearts.jpg";
import red from "@/assets/portfolio/red.jpg";
import emerald from "@/assets/portfolio/emerald.jpg";
import toes from "@/assets/portfolio/toes.jpg";
import pinkOmbre from "@/assets/portfolio/pink-ombre.jpg";
import zebraStiletto from "@/assets/portfolio/zebra-stiletto.jpg";
import redHeartToes from "@/assets/portfolio/red-heart-toes.jpg";
import pinkMarble from "@/assets/portfolio/pink-marble.jpg";
import babyPink from "@/assets/portfolio/baby-pink.jpg";
import blackGold from "@/assets/portfolio/black-gold.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export interface ServiceItem {
  name: string;
  price: string;
  duration?: string;
}
export interface ServiceCategory {
  id: string;
  category: string;
  items: ServiceItem[];
}
export interface GalleryImage {
  id: string;
  /** "bundled:<key>" | repo-relative path | http(s) | data: */
  path: string;
  description: string;
  createdAt: string;
}
export interface SiteSettings {
  announcement: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappNumber: string; // digits only, e.g. 27719843649
  heroTitle: string;
  heroTagline: string;
  googleReviewUrl: string;
}
export interface Review {
  id: string;
  name: string;
  rating: number; // 1..5
  text: string;
  source: "Google" | "Site";
  createdAt: string;
}
export interface SiteData {
  version: number;
  settings: SiteSettings;
  services: ServiceCategory[];
  gallery: GalleryImage[];
  reviews: Review[];
  blockedDays: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Repo-backed storage (GitHub is the database — works for every visitor)
// ─────────────────────────────────────────────────────────────────────────────
export const REPO = "sirmufasas/pink-petal-studio";
export const BRANCH = "main";
export const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/`;
export const DATA_PATH = "public/content/site-data.json";
export const UPLOAD_DIR = "public/content/uploads/";
const TOKEN_KEY = "kgl_github_token";

// Bundled fallback images (used when the network fetch fails / first paint)
export const ASSET_MAP: Record<string, string> = {
  hero: heroLashes,
  "lashes-cat-eye": lashCatEye,
  "brows-sculpted": browsSculpted,
  face,
  gorjass,
  faceee,
  "glam-smile": glamSmile,
  french,
  brown,
  nice,
  "pink-hearts": pinkHearts,
  red,
  emerald,
  toes,
  "pink-ombre": pinkOmbre,
  "zebra-stiletto": zebraStiletto,
  "red-heart-toes": redHeartToes,
  "pink-marble": pinkMarble,
  "baby-pink": babyPink,
  "black-gold": blackGold,
};

export function resolveImage(path: string): string {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  if (path.startsWith("bundled:")) return ASSET_MAP[path.slice(8)] || "";
  return RAW_BASE + path;
}

export const DEFAULT_DATA: SiteData = {
  version: 1,
  settings: {
    announcement: "",
    phoneDisplay: "071 984 3649",
    phoneHref: "tel:+27719843649",
    whatsappNumber: "27719843649",
    heroTitle: "Nails & Makeup",
    heroTagline: "That Speak Beauty",
    googleReviewUrl: "https://www.google.com/search?q=kims+glam+lab",
  },
  reviews: [],
  services: [
    {
      id: "nails",
      category: "Nails",
      items: [
        { name: "Gel Polish Manicure", price: "", duration: "1 hr" },
        { name: "Gel Polish Pedicure", price: "", duration: "1 hr" },
        { name: "Short Nails (Acrylic / Polygel)", price: "", duration: "1.5 hrs" },
        { name: "Medium Nails (Acrylic / Polygel)", price: "", duration: "1.5 hrs" },
        { name: "Long Nails (Acrylic / Polygel)", price: "", duration: "2 hrs" },
        { name: "Buff and Shine", price: "", duration: "30 min" },
        { name: "Soak-off", price: "", duration: "30 min" },
      ],
    },
    {
      id: "lashes",
      category: "Eyelashes",
      items: [
        { name: "Temporary/Strip", price: "R50", duration: "20 min" },
        { name: "Classic Cluster", price: "R100", duration: "45 min" },
        { name: "Cat-eye Cluster", price: "R120", duration: "1 hr" },
        { name: "Volume Cluster", price: "R150", duration: "1.5 hrs" },
      ],
    },
    {
      id: "brows",
      category: "Eyebrows",
      items: [
        { name: "Wax", price: "R100", duration: "30 min" },
        { name: "Tint", price: "R100", duration: "30 min" },
        { name: "Dermaplaning/Shaving", price: "R50", duration: "20 min" },
        { name: "Wax & Tint", price: "R150", duration: "1 hr" },
        { name: "Dermaplaning & Tint", price: "R150", duration: "1 hr" },
      ],
    },
    {
      id: "makeup",
      category: "Makeup",
      items: [
        { name: "Soft Glam", price: "R250", duration: "1 hr" },
        { name: "Full Glam", price: "R350", duration: "1.5 hrs" },
        { name: "Evening Look", price: "R350", duration: "1.5 hrs" },
        { name: "Special Effects", price: "R350", duration: "1.5 hrs" },
        { name: "Bridal Look", price: "R600", duration: "2 hrs" },
      ],
    },
  ],
  gallery: [
    { id: "d-lash1", path: "bundled:lashes-cat-eye", description: "Cat-eye cluster lashes — wispy & dramatic ✨", createdAt: "" },
    { id: "d-brow1", path: "bundled:brows-sculpted", description: "Sculpted & tinted brows 🤎", createdAt: "" },
    { id: "d1", path: "bundled:french", description: "Classic French tips — timeless elegance 🤍", createdAt: "" },
    { id: "d2", path: "bundled:emerald", description: "Emerald green French tips for the gala 💚", createdAt: "" },
    { id: "d3", path: "bundled:pink-hearts", description: "Soft pink gel with hand-painted hearts 💕", createdAt: "" },
    { id: "d4", path: "bundled:brown", description: "Mocha French — warm & sophisticated ☕", createdAt: "" },
    { id: "d5", path: "bundled:red", description: "Classic red gel — bold & glossy ❤️", createdAt: "" },
    { id: "d6", path: "bundled:nice", description: "Crisp white French set — clean perfection ✨", createdAt: "" },
    { id: "d7", path: "bundled:toes", description: "Emerald French pedicure to match 💚", createdAt: "" },
    { id: "d8", path: "bundled:pink-ombre", description: "Pink ombré gel — soft & dreamy 🌸", createdAt: "" },
    { id: "d9", path: "bundled:zebra-stiletto", description: "Red & zebra stiletto stunners 🦓❤️", createdAt: "" },
    { id: "d10", path: "bundled:red-heart-toes", description: "Red French pedi with hearts ❤️", createdAt: "" },
    { id: "d11", path: "bundled:pink-marble", description: "Bubblegum pink with marble accent 💗", createdAt: "" },
    { id: "d12", path: "bundled:baby-pink", description: "Clean male - Buff and Shine ✨", createdAt: "" },
    { id: "d13", path: "bundled:black-gold", description: "Black stiletto with gold flake 🖤✨", createdAt: "" },
    { id: "d-m1", path: "bundled:face", description: "Bridal glam with shimmer eyes 👰🏽", createdAt: "" },
    { id: "d-m2", path: "bundled:gorjass", description: "Soft glam — radiant & glowing ✨", createdAt: "" },
    { id: "d-m3", path: "bundled:faceee", description: "Sun-kissed everyday glam 💄", createdAt: "" },
    { id: "d-m4", path: "bundled:glam-smile", description: "Glitter cut-crease — all smiles ✨", createdAt: "" },
  ],
  blockedDays: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// Fetch (raw GitHub = single source of truth for every visitor)
// ─────────────────────────────────────────────────────────────────────────────
let cached: SiteData | null = null;
const listeners = new Set<() => void>();

function normalize(raw: any): SiteData {
  const d = JSON.parse(JSON.stringify(DEFAULT_DATA)) as SiteData;
  if (!raw || typeof raw !== "object") return d;
  return {
    version: typeof raw.version === "number" ? raw.version : 1,
    settings: { ...d.settings, ...(raw.settings || {}) },
    services: Array.isArray(raw.services) && raw.services.length ? raw.services : d.services,
    gallery: Array.isArray(raw.gallery) ? raw.gallery : d.gallery,
    reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
    blockedDays: Array.isArray(raw.blockedDays) ? raw.blockedDays : [],
  };
}

export async function fetchSiteData(force = false): Promise<SiteData> {
  if (cached && !force) return cached;
  try {
    const res = await fetch(`${RAW_BASE}${DATA_PATH}?t=${Date.now()}`, { cache: "no-store" });
    if (res.ok) {
      cached = normalize(await res.json());
      return cached;
    }
  } catch {
    /* offline / preview — fall through to defaults */
  }
  if (!cached) cached = normalize(DEFAULT_DATA);
  return cached;
}

export function onSiteDataChanged(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function emitChanged() {
  listeners.forEach((fn) => fn());
}

/** React hook — live site content, refreshes after admin saves. */
export function useSiteData(): SiteData | null {
  const [data, setData] = useState<SiteData | null>(cached);
  useEffect(() => {
    let on = true;
    const load = () => fetchSiteData().then((d) => on && setData(d));
    load();
    return onSiteDataChanged(() => load());
  }, []);
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// GitHub API (admin writes — token lives only in the admin's browser)
// ─────────────────────────────────────────────────────────────────────────────
export function getToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}
export function setToken(t: string) {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t.trim());
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

async function gh(path: string, opts: RequestInit = {}): Promise<any> {
  const token = getToken();
  if (!token) throw new Error("Not connected to GitHub. Open the Connection tab and paste your access token.");
  const res = await fetch(`https://api.github.com/${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    let msg = `GitHub error ${res.status}`;
    try {
      const j = await res.json();
      if (j?.message) msg += `: ${j.message}`;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function testConnection(): Promise<string> {
  const user = await gh("user");
  return user?.login || "unknown";
}

async function getFileSha(path: string): Promise<string | null> {
  try {
    const j = await gh(`repos/${REPO}/contents/${path}?ref=${BRANCH}`);
    return j?.sha || null;
  } catch {
    return null;
  }
}

function toBase64(str: string): string {
  // unicode-safe base64 for the browser
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

export async function commitTextFile(path: string, content: string, message: string): Promise<void> {
  const sha = await getFileSha(path);
  await gh(`repos/${REPO}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({ message, content: toBase64(content), branch: BRANCH, ...(sha ? { sha } : {}) }),
  });
}

export async function commitBinaryFile(path: string, base64: string, message: string): Promise<void> {
  const sha = await getFileSha(path);
  await gh(`repos/${REPO}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({ message, content: base64, branch: BRANCH, ...(sha ? { sha } : {}) }),
  });
}

export async function deleteRepoFile(path: string, message: string): Promise<void> {
  const sha = await getFileSha(path);
  if (!sha) return;
  await gh(`repos/${REPO}/contents/${path}`, {
    method: "DELETE",
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  });
}

export async function saveSiteData(data: SiteData, message: string): Promise<void> {
  await commitTextFile(DATA_PATH, JSON.stringify(data, null, 2), message);
  cached = data;
  emitChanged();
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery helpers (images go into the repo → visible to every visitor)
// ─────────────────────────────────────────────────────────────────────────────
export function compressToJpeg(input: File | string, maxDim = 1400, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = typeof input === "string" ? input : URL.createObjectURL(input);
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      if (typeof input !== "string") URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = url;
  });
}

export async function addGalleryImage(image: File | string, description: string): Promise<void> {
  const dataUrl = await compressToJpeg(image);
  const base64 = dataUrl.split(",")[1];
  const id = crypto.randomUUID();
  const path = `${UPLOAD_DIR}${id}.jpg`;
  await commitBinaryFile(path, base64, `📸 Add photo: ${description.slice(0, 60)}`);
  const data = await fetchSiteData(true);
  data.gallery.unshift({ id, path, description, createdAt: new Date().toISOString() });
  await saveSiteData(data, `🖼️ Update gallery: add "${description.slice(0, 40)}"`);
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const data = await fetchSiteData(true);
  const item = data.gallery.find((g) => g.id === id);
  if (!item) return;
  data.gallery = data.gallery.filter((g) => g.id !== id);
  await saveSiteData(data, "🗑️ Update gallery: remove photo");
  if (item.path && !item.path.startsWith("bundled:") && !/^(https?:|data:)/.test(item.path)) {
    await deleteRepoFile(item.path, "🗑️ Delete photo file").catch(() => {});
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Small shared helpers
// ─────────────────────────────────────────────────────────────────────────────
export const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export function waLink(number: string, text: string): string {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export const WHATSAPP_LINK = "https://wa.me/27719843649";

export function priceNumber(price: string): number {
  const n = parseInt(String(price).replace(/[^\d]/g, ""), 10);
  return isNaN(n) ? 0 : n;
}

export function parseHours(duration?: string): number {
  if (!duration) return 1;
  const m = duration.match(/(\d+(?:[.,]\d+)?)/);
  if (!m) return 1;
  const v = parseFloat(m[1].replace(",", "."));
  return v > 0 ? v : 1;
}

export function minPrice(cat: ServiceCategory): number {
  return cat.items.reduce((min, i) => Math.min(min, priceNumber(i.price)), Infinity) || 0;
}
