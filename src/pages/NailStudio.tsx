import { useState, useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Download, FileText, Send, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { WHATSAPP_HREF } from "@/lib/booking-store";

// ---------- Data ----------
type NailShape = "square" | "round" | "almond" | "coffin" | "stiletto";
type NailDesign = "none" | "french" | "glitter" | "ombre" | "dots" | "hearts" | "stars" | "marble";

const SHAPES: { id: NailShape; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "round", label: "Round" },
  { id: "almond", label: "Almond" },
  { id: "coffin", label: "Coffin" },
  { id: "stiletto", label: "Stiletto" },
];

const COLORS = [
  { name: "Classic Red", hex: "#c0162a" },
  { name: "Hot Pink", hex: "#ec4899" },
  { name: "Rose Gold", hex: "#d4a373" },
  { name: "Nude", hex: "#e8c4a0" },
  { name: "Blush", hex: "#f4c2c2" },
  { name: "Burgundy", hex: "#5b1a2b" },
  { name: "Plum", hex: "#7a3b69" },
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#f5f5f5" },
  { name: "Lavender", hex: "#c5a3e0" },
  { name: "Sky Blue", hex: "#9ec5e8" },
  { name: "Emerald", hex: "#1f7a55" },
  { name: "Coral", hex: "#ff7f5c" },
  { name: "Champagne", hex: "#e7d5a3" },
];

const DESIGNS: { id: NailDesign; label: string }[] = [
  { id: "none", label: "Plain" },
  { id: "french", label: "French Tip" },
  { id: "glitter", label: "Glitter" },
  { id: "ombre", label: "Ombré" },
  { id: "dots", label: "Polka Dots" },
  { id: "hearts", label: "Hearts" },
  { id: "stars", label: "Stars" },
  { id: "marble", label: "Marble" },
];

const PRESETS: { name: string; color: string; design: NailDesign; shape: NailShape }[] = [
  { name: "Date Night", color: "#c0162a", design: "glitter", shape: "almond" },
  { name: "Boss Babe", color: "#1a1a1a", design: "french", shape: "coffin" },
  { name: "Soft Romance", color: "#f4c2c2", design: "hearts", shape: "almond" },
  { name: "Glam Diva", color: "#d4a373", design: "glitter", shape: "stiletto" },
  { name: "Minimal Chic", color: "#e8c4a0", design: "french", shape: "square" },
  { name: "Starlit", color: "#5b1a2b", design: "stars", shape: "almond" },
];

interface NailState {
  shape: NailShape;
  color: string;
  design: NailDesign;
}

const defaultNail = (): NailState => ({ shape: "almond", color: "#f4c2c2", design: "none" });

