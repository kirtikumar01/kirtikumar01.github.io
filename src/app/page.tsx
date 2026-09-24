"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, ExternalLink, Code2, Database, Layout, Terminal, Sparkles, Gamepad2, Tv, Bot, ChevronDown, Sun, Moon, FileText } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import { TypeAnimation } from 'react-type-animation';
import TiltCard from "../components/TiltCard";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showScrollArrow, setShowScrollArrow] = useState(true);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  // Init theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const initial = stored ?? preferred;
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  // Contact form state
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formErrors, setFormErrors] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formTouched, setFormTouched] = useState({ name: false, email: false, message: false });

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const yImages = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  
  const experienceRef = useRef(null);
  const { scrollYProgress: expScrollYProgress } = useScroll({ target: experienceRef, offset: ["start center", "end center"] });
  const bubbleY = useTransform(expScrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "experience", "projects", "contact"];
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // If user has scrolled to the very bottom, force contact active
      if (scrollY + windowHeight >= docHeight - 50) {
        setActiveSection("contact");
        return;
      }

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop - 100;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollY >= offsetTop && scrollY < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Hide scroll arrow once user scrolls past hero
  useEffect(() => {
    const onScroll = () => setShowScrollArrow(window.scrollY < 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when navigating
  const handleNavClick = () => setMobileMenuOpen(false);

  // Anti-spam: track last submission timestamp
  const lastSubmitRef = useRef<number>(0);
  const RATE_LIMIT_MS = 60_000; // 1 submission per minute

  // Name field: block digits and special characters on keydown
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, arrows, home, end, ctrl combos
    if (["Backspace","Delete","Tab","ArrowLeft","ArrowRight","Home","End"].includes(e.key)) return;
    if (e.ctrlKey || e.metaKey) return;
    // Block digits
    if (/[0-9]/.test(e.key)) { e.preventDefault(); return; }
    // Block most special chars (allow space, hyphen, apostrophe for names like O'Brien, Mary-Jane)
    if (!/^[a-zA-Z\u00C0-\u024F\s'-]$/.test(e.key)) { e.preventDefault(); return; }
  };

  // Also sanitize on paste for name field
  const handleNamePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^a-zA-Z\u00C0-\u024F\s'-]/g, "");
    const input = e.currentTarget;
    const newValue = input.value.slice(0, input.selectionStart ?? 0) + pasted + input.value.slice(input.selectionEnd ?? 0);
    setFormData(prev => ({ ...prev, name: newValue }));
    if (formTouched.name) setFormErrors(prev => ({ ...prev, name: validateField("name", newValue) }));
  };

  // Form validation
  const validateField = (name: string, value: string): string => {
    if (name === "name") {
      const trimmed = value.trim();
      if (!trimmed) return "Name is required.";
      if (/^\s+$/.test(value)) return "Name cannot be spaces only.";
      if (trimmed.length < 2) return "Name must be at least 2 characters.";
      if (trimmed.length > 60) return "Name is too long (max 60 characters).";
      if (/[0-9]/.test(trimmed)) return "Name cannot contain numbers.";
      if (/[^a-zA-Z\u00C0-\u024F\s'-]/.test(trimmed)) return "Name contains invalid characters.";
    }
    if (name === "email") {
      const trimmed = value.trim();
      if (!trimmed) return "Email is required.";
      // RFC-compliant email regex
      if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(trimmed))
        return "Please enter a valid email address.";
      if (trimmed.length > 254) return "Email address is too long.";
      // Block obvious disposable domains
      const disposable = ["mailinator.com","tempmail.com","throwaway.email","guerrillamail.com","yopmail.com","trashmail.com","sharklasers.com"];
      const domain = trimmed.split("@")[1]?.toLowerCase();
      if (domain && disposable.includes(domain)) return "Disposable email addresses are not allowed.";
    }
    if (name === "message") {
      const trimmed = value.trim();
      if (!trimmed) return "Message is required.";
      if (/^\s+$/.test(value)) return "Message cannot be spaces only.";
      if (trimmed.length < 10) return "Message must be at least 10 characters.";
      if (trimmed.length > 2000) return "Message is too long (max 2000 characters).";
      // Spam signals: too many URLs
      const urlCount = (trimmed.match(/https?:\/\//g) || []).length;
      if (urlCount > 2) return "Message contains too many links.";
      // Block HTML/script tags
      if (/<[^>]+>/.test(trimmed)) return "HTML is not allowed in the message.";
    }
    return "";
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Enforce max length silently
    const maxLen = name === "name" ? 60 : name === "email" ? 254 : 2000;
    const clamped = value.slice(0, maxLen);
    setFormData(prev => ({ ...prev, [name]: clamped }));
    if (formTouched[name as keyof typeof formTouched]) {
      setFormErrors(prev => ({ ...prev, [name]: validateField(name, clamped) }));
    }
  };

  const handleFormBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormTouched(prev => ({ ...prev, [name]: true }));
    setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const isFormValid =
    !validateField("name", formData.name) &&
    !validateField("email", formData.email) &&
    !validateField("message", formData.message);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Touch all to surface errors
    setFormTouched({ name: true, email: true, message: true });
    const errors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };
    setFormErrors(errors);
    if (errors.name || errors.email || errors.message) return;

    // Rate limit: 1 submission per minute
    const now = Date.now();
    if (now - lastSubmitRef.current < RATE_LIMIT_MS) {
      const remaining = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitRef.current)) / 1000);
      setFormErrors(prev => ({ ...prev, message: `Please wait ${remaining}s before sending another message.` }));
      return;
    }

    setFormStatus("sending");
    lastSubmitRef.current = now;
    try {
      const res = await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID || ""}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: formData.name.trim(), email: formData.email.trim(), message: formData.message.trim() }),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setFormTouched({ name: false, email: false, message: false });
        setFormErrors({ name: "", email: "", message: "" });
        setTimeout(() => setFormStatus("idle"), 5000);
      } else {
        setFormStatus("error");
        setTimeout(() => setFormStatus("idle"), 5000);
      }
    } catch {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };





  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const floatAnimation: any = {
    hidden: { y: 0 },
    visible: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };


  return (
    <>
      {/* Custom Cursor */}
      <motion.div
        className={styles.customCursor}
        animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
        transition={{ type: "spring", damping: 30, mass: 0.5, stiffness: 400 }}
      />
      <motion.div
        className={styles.customCursorOuter}
        animate={{ x: mousePosition.x - 24, y: mousePosition.y - 24 }}
        transition={{ type: "spring", damping: 40, mass: 1.5, stiffness: 200 }}
      />

      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <a href="#home" className={styles.logo}>Kirti<span className="gradient-text">.</span></a>
          {/* Desktop nav */}
          <div className={styles.navLinks}>
            {["home", "about", "experience", "projects", "contact"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className={`${styles.navLink} ${activeSection === item ? styles.activeNavLink : ""}`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            ))}
            <div className={styles.navSocials}>
              <a href="https://linkedin.com/in/kirti-kumar01" target="_blank" rel="noreferrer" className={styles.navSocialLink} aria-label="LinkedIn"><FaLinkedin size={18} /></a>
              <a href="https://github.com/kirtikumar01" target="_blank" rel="noreferrer" className={styles.navSocialLink} aria-label="GitHub"><FaGithub size={18} /></a>
              <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.navResumeBtn}>Resume</a>
            </div>
          </div>
          {/* Hamburger button - mobile only */}
          <button
            className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile Drawer */}
        <motion.div
          className={styles.mobileDrawer}
          initial={false}
          animate={mobileMenuOpen ? { x: 0, opacity: 1 } : { x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          {mobileMenuOpen && <div className={styles.mobileDrawerOverlay} onClick={handleNavClick} />}
          <div className={styles.mobileDrawerContent}>
            {["home", "about", "experience", "projects", "contact"].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item}`}
                className={`${styles.mobileNavLink} ${activeSection === item ? styles.mobileNavLinkActive : ""}`}
                onClick={handleNavClick}
                initial={{ opacity: 0, x: 30 }}
                animate={mobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ delay: mobileMenuOpen ? i * 0.08 : 0, duration: 0.3 }}
              >
                <span className={styles.mobileNavNumber}>0{i + 1}.</span>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </motion.a>
            ))}
            <motion.div
              className={styles.mobileNavSocials}
              initial={{ opacity: 0, y: 20 }}
              animate={mobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: mobileMenuOpen ? 5 * 0.08 + 0.1 : 0, duration: 0.3 }}
            >
              <a href="https://linkedin.com/in/kirti-kumar01" target="_blank" rel="noreferrer" className={styles.mobileSocialLink} aria-label="LinkedIn"><FaLinkedin size={22} /></a>
              <a href="https://github.com/kirtikumar01" target="_blank" rel="noreferrer" className={styles.mobileSocialLink} aria-label="GitHub"><FaGithub size={22} /></a>
              <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme" style={{ marginLeft: "auto" }}>
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </motion.div>
            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileResumeBtn}
              initial={{ opacity: 0, y: 20 }}
              animate={mobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: mobileMenuOpen ? 5 * 0.08 + 0.2 : 0, duration: 0.3 }}
              onClick={handleNavClick}
            >
              <FileText size={16} style={{ marginRight: "0.5rem" }} />
              Download Resume
            </motion.a>
          </div>
        </motion.div>
      </nav>

      {/* Single fixed scroll-down arrow — visible only near top of page, never overlaps content */}
      <AnimatePresence>
        {showScrollArrow && (
          <motion.div
            className={styles.scrollIndicator}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            exit={{ opacity: 0 }}
            transition={{ y: { repeat: Infinity, duration: 2, ease: "easeInOut" }, opacity: { duration: 0.4 } }}
          >
            <a href="#about" aria-label="Scroll to About section">
              <ChevronDown size={32} className="gradient-text" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={containerRef} className={`container ${styles.pageWrapper}`}>

        {/* Hero Section */}
        <section id="home" className={`${styles.section} ${styles.hero}`}>
          <motion.div className={styles.heroContent} initial="hidden" animate="visible" variants={fadeIn}>
            <motion.div className={styles.heroBadge} style={{ y: yImages }}>
              <span className={styles.pulseDot}></span> Available for new opportunities
            </motion.div>
            <h1 className={styles.heroTitle}>
              Building Web3 & Fintech Interfaces as a
              <br />
              <TypeAnimation
                sequence={[
                  'Frontend Engineer',
                  2000,
                  '',
                  500,
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                className="gradient-text"
                style={{ whiteSpace: 'nowrap', display: 'inline-block' }}
              />
            </h1>
            <h2 className={styles.heroSubtitle}>
              React · Next.js · Web3 & Fintech Interfaces
            </h2>
            <motion.p className={styles.heroDescription} variants={fadeIn}>
              Hi, I'm Kirti Kumar Piplaj. I specialize in building accessible, human-centered products using React and Next.js, with a strong focus on Web3 and fintech domains. I use AI tools (Cursor, Claude, etc.) to speed up prototyping and testing, while owning architecture, code review, and quality.
            </motion.p>
            <div className={styles.heroCta}>
              <a href="#projects" className="btn-primary">
                <span className="btn-primary-content">Explore My Work</span>
              </a>
              <a href="#contact" className="btn-secondary">Let&apos;s Talk</a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-secondary">Download Resume</a>
            </div>
            <div className={styles.socialLinks}>
              <a href="https://linkedin.com/in/kirti-kumar01" target="_blank" rel="noreferrer" aria-label="LinkedIn Profile" className={styles.socialIcon}><FaLinkedin size={24} /></a>
              <a href="https://github.com/kirtikumar01" target="_blank" rel="noreferrer" aria-label="GitHub Profile" className={styles.socialIcon}><FaGithub size={24} /></a>
            </div>
          </motion.div>

          {/* Hero Avatar with Animations */}
          <motion.div
            className={styles.heroImageContainer}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ y: yImages }}
          >
            <motion.img
              src="/images/avatar.png"
              alt="Kirti Kumar Piplaj - Frontend Engineer"
              className={styles.heroAvatar}
              variants={floatAnimation}
              initial="hidden"
              animate="visible"
              loading="eager"
              decoding="async"
              style={{ willChange: 'transform' }}
            />
          </motion.div>
        </section>

        {/* About & Skills Section */}
        <section id="about" className={styles.section}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}>
            <motion.h2 className={styles.sectionTitle} style={{ y: yBg }}>About Me & Vibe</motion.h2>
            <div className={styles.aboutContainer}>
              <div className={styles.aboutText}>
                <p>
                  Hello! My name is Kirti and I am a <strong>Frontend Engineer</strong> with 3+ years of experience specializing in React and Next.js. I have a strong track record of delivering production-ready interfaces for Web3, fintech, and astrology platforms.
                </p>
                <p>
                  I focus on translating Figma designs into pixel-perfect, accessible UIs, defining robust frontend architectures, and conducting rigorous code reviews. I also use AI tools (Cursor, Claude, etc.) to speed up prototyping and testing, while fully owning code quality. When I&apos;m not coding, you can find me enjoying gaming or watching anime.
                </p>
              </div>
            </div>

            <div className={styles.skillsContainer}>
              <h3 className={styles.sectionTitle}>Technical Arsenal</h3>
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className={styles.skillsGrid}>
                <motion.div variants={fadeIn} className={styles.skillCategory}>
                  <h4><Layout size={18} className="gradient-text" /> Core Frontend</h4>
                  <div className={styles.skillsList}>
                    {["React.js", "Next.js", "TypeScript", "JavaScript", "Vue.js", "HTML5/CSS3"].map(skill => (
                      <motion.span 
                        key={skill} 
                        className={styles.skillBadge}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.15}
                        whileHover={{ scale: 1.1, cursor: "grab" }}
                        whileTap={{ scale: 0.95, cursor: "grabbing" }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={fadeIn} className={styles.skillCategory}>
                  <h4><Database size={18} className="gradient-text" /> State & Data</h4>
                  <div className={styles.skillsList}>
                    {["Redux Toolkit", "Zustand", "TanStack Query", "React Hook Form", "Zod"].map(skill => (
                      <motion.span 
                        key={skill} 
                        className={styles.skillBadge}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.15}
                        whileHover={{ scale: 1.1, cursor: "grab" }}
                        whileTap={{ scale: 0.95, cursor: "grabbing" }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={fadeIn} className={styles.skillCategory}>
                  <h4><Code2 size={18} className="gradient-text" /> Styling & UI</h4>
                  <div className={styles.skillsList}>
                    {["TailwindCSS", "Framer Motion", "GSAP", "MUI", "Shadcn/UI", "Radix UI"].map(skill => (
                      <motion.span 
                        key={skill} 
                        className={styles.skillBadge}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.15}
                        whileHover={{ scale: 1.1, cursor: "grab" }}
                        whileTap={{ scale: 0.95, cursor: "grabbing" }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={fadeIn} className={styles.skillCategory}>
                  <h4><Sparkles size={18} className="gradient-text" /> Web3</h4>
                  <div className={styles.skillsList}>
                    {["Wagmi", "Viem", "Ethers.js", "MetaMask", "WalletConnect", "Coinbase Wallet"].map(skill => (
                      <motion.span 
                        key={skill} 
                        className={styles.skillBadge}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.15}
                        whileHover={{ scale: 1.1, cursor: "grab" }}
                        whileTap={{ scale: 0.95, cursor: "grabbing" }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={fadeIn} className={styles.skillCategory}>
                  <h4><Terminal size={18} className="gradient-text" /> Tooling & Backend</h4>
                  <div className={styles.skillsList}>
                    {["NestJS", "Node.js", "Supabase", "Firebase", "JWT auth flows", "AWS S3", "Vercel", "Git", "Figma", "Axios", "AI-assisted workflow"].map(skill => (
                      <motion.span 
                        key={skill} 
                        className={styles.skillBadge}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.15}
                        whileHover={{ scale: 1.1, cursor: "grab" }}
                        whileTap={{ scale: 0.95, cursor: "grabbing" }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section id="experience" className={styles.section}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <motion.h2 className={styles.sectionTitle} style={{ y: yBg }}>Where I&apos;ve Worked</motion.h2>
            <div className={styles.timeline} ref={experienceRef}>
              <motion.div className={styles.timelineBubble} style={{ top: bubbleY }} />

              <motion.div variants={fadeIn} className={`${styles.timelineBlock} ${styles.timelineBlockLeft}`}>
                <div className={styles.timelineDot}></div>
                <div className={`glass-panel ${styles.timelineContent}`}>
                  <h3 className={styles.timelineRole}>Frontend Developer <span className="gradient-text">@ Codes for Tomorrow (CFT)</span></h3>
                  <div className={styles.timelineDate}>Indore, India | 08/2025 - Present</div>
                  <ul className={styles.projectWorkings}>
                    {process.env.NODE_ENV !== "production" && <li>Build and maintain production-grade frontend applications across [ADD METRIC] Web3, fintech, and astrology domains using React, Next.js, and TypeScript.</li>}
                    <li>Leverage Antigravity AI IDE and prompt engineering for AI-assisted development, shipping features end-to-end without UI designs.</li>
                  </ul>
                  <div className={styles.projectTechStack} style={{ marginTop: "1rem" }}>
                    <span className={styles.techTag}>React</span>
                    <span className={styles.techTag}>Next.js</span>
                    <span className={styles.techTag}>TypeScript</span>
                    <span className={styles.techTag}>Web3</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className={`${styles.timelineBlock} ${styles.timelineBlockRight}`}>
                <div className={styles.timelineDot}></div>
                <div className={`glass-panel ${styles.timelineContent}`}>
                  <h3 className={styles.timelineRole}>Frontend Developer <span className="gradient-text">@ Web Impact Software Solutions</span></h3>
                  <div className={styles.timelineDate}>Indore | 09/2023 - 07/2024</div>
                  <ul className={styles.projectWorkings}>
                    <li>Spearheaded the development of the core product utilizing Vue.js and Tailwind CSS.</li>
                    {process.env.NODE_ENV !== "production" && <li>Collaborated with design teams to ensure pixel-perfect implementation of [ADD METRIC]+ UI mockups.</li>}
                    {process.env.NODE_ENV !== "production" && <li>Improved overall application performance and maintained highly reusable component libraries with [ADD METRIC]+ components.</li>}
                  </ul>
                  <div className={styles.projectTechStack} style={{ marginTop: "1rem" }}>
                    <span className={styles.techTag}>Vue.js</span>
                    <span className={styles.techTag}>Tailwind CSS</span>
                    <span className={styles.techTag}>JavaScript</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className={`${styles.timelineBlock} ${styles.timelineBlockLeft}`}>
                <div className={styles.timelineDot}></div>
                <div className={`glass-panel ${styles.timelineContent}`}>
                  <h3 className={styles.timelineRole}>Frontend Developer <span className="gradient-text">@ Jona</span></h3>
                  <div className={styles.timelineDate}>USA (Remote) | 04/2022 - 11/2022</div>
                  <ul className={styles.projectWorkings}>
                    {process.env.NODE_ENV !== "production" && <li>Developed a high-performance Next.js web application for selling curated journalists lists to [ADD METRIC]+ users.</li>}
                    {process.env.NODE_ENV !== "production" && <li>Integrated Material UI (MUI) to rapidly build a consistent and accessible design system with [ADD METRIC]+ components.</li>}
                    {process.env.NODE_ENV !== "production" && <li>Worked asynchronously with international teams, delivering [ADD METRIC]+ features on strict deadlines.</li>}
                  </ul>
                  <div className={styles.projectTechStack} style={{ marginTop: "1rem" }}>
                    <span className={styles.techTag}>Next.js</span>
                    <span className={styles.techTag}>React</span>
                    <span className={styles.techTag}>MUI</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className={`${styles.timelineBlock} ${styles.timelineBlockRight}`}>
                <div className={styles.timelineDot}></div>
                <div className={`glass-panel ${styles.timelineContent}`}>
                  <h3 className={styles.timelineRole}>Software Engineer <span className="gradient-text">@ Bellurbis Technologies</span></h3>
                  <div className={styles.timelineDate}>Indore | 09/2021 - 03/2022</div>
                  <ul className={styles.projectWorkings}>
                    <li>Built a comprehensive recruitment management system using React.js.</li>
                    {process.env.NODE_ENV !== "production" && <li>Implemented complex state management using Redux, handling vast amounts of candidate data ([ADD METRIC]+ records).</li>}
                    {process.env.NODE_ENV !== "production" && <li>Designed features enabling organizations to streamline their hiring processes efficiently for [ADD METRIC]+ clients.</li>}
                  </ul>
                  <div className={styles.projectTechStack} style={{ marginTop: "1rem" }}>
                    <span className={styles.techTag}>React</span>
                    <span className={styles.techTag}>Redux</span>
                    <span className={styles.techTag}>JavaScript</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className={`${styles.timelineBlock} ${styles.timelineBlockLeft}`}>
                <div className={styles.timelineDot}></div>
                <div className={`glass-panel ${styles.timelineContent}`}>
                  <h3 className={styles.timelineRole}>Internship - Frontend Developer <span className="gradient-text">@ HemansAI</span></h3>
                  <div className={styles.timelineDate}>Indore | 01/2021 - 03/2021</div>
                  <ul className={styles.projectWorkings}>
                    {process.env.NODE_ENV !== "production" && <li>Developed RTBAnalytica, a web app showcasing [ADD METRIC]+ services and offerings using HTML, CSS, and JS.</li>}
                    <li>Gained hands-on experience with Bootstrap for rapid responsive design prototyping.</li>
                  </ul>
                  <div className={styles.projectTechStack} style={{ marginTop: "1rem" }}>
                    <span className={styles.techTag}>HTML/CSS</span>
                    <span className={styles.techTag}>JavaScript</span>
                    <span className={styles.techTag}>Bootstrap</span>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="projects" className={styles.section}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <motion.h2 className={styles.sectionTitle} style={{ y: yBg }}>Some Things I&apos;ve Built</motion.h2>
            <p className={styles.sectionSubtitle}>A collection of projects showcasing my expertise in modern web development.</p>

            <div className={styles.projectsGrid}>


              {/* OCCSSG Portal */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <TiltCard className={styles.projectCard}>
                  <img loading="lazy" src="/images/projects/occssg.png" alt="OCCSSG Portal" className={styles.projectImage} style={{ objectPosition: "top" }} />
                  <div className={styles.projectContent}>
                    <div className={styles.projectHeader}>
                      <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.2s" }}>
                        <Layout className={styles.projectIcon} size={36} />
                      </motion.div>
                      <a href="https://occssg.org/" target="_blank" rel="noopener noreferrer" className={styles.projectLink} aria-label="Live Site"><ExternalLink size={20} /></a>
                    </div>
                    <h3 className={styles.projectTitle}>OCCSSG Portal</h3>
                    <p className={styles.projectRole}><strong>Role:</strong> Full Stack Developer</p>
                    <p className={styles.projectDesc}>A highly robust full-stack Next.js portal featuring community engagement, research publications, and events tracking. Includes a custom CMS admin panel, a user panel, and a NestJS server for APIs. Admins can post events, while users can join them and get tickets seamlessly.</p>
                    <ul className={styles.projectWorkings}>
                      <li>Built on Next.js 16 with App Router and React 19.</li>
                      <li>TailwindCSS v4 implementation for rapid responsive styling.</li>
                      <li>Integrated Katex for complex mathematical rendering.</li>
                    </ul>
                    <div className={styles.projectTechStack}>
                      <span className={styles.techTag}>Next.js</span>
                      <span className={styles.techTag}>React 19</span>
                      <span className={styles.techTag}>TailwindCSS v4</span>
                      <span className={styles.techTag}>TypeScript</span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>


              {/* House of Frac */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <TiltCard className={styles.projectCard}>
                  <img loading="lazy" src="/images/projects/house-of-frac.png" alt="House of Frac" className={styles.projectImage} style={{ objectPosition: "top" }} />
                  <div className={styles.projectContent}>
                    <div className={styles.projectHeader}>
                      <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.8s" }}>
                        <Layout className={styles.projectIcon} size={36} />
                      </motion.div>
                      <div className={styles.projectLinks}>
                        {/* TODO: Replace staging URL with production URL */}
                        <a href="https://staging.houseoffrac.com/" target="_blank" rel="noopener noreferrer" className={styles.projectLink} aria-label="Live Site"><ExternalLink size={20} /></a>
                      </div>
                    </div>
                    <h3 className={styles.projectTitle}>House of Frac</h3>
                    <p className={styles.projectRole}><strong>Role:</strong> Frontend Developer</p>
                    <p className={styles.projectDesc}>An admin and frontend portal built for fractional ownership and seamless management, utilizing modern web frameworks.</p>
                    <ul className={styles.projectWorkings}>
                      <li>Interactive map integration utilizing Google Maps API.</li>
                      <li>Real-time socket connections with Socket.io-client & Firebase.</li>
                      <li>State of the art animations via GSAP and Framer Motion.</li>
                    </ul>
                    <div className={styles.projectTechStack}>
                      <span className={styles.techTag}>React 19</span>
                      <span className={styles.techTag}>Redux</span>
                      <span className={styles.techTag}>Firebase</span>
                      <span className={styles.techTag}>GSAP</span>
                    </div>
                    
                  </div>
                </TiltCard>
              </motion.div>


              {/* Mera Astro */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <TiltCard className={styles.projectCard}>
                  <img loading="lazy" src="/images/projects/mera-astro.png" alt="Mera Astro" className={styles.projectImage} style={{ objectPosition: "top" }} />
                  <div className={styles.projectContent}>
                    <div className={styles.projectHeader}>
                      <motion.div variants={floatAnimation} initial="hidden" animate="visible">
                        <Database className={styles.projectIcon} size={36} />
                      </motion.div>
                      <div className={styles.projectLinks}>
                        <a href="https://meraastro.com/" target="_blank" rel="noopener noreferrer" className={styles.projectLink} aria-label="Live Site"><ExternalLink size={20} /></a>
                      </div>
                    </div>
                    <h3 className={styles.projectTitle}>Mera Astro</h3>
                    <p className={styles.projectRole}><strong>Role:</strong> Frontend Developer</p>
                    <p className={styles.projectDesc}>An astrology platform bringing together rich user experiences, daily predictions, and specialized features tailored for users seeking astrological guidance. Features an intelligent AI chatbot to guide users through astrological consultations.</p>
                    <ul className={styles.projectWorkings}>
                      <li>Robust frontend built with React 19 & Vite.</li>
                      <li>Utilized Material UI (MUI) for accessible components.</li>
                      <li>Advanced form handling and global state via Zustand.</li>
                    </ul>
                    <div className={styles.projectTechStack}>
                      <span className={styles.techTag}>React 19</span>
                      <span className={styles.techTag}>Vite</span>
                      <span className={styles.techTag}>MUI</span>
                      <span className={styles.techTag}>Zustand</span>
                    </div>
                    
                  </div>
                </TiltCard>
              </motion.div>


              {/* Bridgekey */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <TiltCard className={styles.projectCard}>
                  <img loading="lazy" src="/images/projects/bridgekey.png" alt="Bridgekey" className={styles.projectImage} style={{ objectPosition: 'top' }} />
                  <div className={styles.projectContent}>
                    <div className={styles.projectHeader}>
                      <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.4s" }}>
                        <Code2 className={styles.projectIcon} size={28} />
                      </motion.div>
                      <div className={styles.projectLinks}>
                        <a href="https://portfolio.bridgekey.io/" target="_blank" rel="noopener noreferrer" className={styles.projectLink} aria-label="Live Site"><ExternalLink size={20} /></a>
                      </div>
                    </div>
                    <h3 className={styles.projectTitle}>Bridgekey</h3>
                    <p className={styles.projectRole}><strong>Role:</strong> Frontend Developer</p>
                    <p className={styles.projectDesc}>An interactive platform tailored for the Solana ecosystem, enabling seamless token connections and community engagement.</p>
                    <ul className={styles.projectWorkings}>
                      <li>Dynamic React UI with optimized Webpack builds.</li>
                      <li>Integration of Redux Saga for side-effect management.</li>
                      <li>Fully localized interface with react-i18next.</li>
                    </ul>
                    <div className={styles.projectTechStack}>
                      <span className={styles.techTag}>React</span>
                      <span className={styles.techTag}>Redux</span>
                      <span className={styles.techTag}>TailwindCSS</span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>


              {/* MST Mint Portal & DAO */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <TiltCard className={styles.projectCard}>
                  <img loading="lazy" src="/images/projects/mst-mint.png" alt="MST Mint Portal & DAO" className={styles.projectImage} style={{ objectPosition: "top" }} />
                  <div className={styles.projectContent}>
                    <div className={styles.projectHeader}>
                      <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.4s" }}>
                        <Code2 className={styles.projectIcon} size={36} />
                      </motion.div>
                      <a href="https://dao.mstblockchain.com/" target="_blank" rel="noopener noreferrer" className={styles.projectLink} aria-label="Live Site"><ExternalLink size={20} /></a>
                    </div>
                    <h3 className={styles.projectTitle}>MST Mint Portal & DAO</h3>
                    <p className={styles.projectRole}><strong>Role:</strong> Frontend Developer</p>
                    <p className={styles.projectDesc}>A decentralized Web3 platform interface enabling secure token minting, DAO interactions, and governance.</p>
                    <ul className={styles.projectWorkings}>
                      <li>Next.js based decentralized application interface.</li>
                      <li>Framer Motion for fluid micro-interactions and transitions.</li>
                      <li>Schema validation and forms using Zod and React Hook Form.</li>
                    </ul>
                    <div className={styles.projectTechStack}>
                      <span className={styles.techTag}>Next.js</span>
                      <span className={styles.techTag}>Framer Motion</span>
                      <span className={styles.techTag}>TailwindCSS v4</span>
                      <span className={styles.techTag}>Zod</span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>


              {/* Chain Pay */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <TiltCard className={styles.projectCard}>
                  <img loading="lazy" src="/images/projects/chain-pay.png" alt="Chain Pay" className={styles.projectImage} style={{ objectPosition: 'top' }} />
                  <div className={styles.projectContent}>
                    <div className={styles.projectHeader}>
                      <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.6s" }}>
                        <Database className={styles.projectIcon} size={36} />
                      </motion.div>
                      <a href="https://chainpay.biz/" target="_blank" rel="noopener noreferrer" className={styles.projectLink} aria-label="Live Site"><ExternalLink size={20} /></a>
                    </div>
                    <h3 className={styles.projectTitle}>Chain Pay</h3>
                    <p className={styles.projectRole}><strong>Role:</strong> Frontend Developer</p>
                    <p className={styles.projectDesc}>A comprehensive merchant and admin application for managing blockchain-based payments efficiently.</p>
                    <ul className={styles.projectWorkings}>
                      <li>Built heavily dynamic interfaces using React and Redux Toolkit.</li>
                      <li>Implemented complex data visualizations with Recharts & ApexCharts.</li>
                      <li>Leveraged GSAP & Framer Motion for high-fidelity animations.</li>
                    </ul>
                    <div className={styles.projectTechStack}>
                      <span className={styles.techTag}>React</span>
                      <span className={styles.techTag}>Redux</span>
                      <span className={styles.techTag}>GSAP</span>
                      <span className={styles.techTag}>Webpack</span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>

            </div>
          </motion.div>
        </section>

        
        {/* Contact Section */}
        <section id="contact" className={`${styles.section} ${styles.contactSection}`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="glass-panel" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: "1rem" }}>Get In Touch</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "3rem" }}>
              I&apos;m open to new opportunities. If you have a project or role in mind, I&apos;d love to hear from you.
            </p>

            {/* Success Banner */}
            <AnimatePresence>
              {formStatus === "success" && (
                <motion.div
                  className={styles.formSuccess}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className={styles.formSuccessIcon}>✓</span>
                  <div>
                    <strong>Message sent successfully!</strong>
                    <p>Thanks for reaching out. I&apos;ll get back to you as soon as possible.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Banner */}
            <AnimatePresence>
              {formStatus === "error" && (
                <motion.div
                  className={styles.formError}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <span>⚠</span>
                  <div>
                    <strong>Something went wrong.</strong>
                    <p>Please try again later.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form className={styles.contactForm} onSubmit={handleFormSubmit} noValidate>
              <div className={styles.formGroup}>
                <div className={styles.formField}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name *"
                    value={formData.name}
                    onChange={handleFormChange}
                    onBlur={handleFormBlur}
                    onKeyDown={handleNameKeyDown}
                    onPaste={handleNamePaste}
                    className={`${styles.inputField} ${formErrors.name ? styles.inputError : formTouched.name && !formErrors.name ? styles.inputValid : ""}`}
                    disabled={formStatus === "sending" || formStatus === "success"}
                    autoComplete="name"
                  />
                  {formErrors.name && <span className={styles.fieldError}>{formErrors.name}</span>}
                </div>
                <div className={styles.formField}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleFormChange}
                    onBlur={handleFormBlur}
                    className={`${styles.inputField} ${formErrors.email ? styles.inputError : formTouched.email && !formErrors.email ? styles.inputValid : ""}`}
                    disabled={formStatus === "sending" || formStatus === "success"}
                    autoComplete="email"
                  />
                  {formErrors.email && <span className={styles.fieldError}>{formErrors.email}</span>}
                </div>
              </div>
              <div className={styles.formField}>
                <textarea
                  name="message"
                  placeholder="Message * (min. 10 characters)"
                  value={formData.message}
                  onChange={handleFormChange}
                  onBlur={handleFormBlur}
                  className={`${styles.inputField} ${formErrors.message ? styles.inputError : formTouched.message && !formErrors.message ? styles.inputValid : ""}`}
                  rows={5}
                  disabled={formStatus === "sending" || formStatus === "success"}
                />
                {formErrors.message && <span className={styles.fieldError}>{formErrors.message}</span>}
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{ marginTop: "1rem", width: "100%", opacity: (!isFormValid || formStatus === "sending" || formStatus === "success") ? 0.5 : 1, cursor: (!isFormValid || formStatus === "sending" || formStatus === "success") ? "not-allowed" : "pointer", transition: "opacity 0.3s ease" }}
                disabled={!isFormValid || formStatus === "sending" || formStatus === "success"}
              >
                <span className="btn-primary-content">
                  {formStatus === "sending" ? "Sending…" : formStatus === "success" ? "Message Sent ✓" : "Say Hello"}
                </span>
              </button>
            </form>

            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <Mail size={20} className="gradient-text" />
                <span>kpiplaj0108@gmail.com</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={20} className="gradient-text" />
                <span>+91 9340531981</span>
              </div>
            </div>
          </motion.div>
        </section>


      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>Designed & Built by Kirti Kumar Piplaj</p>
          <div className={styles.socialLinks} style={{ marginTop: "1rem", justifyContent: "center" }}>
            <a href="https://linkedin.com/in/kirti-kumar01" target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="LinkedIn"><FaLinkedin size={20} /></a>
            <a href="https://github.com/kirtikumar01" target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="GitHub"><FaGithub size={20} /></a>
          </div>
        </div>
      </footer>
    </>
  );
}
