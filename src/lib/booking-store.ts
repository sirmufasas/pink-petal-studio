// ─────────────────────────────────────────────────────────────────────────────
// Bookings store — a free shared JSON blob so every booking made on the site
// lands in one place that the Admin → Bookings screen can list.
// (Bookings ALSO always go to Kim's WhatsApp, so nothing is ever lost.)
// ─────────────────────────────────────────────────────────────────────────────

const BLOB_ID = "019fecee-2bc7-7dc8-88c9-778db04821ae";
const BLOB_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  service: string;
  date: string; // yyyy-MM-dd
  time: string;
  notes?: string | null;
  createdAt: string;
}

export async function getBookings(): Promise<Booking[]> {
  try {
    const res = await fetch(BLOB_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.bookings) ? json.bookings : [];
  } catch {
    return [];
  }
}

async function putBookings(list: Booking[]): Promise<void> {
  const res = await fetch(BLOB_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookings: list }),
  });
  if (!res.ok) throw new Error("Could not save booking online");
}

export async function addBooking(b: Omit<Booking, "id" | "createdAt">): Promise<Booking> {
  const list = await getBookings();
  const rec: Booking = { ...b, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  list.push(rec);
  await putBookings(list);
  return rec;
}

export async function deleteBooking(id: string): Promise<void> {
  const list = (await getBookings()).filter((b) => b.id !== id);
  await putBookings(list);
}

export async function getBookedTimes(date: string): Promise<string[]> {
  return (await getBookings()).filter((b) => b.date === date).map((b) => b.time);
}
