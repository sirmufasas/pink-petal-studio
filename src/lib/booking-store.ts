// Local storage booking store
export interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  date: string; // yyyy-mm-dd
  time: string;
  notes?: string;
  createdAt: string;
}

const STORAGE_KEY = "kgl-bookings";
const BLOCKED_KEY = "kgl-blocked-days";

export function getBookings(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addBooking(b: Omit<Booking, "id" | "createdAt">): Booking {
  const items = getBookings();
  const item: Booking = { ...b, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  items.push(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return item;
}

export function deleteBooking(id: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getBookings().filter(b => b.id !== id)));
}

export function getBlockedDays(): string[] {
  try {
    return JSON.parse(localStorage.getItem(BLOCKED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleBlockedDay(date: string) {
  const days = getBlockedDays();
  const next = days.includes(date) ? days.filter(d => d !== date) : [...days, date];
  localStorage.setItem(BLOCKED_KEY, JSON.stringify(next));
  return next;
}

export const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

export function getBookedTimes(date: string): string[] {
  return getBookings().filter(b => b.date === date).map(b => b.time);
}

export function isDayFullyBooked(date: string): boolean {
  return getBookedTimes(date).length >= TIME_SLOTS.length;
}

export const PHONE_NUMBER = "+27 71 984 3649";
export const PHONE_HREF = "tel:+27719843649";
export const WHATSAPP_HREF = "https://web.whatsapp.com/send?phone=27719843649";
