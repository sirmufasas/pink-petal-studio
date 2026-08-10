// ─────────────────────────────────────────────────────────────────────────────
// Calendar helpers — puts bookings onto the client's AND Kim's phone calendar
// ─────────────────────────────────────────────────────────────────────────────

export interface CalEvent {
  title: string;
  description: string;
  location?: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  hours: number;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function icsEscape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function dt(date: string, time: string): string {
  const [y, m, d] = date.split("-");
  const [hh, mm] = time.split(":");
  return `${y}${m}${d}T${hh}${mm}00`;
}

function addHours(date: string, time: string, hours: number): { date: string; time: string } {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const start = new Date(y, m - 1, d, hh, mm, 0);
  const end = new Date(start.getTime() + hours * 3600 * 1000);
  return {
    date: `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`,
    time: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
  };
}

/** Build a standard .ics calendar file (imports into any phone calendar). */
export function buildICS(ev: CalEvent): string {
  const end = addHours(ev.date, ev.time, ev.hours);
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(
    now.getUTCHours()
  )}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KimsGlamLab//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@kimsglamlab`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${dt(ev.date, ev.time)}`,
    `DTEND:${dt(end.date, end.time)}`,
    `SUMMARY:${icsEscape(ev.title)}`,
    `DESCRIPTION:${icsEscape(ev.description)}`,
    `LOCATION:${icsEscape(ev.location || "Kim's Glam Lab, Winchester Hills, Johannesburg")}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(ev.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function downloadICS(ics: string, filename = "kims-glam-lab-booking.ics"): void {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Google Calendar "add event" link — one tap adds it to a phone calendar. */
export function googleCalUrl(ev: CalEvent): string {
  const end = addHours(ev.date, ev.time, ev.hours);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates: `${dt(ev.date, ev.time)}/${dt(end.date, end.time)}`,
    details: ev.description,
    location: ev.location || "Kim's Glam Lab, Winchester Hills, Johannesburg",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