// ---------- Texture generator ----------
function buildNailTexture(state: NailState): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size * 2;
  const ctx = c.getContext("2d")!;

  // Base color
  ctx.fillStyle = state.color;
  ctx.fillRect(0, 0, c.width, c.height);

  // Subtle glossy highlight
  const grad = ctx.createLinearGradient(0, 0, c.width, c.height);
  grad.addColorStop(0, "rgba(255,255,255,0.35)");
  grad.addColorStop(0.4, "rgba(255,255,255,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.15)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, c.width, c.height);

  const accent = pickAccent(state.color);

  switch (state.design) {
    case "french": {
      ctx.fillStyle = "#fafafa";
      ctx.beginPath();
      ctx.ellipse(c.width / 2, 0, c.width * 0.7, c.height * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "glitter": {
      for (let i = 0; i < 400; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.9})`;
        const x = Math.random() * c.width;
        const y = Math.random() * c.height;
        ctx.fillRect(x, y, 2, 2);
      }
      for (let i = 0; i < 60; i++) {
        ctx.fillStyle = `rgba(255,215,150,${0.4 + Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(Math.random() * c.width, Math.random() * c.height, 2 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "ombre": {
      const g = ctx.createLinearGradient(0, 0, 0, c.height);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(1, state.color);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, c.width, c.height);
      break;
    }
    case "dots": {
      ctx.fillStyle = accent;
      for (let y = 40; y < c.height; y += 60) {
        for (let x = 30; x < c.width; x += 60) {
          ctx.beginPath();
          ctx.arc(x + (y / 60) % 2 * 30, y, 10, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case "hearts": {
      ctx.fillStyle = accent;
      drawShape(ctx, c.width / 2, c.height / 2, 40, "heart");
      drawShape(ctx, c.width / 2 - 60, c.height / 2 + 90, 22, "heart");
      drawShape(ctx, c.width / 2 + 60, c.height / 2 - 80, 22, "heart");
      break;
    }
    case "stars": {
      ctx.fillStyle = "#ffe9a8";
      drawShape(ctx, c.width / 2, c.height * 0.35, 32, "star");
      drawShape(ctx, c.width / 2 - 70, c.height * 0.65, 18, "star");
      drawShape(ctx, c.width / 2 + 60, c.height * 0.7, 22, "star");
      break;
    }
    case "marble": {
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = i % 2 === 0 ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.2)";
        ctx.lineWidth = 2 + Math.random() * 3;
        ctx.beginPath();
        ctx.moveTo(0, Math.random() * c.height);
        for (let x = 0; x < c.width; x += 20) {
          ctx.lineTo(x, Math.random() * c.height);
        }
        ctx.stroke();
      }
      break;
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function pickAccent(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  return lum > 0.55 ? "#2a0a1a" : "#fff5fa";
}

function drawShape(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, type: "heart" | "star") {
  ctx.beginPath();
  if (type === "heart") {
    ctx.moveTo(cx, cy + r * 0.6);
    ctx.bezierCurveTo(cx + r * 1.2, cy - r * 0.4, cx + r * 0.4, cy - r * 1.1, cx, cy - r * 0.2);
    ctx.bezierCurveTo(cx - r * 0.4, cy - r * 1.1, cx - r * 1.2, cy - r * 0.4, cx, cy + r * 0.6);
  } else {
    for (let i = 0; i < 10; i++) {
      const ang = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const rad = i % 2 === 0 ? r : r * 0.45;
      const x = cx + Math.cos(ang) * rad;
      const y = cy + Math.sin(ang) * rad;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
  ctx.fill();
}

// ---------- Nail shape geometry ----------
function shapeScale(shape: NailShape): { sx: number; sy: number; sz: number; taper: number } {
  switch (shape) {
    case "square":   return { sx: 1.0, sy: 0.25, sz: 1.0, taper: 0.95 };
    case "round":    return { sx: 0.95, sy: 0.3, sz: 1.0, taper: 0.7 };
    case "almond":   return { sx: 0.9, sy: 0.3, sz: 1.25, taper: 0.45 };
    case "coffin":   return { sx: 1.05, sy: 0.28, sz: 1.4, taper: 0.55 };
    case "stiletto": return { sx: 0.85, sy: 0.3, sz: 1.65, taper: 0.15 };
  }
}

// A single nail mesh built from a tapered rounded box-ish shape using BufferGeometry
function NailMesh({ state, selected, onSelect }: { state: NailState; selected: boolean; onSelect: () => void }) {
  const texture = useMemo(() => buildNailTexture(state), [state.color, state.design]);
  const s = shapeScale(state.shape);
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, dt) => {
    if (ref.current) {
      const target = selected ? 1.15 : 1;
      ref.current.scale.x += (s.sx * target - ref.current.scale.x) * Math.min(1, dt * 8);
      ref.current.scale.y += (s.sy * target - ref.current.scale.y) * Math.min(1, dt * 8);
      ref.current.scale.z += (s.sz * target - ref.current.scale.z) * Math.min(1, dt * 8);
    }
  });

  return (
    <group>
      <mesh
        ref={ref}
        scale={[s.sx, s.sy, s.sz]}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "default"; }}
        castShadow
      >
        <sphereGeometry args={[0.5, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          map={texture}
          roughness={state.design === "glitter" ? 0.25 : 0.15}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          reflectivity={0.6}
        />
      </mesh>
      {selected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.62, 32]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
}

// ---------- Finger ----------
interface FingerProps {
  segments: number[]; // lengths
  position: [number, number, number];
  rotation?: [number, number, number];
  baseWidth: number;
  nail: NailState;
  selected: boolean;
  onSelect: () => void;
}

function Finger({ segments, position, rotation = [0, 0, 0], baseWidth, nail, selected, onSelect }: FingerProps) {
  const skin = "#f3c8a8";
  return (
    <group position={position} rotation={rotation}>
      {segments.map((len, i) => {
        const prevSum = segments.slice(0, i).reduce((a, b) => a + b, 0);
        const widthMul = 1 - i * 0.08;
        return (
          <group key={i} position={[0, 0, prevSum + len / 2]}>
            {/* knuckle joint */}
            {i > 0 && (
              <mesh position={[0, 0, -len / 2]} castShadow>
                <sphereGeometry args={[baseWidth * widthMul * 1.05, 16, 16]} />
                <meshStandardMaterial color={skin} roughness={0.7} />
              </mesh>
            )}
            <mesh castShadow>
              <capsuleGeometry args={[baseWidth * widthMul, len, 8, 16]} />
              <meshStandardMaterial color={skin} roughness={0.7} />
            </mesh>
          </group>
        );
      })}
      {/* nail on top of last segment tip */}
      <group
        position={[0, baseWidth * 0.55, segments.reduce((a, b) => a + b, 0) - 0.05]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <group scale={[baseWidth * 1.6, 1, baseWidth * 1.6]}>
          <NailMesh state={nail} selected={selected} onSelect={onSelect} />
        </group>
      </group>
    </group>
  );
}

// ---------- Hand ----------
function Hand({ nails, selectedIdx, onSelect }: { nails: NailState[]; selectedIdx: number | null; onSelect: (i: number) => void }) {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.05;
  });

  const skin = "#f3c8a8";

  // Finger configs: position X across palm, segment lengths, base width
  // Z axis = forward (finger direction)
  const fingers = [
    { x: -0.85, segs: [0.55, 0.45, 0.4], w: 0.13, rot: [0, 0, 0] as [number, number, number] },     // index
    { x: -0.28, segs: [0.65, 0.5, 0.45], w: 0.14, rot: [0, 0, 0] as [number, number, number] },     // middle
    { x: 0.28,  segs: [0.6, 0.48, 0.42], w: 0.13, rot: [0, 0, 0] as [number, number, number] },     // ring
    { x: 0.82,  segs: [0.45, 0.38, 0.35], w: 0.12, rot: [0, 0, 0] as [number, number, number] },    // pinky
  ];

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} rotation={[-0.35, 0, 0]}>
      {/* Palm */}
      <mesh position={[0, 0, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.4, 1.6]} />
        <meshStandardMaterial color={skin} roughness={0.75} />
      </mesh>
      {/* Wrist */}
      <mesh position={[0, 0, -1.6]} castShadow>
        <cylinderGeometry args={[0.55, 0.6, 1.0, 24]} />
        <meshStandardMaterial color={skin} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, -1.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 1.0, 24]} />
        <meshStandardMaterial color={skin} roughness={0.8} />
      </mesh>

      {/* Fingers (index..pinky) */}
      {fingers.map((f, i) => (
        <Finger
          key={i}
          position={[f.x, 0, 0.35]}
          segments={f.segs}
          baseWidth={f.w}
          rotation={f.rot}
          nail={nails[i + 1]}
          selected={selectedIdx === i + 1}
          onSelect={() => onSelect(i + 1)}
        />
      ))}

      {/* Thumb (rotated outward) */}
      <group position={[-1.05, 0, -0.65]} rotation={[0.2, 0.7, -0.4]}>
        <Finger
          position={[0, 0, 0]}
          segments={[0.55, 0.5]}
          baseWidth={0.16}
          nail={nails[0]}
          selected={selectedIdx === 0}
          onSelect={() => onSelect(0)}
        />
      </group>
    </group>
  );
}

// ---------- Page ----------
const NAIL_LABELS = ["Thumb", "Index", "Middle", "Ring", "Pinky"];

const NailStudio = () => {
  const [nails, setNails] = useState<NailState[]>(() => Array.from({ length: 5 }, defaultNail));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(1);
  const [applyAll, setApplyAll] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);

  const update = (patch: Partial<NailState>) => {
    setNails((prev) => prev.map((n, i) => (applyAll || selectedIdx === i ? { ...n, ...patch } : n)));
  };

  const applyPreset = (p: typeof PRESETS[number]) => {
    setNails((prev) => prev.map(() => ({ shape: p.shape, color: p.color, design: p.design })));
    toast({ title: `Applied "${p.name}"`, description: "Whole set updated." });
  };

  const reset = () => setNails(Array.from({ length: 5 }, defaultNail));

  const captureImage = (): string | null => {
    const gl = glRef.current;
    if (!gl) return null;
    // Force a fresh render
    const scene = (gl as any).__scene;
    const cam = (gl as any).__cam;
    if (scene && cam) gl.render(scene, cam);
    return gl.domElement.toDataURL("image/png");
  };

  const downloadPNG = () => {
    const data = captureImage();
    if (!data) return toast({ title: "Could not capture image" });
    const a = document.createElement("a");
    a.href = data;
    a.download = "kims-glam-lab-nail-design.png";
    a.click();
    toast({ title: "Image downloaded 💅" });
  };

  const downloadPDF = () => {
    const data = captureImage();
    if (!data) return;
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const w = pdf.internal.pageSize.getWidth();
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("Kim's Glam Lab — Custom Nail Design", w / 2, 50, { align: "center" });
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text("Designed by client. Please reference for appointment.", w / 2, 70, { align: "center" });
    pdf.addImage(data, "PNG", 40, 90, w - 80, 380);
    let y = 500;
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text("Specifications:", 40, y);
    y += 20;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    nails.forEach((n, i) => {
      pdf.text(`• ${NAIL_LABELS[i]}: ${n.shape}, color ${n.color}, design ${n.design}`, 50, y);
      y += 16;
    });
    pdf.save("kims-glam-lab-nail-design.pdf");
    toast({ title: "PDF ready ✨" });
  };

  const sendToTech = () => {
    const summary = nails.map((n, i) => `${NAIL_LABELS[i]}: ${n.shape} / ${n.color} / ${n.design}`).join("\n");
    const text = encodeURIComponent(`Hi Kim! I designed my nails in your studio:\n\n${summary}\n\nCan we book this look?`);
    window.open(`${WHATSAPP_HREF}?text=${text}`, "_blank");
  };

  const current = selectedIdx !== null ? nails[selectedIdx] : nails[0];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="container-responsive">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs tracking-[0.3em] uppercase mb-3">
            <Sparkles className="h-3 w-3" /> Virtual Nail Studio
          </div>
          <h1 className="font-display text-gradient-pink mb-2">Design Your Dream Nails</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Drag the hand to rotate. Tap a nail to select it, then pick a shape, polish, or design.
            Save your look as an image or PDF and send it straight to Kim.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          {/* 3D Canvas */}
          <div
            ref={canvasContainerRef}
            className="relative rounded-2xl overflow-hidden shadow-glow bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50 border border-primary/20"
            style={{ height: "min(70vh, 640px)" }}
          >
            <Canvas
              shadows
              dpr={[1, 2]}
              camera={{ position: [0, 2.2, 4.5], fov: 38 }}
              gl={{ preserveDrawingBuffer: true, antialias: true }}
              onCreated={({ gl, scene, camera }) => {
                glRef.current = gl;
                (gl as any).__scene = scene;
                (gl as any).__cam = camera;
              }}
              onPointerMissed={() => setSelectedIdx(null)}
            >
              <color attach="background" args={["#fdeef2"]} />
              <ambientLight intensity={0.45} />
              <directionalLight position={[4, 6, 4]} intensity={1.3} castShadow shadow-mapSize={[1024, 1024]} />
              <directionalLight position={[-3, 3, -2]} intensity={0.4} color="#ffd1e0" />
              <Suspense fallback={null}>
                <Hand nails={nails} selectedIdx={selectedIdx} onSelect={setSelectedIdx} />
                <Environment preset="studio" />
                <ContactShadows position={[0, -1.1, 0]} opacity={0.5} blur={2.5} far={4} />
              </Suspense>
              <OrbitControls
                enablePan={false}
                minDistance={3}
                maxDistance={7}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2}
              />
            </Canvas>

            <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
              {NAIL_LABELS.map((l, i) => (
                <button
                  key={l}
                  onClick={() => setSelectedIdx(i)}
                  className={`px-2.5 py-1 text-[10px] tracking-widest uppercase rounded-full backdrop-blur transition ${
                    selectedIdx === i
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-white/70 text-foreground hover:bg-white"
                  }`}
                >
                  {l}
                </button>
              ))}
              <button
                onClick={() => setApplyAll((v) => !v)}
                className={`px-2.5 py-1 text-[10px] tracking-widest uppercase rounded-full backdrop-blur transition ${
                  applyAll ? "bg-accent text-accent-foreground" : "bg-white/70 text-foreground hover:bg-white"
                }`}
              >
                {applyAll ? "All Nails ✓" : "Apply to All"}
              </button>
            </div>

            <div className="absolute bottom-3 right-3">
              <Button size="sm" variant="outline" onClick={reset} className="bg-white/80 backdrop-blur">
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
              </Button>
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {/* Selected indicator */}
            <div className="rounded-xl bg-card p-4 border border-border shadow-soft">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs tracking-widest uppercase text-muted-foreground">Editing</span>
                <span className="font-display text-lg text-primary">
                  {applyAll ? "All Nails" : selectedIdx !== null ? NAIL_LABELS[selectedIdx] : "—"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-5 h-5 rounded-full border border-border" style={{ background: current.color }} />
                {current.shape} · {current.design}
              </div>
            </div>

            {/* Shapes */}
            <Panel title="Nail Shape">
              <div className="grid grid-cols-5 gap-2">
                {SHAPES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => update({ shape: s.id })}
                    className={`group flex flex-col items-center gap-1 p-2 rounded-lg border transition ${
                      current.shape === s.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <ShapeIcon shape={s.id} />
                    <span className="text-[9px] uppercase tracking-wider">{s.label}</span>
                  </button>
                ))}
              </div>
            </Panel>

            {/* Polish */}
            <Panel title="Polish Colors — drag or tap">
              <div className="grid grid-cols-7 gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    title={c.name}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("color", c.hex)}
                    onClick={() => update({ color: c.hex })}
                    className={`relative aspect-square rounded-full border-2 transition hover:scale-110 ${
                      current.color === c.hex ? "border-primary scale-110 shadow-glow" : "border-white"
                    }`}
                    style={{
                      background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.7), ${c.hex} 55%)`,
                      boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.25)",
                    }}
                  />
                ))}
              </div>
            </Panel>

            {/* Designs */}
            <Panel title="Designs">
              <div className="grid grid-cols-4 gap-2">
                {DESIGNS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => update({ design: d.id })}
                    className={`p-2 rounded-lg text-[10px] uppercase tracking-wider border transition ${
                      current.design === d.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </Panel>

            {/* Presets */}
            <Panel title="Quick Looks">
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border hover:border-primary/60 transition text-left"
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-white"
                      style={{ background: p.color, boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.2)" }}
                    />
                    <span className="text-xs">{p.name}</span>
                  </button>
                ))}
              </div>
            </Panel>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={downloadPNG} variant="hero-outline" size="sm">
                <Download className="h-4 w-4" /> PNG
              </Button>
              <Button onClick={downloadPDF} variant="hero-outline" size="sm">
                <FileText className="h-4 w-4" /> PDF
              </Button>
            </div>
            <Button onClick={sendToTech} variant="hero" className="w-full">
              <Send className="h-4 w-4" /> Send to Kim on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl bg-card p-4 border border-border shadow-soft">
    <h3 className="font-display text-sm tracking-wide mb-3 text-foreground">{title}</h3>
    {children}
  </div>
);

const ShapeIcon = ({ shape }: { shape: NailShape }) => {
  const paths: Record<NailShape, string> = {
    square:   "M6 2 H18 V20 H6 Z",
    round:    "M6 4 Q12 -1 18 4 V20 H6 Z",
    almond:   "M6 6 Q12 -2 18 6 Q15 22 12 22 Q9 22 6 6 Z",
    coffin:   "M6 4 Q12 -1 18 4 V18 L15 22 H9 L6 18 Z",
    stiletto: "M6 6 Q12 0 18 6 L12 24 Z",
  };
  return (
    <svg width="22" height="24" viewBox="0 0 24 24" className="fill-primary/70">
      <path d={paths[shape]} />
    </svg>
  );
};

export default NailStudio;
