import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index.tsx";
import Services from "./pages/Services.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import BookAppointment from "./pages/BookAppointment.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";
import kimmLogo from "./assets/kimm.jpg";

const queryClient = new QueryClient();

// ── Sparkle particle type ──────────────────────────────────────────────────
interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const SPARKLE_COLORS = [
  "#f9a8d4", // pink-300
  "#f472b6", // pink-400
  "#ec4899", // pink-500
  "#fcd34d", // amber-300
  "#fbbf24", // amber-400
  "#ffffff", // white
  "#fbcfe8", // pink-200
  "#e9d5ff", // violet-200
];

function generateSparkles(count: number): Sparkle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 12 + 4,
    duration: Math.random() * 2 + 1.2,
    delay: Math.random() * 4,
    color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
  }));
}

// ── Loader Component ───────────────────────────────────────────────────────
const GlamLoader = ({ onDone }: { onDone: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [sparkles] = useState(() => generateSparkles(40));

  useEffect(() => {
    const DURATION = 15000; // 15 seconds
    const interval = 50;
    const step = (interval / DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((p) => {
        const next = p + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onDone, 800);
          }, 300);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 60% 40%, #3d0020 0%, #1a0010 40%, #0d0008 100%)",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.8s ease",
        overflow: "hidden",
      }}
    >
      {/* ── Ambient glow orbs ── */}
      <div style={{
        position: "absolute", width: 500, height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)",
        top: "-100px", left: "-100px", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 400, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)",
        bottom: "-80px", right: "-80px", pointerEvents: "none",
      }} />

      {/* ── Sparkles ── */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            pointerEvents: "none",
            animation: `glamSparkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          {/* 4-pointed star */}
          <svg viewBox="0 0 24 24" fill={s.color} width={s.size} height={s.size}>
            <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
          </svg>
        </div>
      ))}

      {/* ── Ring / halo ── */}
      <div style={{
        position: "relative",
        marginBottom: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Outer spinning ring */}
        <div style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          border: "2px solid transparent",
          borderTop: "2px solid #f472b6",
          borderRight: "2px solid #fbbf24",
          animation: "glamSpin 3s linear infinite",
        }} />
        {/* Middle pulsing ring */}
        <div style={{
          position: "absolute",
          width: 170,
          height: 170,
          borderRadius: "50%",
          border: "1px solid rgba(244,114,182,0.3)",
          animation: "glamPulse 2s ease-in-out infinite",
        }} />
        {/* Inner slow counter-spin */}
        <div style={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: "50%",
          border: "1px dashed rgba(251,191,36,0.2)",
          animation: "glamSpinReverse 6s linear infinite",
        }} />

        {/* Logo */}
        <img
          src={kimmLogo}
          alt="Kim's Glam Lab"
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            objectFit: "cover",
            boxShadow:
              "0 0 40px rgba(236,72,153,0.6), 0 0 80px rgba(236,72,153,0.2), inset 0 0 20px rgba(0,0,0,0.3)",
            animation: "glamGlow 2.5s ease-in-out infinite",
            border: "3px solid rgba(251,191,36,0.5)",
          }}
        />
      </div>

      {/* ── Tagline ── */}
      <p style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "13px",
        letterSpacing: "6px",
        textTransform: "uppercase",
        color: "rgba(249,168,212,0.8)",
        marginBottom: 40,
        animation: "glamFadeInUp 1s ease both",
        animationDelay: "0.5s",
      }}>
        Elevate Your Glow
      </p>

      {/* ── Progress bar ── */}
      <div style={{ width: 260, position: "relative" }}>
        <div style={{
          width: "100%",
          height: 2,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 99,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #ec4899, #fbbf24, #f472b6)",
            borderRadius: 99,
            transition: "width 0.1s linear",
            boxShadow: "0 0 8px rgba(236,72,153,0.8)",
          }} />
        </div>
        <p style={{
          textAlign: "center",
          marginTop: 12,
          fontFamily: "'Lato', sans-serif",
          fontSize: "11px",
          letterSpacing: "3px",
          color: "rgba(249,168,212,0.5)",
        }}>
          {Math.round(progress)}%
        </p>
      </div>

      {/* ── Keyframes injected via <style> ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&family=Lato:wght@300&display=swap');

        @keyframes glamSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes glamSpinReverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes glamPulse {
          0%, 100% { transform: scale(1);   opacity: 0.3; }
          50%       { transform: scale(1.05); opacity: 0.7; }
        }
        @keyframes glamGlow {
          0%, 100% { box-shadow: 0 0 40px rgba(236,72,153,0.6), 0 0 80px rgba(236,72,153,0.2); }
          50%       { box-shadow: 0 0 60px rgba(236,72,153,0.9), 0 0 120px rgba(236,72,153,0.4), 0 0 160px rgba(251,191,36,0.15); }
        }
        @keyframes glamSparkle {
          0%, 100% { opacity: 0;   transform: scale(0.3) rotate(0deg); }
          30%       { opacity: 1;   transform: scale(1)   rotate(45deg); }
          70%       { opacity: 0.6; transform: scale(0.8) rotate(90deg); }
        }
        @keyframes glamFadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ── Main App ───────────────────────────────────────────────────────────────
const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {loading && <GlamLoader onDone={() => setLoading(false)} />}
        {!loading && (
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/book" element={<BookAppointment />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;