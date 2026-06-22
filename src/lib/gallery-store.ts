import { supabase } from "@/integrations/supabase/client";

export interface GalleryItem {
  id: string;
  imageUrl: string; // signed URL ready to render
  storagePath: string;
  description: string;
  createdAt: string;
}

const BUCKET = "gallery";
const SIGN_TTL = 60 * 60 * 24 * 365; // 1 year

async function sign(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGN_TTL);
  if (error || !data) return "";
  return data.signedUrl;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const items = await Promise.all(
    (data ?? []).map(async (row: any) => ({
      id: row.id,
      storagePath: row.image_url,
      imageUrl: await sign(row.image_url),
      description: row.description,
      createdAt: row.created_at,
    }))
  );
  return items;
}

// Convert a data URL or File to a Blob
function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, b64] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

export async function uploadGalleryImage(input: File | string): Promise<string> {
  const blob = typeof input === "string" ? dataUrlToBlob(input) : input;
  const ext = blob.type.split("/")[1] || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function addGalleryItem(item: {
  imageUrl: File | string; // File or data URL
  description: string;
}): Promise<GalleryItem> {
  const path = await uploadGalleryImage(item.imageUrl);
  const { data, error } = await supabase
    .from("gallery_items")
    .insert({ image_url: path, description: item.description })
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    storagePath: path,
    imageUrl: await sign(path),
    description: data.description,
    createdAt: data.created_at,
  };
}

export async function deleteGalleryItem(id: string, storagePath?: string): Promise<void> {
  if (storagePath) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
  }
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) throw error;
}
