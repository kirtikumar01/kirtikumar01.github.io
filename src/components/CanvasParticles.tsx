"use client";

import { useEffect, useRef } from "react";
import { useScroll, useVelocity } from "framer-motion";

class Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  baseSpeedY: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 0.5;
    this.baseSpeedY = (Math.random() * 0.5 + 0.1) * -1; // float up
    this.speedY = this.baseSpeedY;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  update(canvasWidth: number, canvasHeight: number, scrollVelocity: number) {
    // React to scroll velocity by pushing particles faster
    // if scrolling down (positive velocity), particles might fly up faster
    const scrollEffect = scrollVelocity * 0.005;

    this.y += this.speedY - scrollEffect;
    this.x += this.speedX;

    // Wrap around screen
    if (this.y < -10) {
      this.y = canvasHeight + 10;
      this.x = Math.random() * canvasWidth;
    }
    if (this.y > canvasHeight + 10) {
      this.y = -10;
      this.x = Math.random() * canvasWidth;
    }
    if (this.x < -10) this.x = canvasWidth + 10;
    if (this.x > canvasWidth + 10) this.x = -10;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(168, 192, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const velocityRef = useRef(0);

  useEffect(() => {
    return scrollVelocity.on("change", (latest) => {
      velocityRef.current = latest;
    });
  }, [scrollVelocity]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const particleCount = Math.min(window.innerWidth / 10, 100); // Responsive amount
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentVelocity = velocityRef.current;

      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height, currentVelocity);
        particle.draw(ctx);
      });

      // Decay velocity back to 0 slowly to smooth out scroll stops
      velocityRef.current *= 0.95;

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );
}
