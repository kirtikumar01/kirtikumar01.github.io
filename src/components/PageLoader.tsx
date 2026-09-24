"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PageLoader.module.css";

const LOADER_DURATION = 1500; // 1.5 seconds for the logo draw animation

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We wait for window load, but also enforce a minimum time to let the animation play out beautifully.
    const start = performance.now();
    
    const finish = () => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, LOADER_DURATION - elapsed);
      setTimeout(() => {
        setLoading(false);
      }, remaining);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => window.removeEventListener("load", finish);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%", 
            opacity: 0, 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          <div className={styles.ambientGlow} />

          <div className={styles.logoContainer}>
            <motion.svg
              width="100"
              height="100"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Box/Background of Logo */}
              <motion.rect
                width="512"
                height="512"
                rx="128"
                fill="#0A0A0A"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                stroke="url(#loader_grad)"
                strokeWidth="2"
              />
              
              {/* K Path */}
              <motion.path
                d="M160 160V352M160 256H224M224 160L160 256L224 352"
                stroke="url(#loader_g1)"
                strokeWidth="40"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
              />
              
              {/* P Path */}
              <motion.path
                d="M288 352V160H352C378.51 160 400 181.49 400 208C400 234.51 378.51 256 352 256H288"
                stroke="url(#loader_g2)"
                strokeWidth="40"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
              />

              <defs>
                <linearGradient id="loader_grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6" stopOpacity="0.5"/>
                  <stop offset="1" stopColor="#EC4899" stopOpacity="0.5"/>
                </linearGradient>
                <linearGradient id="loader_g1" x1="160" y1="160" x2="224" y2="352" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="loader_g2" x1="288" y1="160" x2="400" y2="352" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8B5CF6" />
                  <stop offset="1" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </motion.svg>
            
            <motion.div 
              className={styles.brandName}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            >
              Kirti Kumar Piplaj
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
