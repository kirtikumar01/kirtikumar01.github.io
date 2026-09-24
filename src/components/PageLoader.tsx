"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import styles from "./PageLoader.module.css";

/** Minimum time the loader stays visible — ensures counting animation is always seen */
const MIN_MS = 1800;

export default function PageLoader() {
  // motionValue drives the raw number (0–100, float)
  const count = useMotionValue(0);
  // round to integer for display
  const rounded = useTransform(count, (v) => Math.round(v));
  // progress bar width string (e.g. "43%")
  const barWidth = useTransform(count, (v) => `${v}%`);
  const [displayedNum, setDisplayedNum] = useState(0);
  const [visible, setVisible] = useState(true);

  const startRef = useRef(performance.now());
  const phase1Ctrl = useRef<ReturnType<typeof animate> | null>(null);
  const phase2Ctrl = useRef<ReturnType<typeof animate> | null>(null);

  /* Subscribe to the rounded motionValue → setState so React re-renders the number */
  useEffect(() => {
    return rounded.on("change", (v) => setDisplayedNum(v));
  }, [rounded]);

  useEffect(() => {
    /**
     * Phase 1 — always runs, regardless of network speed.
     * Counts 0 → 88 over MIN_MS * 0.7 seconds so the animation is always visible.
     * Uses ease-out so numbers increment fast at first, slow near the end.
     */
    const phase1Duration = (MIN_MS * 0.7) / 1000; // in seconds
    phase1Ctrl.current = animate(count, 88, {
      duration: phase1Duration,
      ease: [0.22, 1, 0.36, 1], // fast start, decelerates near 88
    });

    /**
     * Phase 2 — triggered by window.load OR after MIN_MS, whichever is LATER.
     * Counts 88 → 100 quickly, then hides the loader.
     */
    const finishLoader = () => {
      phase1Ctrl.current?.stop();

      const elapsed = performance.now() - startRef.current;
      const waitMore = Math.max(0, MIN_MS - elapsed);

      setTimeout(() => {
        phase2Ctrl.current = animate(count, 100, {
          duration: 0.4,
          ease: "easeOut",
        });
        phase2Ctrl.current.then(() => {
          // hold at 100% briefly so user sees it, then exit
          setTimeout(() => setVisible(false), 350);
        });
      }, waitMore);
    };

    if (document.readyState === "complete") {
      finishLoader();
    } else {
      window.addEventListener("load", finishLoader, { once: true });
    }

    return () => {
      phase1Ctrl.current?.stop();
      phase2Ctrl.current?.stop();
      window.removeEventListener("load", finishLoader);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          {/* Ambient glow */}
          <div className={styles.ambientGlow} />

          {/* Icon + spinning ring */}
          <div className={styles.iconWrapper}>
            <motion.div
              className={styles.spinRing}
              animate={{ rotate: 360 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className={styles.pulseRing}
              animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.08, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className={styles.iconSvg}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "backOut" }}
            >
              <svg
                width="72"
                height="72"
                viewBox="0 0 512 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect width="512" height="512" rx="128" fill="#0A0A0A" />
                <path
                  d="M160 160V352M160 256H224M224 160L160 256L224 352"
                  stroke="url(#lg1)"
                  strokeWidth="40"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M288 352V160H352C378.51 160 400 181.49 400 208C400 234.51 378.51 256 352 256H288"
                  stroke="url(#lg2)"
                  strokeWidth="40"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="lg1" x1="160" y1="160" x2="224" y2="352" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6" />
                    <stop offset="1" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="lg2" x1="288" y1="160" x2="400" y2="352" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8B5CF6" />
                    <stop offset="1" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </div>

          {/* Animated percentage */}
          <motion.div
            className={styles.percentWrapper}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <span className={styles.percentNumber}>{displayedNum}</span>
            <span className={styles.percentSymbol}>%</span>
          </motion.div>

          {/* Progress bar — width driven by the same motionValue */}
          <motion.div
            className={styles.progressTrack}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.35 }}
          >
            <motion.div
              className={styles.progressFill}
              style={{ width: barWidth }}
            />
          </motion.div>

          {/* Label */}
          <motion.p
            className={styles.tagline}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Loading portfolio…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
