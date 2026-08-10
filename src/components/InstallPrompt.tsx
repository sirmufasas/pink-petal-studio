import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, PlusSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const icon = `${import.meta.env.BASE_URL}icons/icon-512.png`;

const DISMISS_KEY = "kgl-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as any).standalone === true;

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

const InstallPrompt = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showAndroid, setShowAndroid] = useState(false);
  const [showIOS, setShowIOS] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    const dismissed = localStorage.getItem(DISMISS_KEY) === "1";

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      if (!dismissed) setTimeout(() => setShowAndroid(true), 1800);
    };
    const onInstalled = () => {
      setInstalled(true);
      setShowAndroid(false);
      setShowIOS(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    // iOS Safari has no install prompt — show the friendly guide instead
    if (isIOS() && !dismissed) {
      setTimeout(() => setShowIOS(true), 1800);
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setShowAndroid(false);
    setShowIOS(false);
    setIosHelp(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setShowAndroid(false);
    setDeferred(null);
  };

  return (
    <>
      <AnimatePresence>
        {installed && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] bg-card border border-primary/40 rounded-full px-6 py-3 shadow-glow flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-body text-sm text-foreground">App installed — see you on your home screen! 💖</span>
          </motion.div>
        )}

        {/* Android / desktop install alert */}
        {showAndroid && !installed && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-[70]"
          >
            <div className="bg-card rounded-2xl border border-primary/40 shadow-glow p-5">
              <button
                onClick={dismiss}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-4">
                <img src={icon} alt="Kim's Glam Lab app icon" className="h-14 w-14 rounded-2xl shadow-soft" />
                <div>
                  <p className="font-display text-lg font-bold text-foreground leading-tight">
                    Get the Kim's Glam Lab app
                  </p>
                  <p className="text-xs text-muted-foreground font-body mt-1">
                    Install it on your phone for one-tap bookings, prices & bookings that work like an app.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="hero" className="flex-1" onClick={install}>
                  <Download className="mr-2 h-4 w-4" /> Install App
                </Button>
                <Button variant="outline" onClick={dismiss}>Not now</Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* iOS install alert */}
        {showIOS && !installed && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-[70]"
          >
            <div className="bg-card rounded-2xl border border-primary/40 shadow-glow p-5">
              <button
                onClick={dismiss}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-4">
                <img src={icon} alt="Kim's Glam Lab app icon" className="h-14 w-14 rounded-2xl shadow-soft" />
                <div>
                  <p className="font-display text-lg font-bold text-foreground leading-tight">
                    Install Kim's Glam Lab on your iPhone
                  </p>
                  <p className="text-xs text-muted-foreground font-body mt-1">
                    Keep us on your home screen for one-tap bookings.
                  </p>
                </div>
              </div>
              {iosHelp && (
                <ol className="mt-4 space-y-2 text-sm font-body text-foreground bg-background/60 rounded-xl p-4 border border-border/50">
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">1.</span> Tap the <Share className="h-4 w-4 text-primary" /> Share button in Safari
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">2.</span> Choose <PlusSquare className="h-4 w-4 text-primary" /> "Add to Home Screen"
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">3.</span> Tap Add — done! 💖
                  </li>
                </ol>
              )}
              <div className="flex gap-2 mt-4">
                <Button variant="hero" className="flex-1" onClick={() => setIosHelp((v) => !v)}>
                  <Share className="mr-2 h-4 w-4" /> {iosHelp ? "Hide Steps" : "How to Install"}
                </Button>
                <Button variant="outline" onClick={dismiss}>Not now</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstallPrompt;
