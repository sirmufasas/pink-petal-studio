import { supabase } from "@/integrations/supabase/client";

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  service: string;
  date: string; // yyyy-mm-dd
  time: string;
  notes?: string | null;
  createdAt: string;
}

function mapBooking(row: any): Booking {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    service: row.service,
    date: row.date,
    time: row.time,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export async function getBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("date", { ascending: true })
    .order("time", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapBooking);
}

export async function addBooking(b: Omit<Booking, "id" | "createdAt">): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      name: b.name,
      phone: b.phone,
      email: b.email || null,
      service: b.service,
      date: b.date,
      time: b.time,
      notes: b.notes || null,
    })
    .select()
    .single();
  if (error) throw error;
  return mapBooking(data);
}

export async function deleteBooking(id: string) {
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw error;
}

export async function getBlockedDays(): Promise<string[]> {
  const { data, error } = await supabase.from("blocked_days").select("date");
  if (error) throw error;
  return (data ?? []).map((r: any) => r.date);
}

export async function toggleBlockedDay(date: string): Promise<string[]> {
  const current = await getBlockedDays();
  if (current.includes(date)) {
    const { error } = await supabase.from("blocked_days").delete().eq("date", date);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("blocked_days").insert({ date });
    if (error) throw error;
  }
  return getBlockedDays();
}

export const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

export async function getBookedTimes(date: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("time")
    .eq("date", date);
  if (error) throw error;
  return (data ?? []).map((r: any) => r.time);
}

export const PHONE_NUMBER = "+27 71 984 3649";
export const PHONE_HREF = "tel:+27719843649";
export const WHATSAPP_HREF = "whatsapp://send?phone=27719843649";
