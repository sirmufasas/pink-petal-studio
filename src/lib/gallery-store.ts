// Simple local storage based gallery store
export interface GalleryItem {
  id: string;
  imageUrl: string;
  description: string;
  createdAt: string;
}

const STORAGE_KEY = "glownails-gallery";

export function getGalleryItems(): GalleryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addGalleryItem(item: Omit<GalleryItem, "id" | "createdAt">): GalleryItem {
  const items = getGalleryItems();
  const newItem: GalleryItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return newItem;
}

export function deleteGalleryItem(id: string): void {
  const items = getGalleryItems().filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
