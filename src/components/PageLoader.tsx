"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PageLoader.module.css";

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"loading" | "done">("loading");

  useEffect(() => {
    // Simulate loading: fast to ~80%, then waits for real load, then completes
    let current = 0;
    const interval = setInterval(() => {
      if (current < 75) {
        current += Math.random() * 7 + 3; // 3–10% per tick, fast
      } else if (current < 90) {
        current += Math.random() * 2 + 0.5; // slow near the end
      }
      if (current > 90) current = 90;
      setProgress(Math.min(Math.round(current), 90));
    }, 80);

    // When window is fully loaded — jump to 100 and exit
    const finish = () => {
      clearInterval(interval);
      setProgress(100);
      setPhase("done");
      setTimeout(() => setVisible(false), 700);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", finish);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.55, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          {/* Ambient glow behind icon */}
          <div className={styles.ambientGlow} />

          {/* Icon wrapper — spinning ring + icon */}
          <div className={styles.iconWrapper}>
            {/* Spinning gradient ring */}
            <motion.div
              className={styles.spinRing}
              animate={{ rotate: 360 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner glow pulse */}
            <motion.div
              className={styles.pulseRing}
              animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.08, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* The SVG icon */}
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
                  stroke="url(#loader_g1)"
                  strokeWidth="40"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M288 352V160H352C378.51 160 400 181.49 400 208C400 234.51 378.51 256 352 256H288"
                  stroke="url(#loader_g2)"
                  strokeWidth="40"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="loader_g1"
                    x1="160"
                    y1="160"
                    x2="224"
                    y2="352"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#3B82F6" />
                    <stop offset="1" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient
                    id="loader_g2"
                    x1="288"
                    y1="160"
                    x2="400"
                    y2="352"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#8B5CF6" />
                    <stop offset="1" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </div>

          {/* Percentage counter */}
          <motion.div
            className={styles.percentWrapper}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <span className={styles.percentNumber}>{progress}</span>
            <span className={styles.percentSymbol}>%</span>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className={styles.progressTrack}
            initial={{ opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.25, duration: 0.35 }}
          >
            <motion.div
              className={styles.progressFill}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            className={styles.tagline}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "done" ? 0 : 0.5 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            {phase === "done" ? "Let's go →" : "Loading portfolio…"}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
