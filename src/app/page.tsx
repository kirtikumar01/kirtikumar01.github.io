"use client";

import { motion } from "framer-motion";
import { Mail, Phone, ExternalLink, Code2, Database, Layout, Terminal, Sparkles, Gamepad2, Tv, Bot, ChevronDown } from "lucide-react";
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

  // Close mobile menu when navigating
  const handleNavClick = () => setMobileMenuOpen(false);

  // Form validation
  const validateField = (name: string, value: string): string => {
    if (name === "name") {
      if (!value.trim()) return "Name is required.";
      if (value.trim().length < 2) return "Name must be at least 2 characters.";
    }
    if (name === "email") {
      if (!value.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email.";
    }
    if (name === "message") {
      if (!value.trim()) return "Message is required.";
      if (value.trim().length < 10) return "Message must be at least 10 characters.";
    }
    return "";
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formTouched[name as keyof typeof formTouched]) {
      setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleFormBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormTouched(prev => ({ ...prev, [name]: true }));
    setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const isFormValid =
    formData.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.message.trim().length >= 10;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Touch all fields to show all errors
    setFormTouched({ name: true, email: true, message: true });
    const errors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };
    setFormErrors(errors);
    if (errors.name || errors.email || errors.message) return;

    setFormStatus("sending");
    try {
      // Replace YOUR_FORMSPREE_ID with your actual Formspree form ID
      // Sign up free at https://formspree.io → create a form → copy the ID
      const res = await fetch("https://formspree.io/f/mkjgbovd", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, message: formData.message }),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setFormTouched({ name: false, email: false, message: false });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
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
          </div>
        </motion.div>
      </nav>

      <div ref={containerRef} className={`container ${styles.pageWrapper}`}>

        {/* Hero Section */}
        <section id="home" className={`${styles.section} ${styles.hero}`}>
          <motion.div className={styles.heroContent} initial="hidden" animate="visible" variants={fadeIn}>
            <motion.div className={styles.heroBadge} style={{ y: yImages }}>
              <span className={styles.pulseDot}></span> Available for new opportunities
            </motion.div>
            <h1 className={styles.heroTitle}>
              Crafting Digital Experiences as a
              <br />
              <TypeAnimation
                sequence={[
                  'Frontend Developer',
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
              Hi, I'm Kirti Kumar Piplaj
            </h2>
            <motion.p className={styles.heroDescription} variants={fadeIn}>
              I specialize in building exceptional digital experiences. Currently, I&apos;m focused on building accessible, human-centered products using modern web technologies. Recently, I have also ventured deep into the world of AI—doing <strong>vibe coding</strong>, meaning I can build almost anything you can imagine just by using prompts!
            </motion.p>
            <div className={styles.heroCta}>
              <a href="#projects" className="btn-primary">
                <span className="btn-primary-content">Explore My Work</span>
              </a>
              <a href="#contact" className="btn-secondary">Let&apos;s Talk</a>
            </div>
            <div className={styles.socialLinks}>
              <a href="https://linkedin.com/in/kirti-kumar01" target="_blank" rel="noreferrer" aria-label="LinkedIn Profile" className={styles.socialIcon}><FaLinkedin size={24} /></a>
              <a href="mailto:kpiplaj0108@gmail.com" aria-label="Send Email" className={styles.socialIcon}><Mail size={24} /></a>
              <a href="tel:+919340531981" aria-label="Call Phone" className={styles.socialIcon}><Phone size={24} /></a>
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
              alt="Kirti Kumar Piplaj - Senior Frontend Developer"
              className={styles.heroAvatar}
              variants={floatAnimation}
              initial="hidden"
              animate="visible"
              loading="eager"
              decoding="async"
              style={{ willChange: 'transform' }}
            />
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div 
            className={styles.scrollIndicator}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <a href="#about" aria-label="Scroll to About"><ChevronDown size={32} className="gradient-text" /></a>
          </motion.div>
        </section>

        {/* About & Skills Section */}
        <section id="about" className={styles.section}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}>
            <motion.h2 className={styles.sectionTitle} style={{ y: yBg }}>About Me & Vibe</motion.h2>
            <div className={styles.aboutContainer}>
              <div className={styles.aboutText}>
                <p>
                  Hello! My name is Kirti and I am a <strong>Senior Frontend Developer</strong> passionate about engineering highly interactive web applications. From translating complex Figma designs into pixel-perfect code to defining robust frontend architectures and conducting rigorous code reviews, my core expertise lies in building scalable, state-of-the-art user interfaces.
                </p>
                <p>
                  While I take pride in hand-crafting clean, optimized code manually, I have also strongly embraced the <strong>AI revolution</strong>. As an additional superpower, I leverage AI tools to practice <span className="gradient-text">vibe coding</span>. With advanced prompt engineering, I can rapidly prototype, debug, and augment my core development workflows by collaborating directly with LLMs!
                </p>

                {/* Hobbies Grid */}
                <h3 style={{ marginTop: "3rem", marginBottom: "2rem" }}>My Vibe & Interests</h3>
                <div className={styles.hobbiesGrid}>
                  <motion.div className={`glass-panel ${styles.hobbyCard}`} whileHover={{ scale: 1.05, rotate: -2 }}>
                    <Gamepad2 size={32} className="gradient-text" />
                    <h4>Gaming</h4>
                    <p>Competitive & story-driven games keep my reflexes sharp.</p>
                  </motion.div>
                  <motion.div className={`glass-panel ${styles.hobbyCard}`} whileHover={{ scale: 1.05, rotate: 2 }}>
                    <Tv size={32} className="gradient-text" />
                    <h4>Anime</h4>
                    <p>Huge fan of anime series; love the world-building and action.</p>
                  </motion.div>
                  <motion.div className={`glass-panel ${styles.hobbyCard}`} whileHover={{ scale: 1.05, rotate: -2 }}>
                    <Bot size={32} className="gradient-text" />
                    <h4>AI & Prompting</h4>
                    <p>Exploring LLMs and bending AI to my will with prompts.</p>
                  </motion.div>
                </div>
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
                    {["TailwindCSS", "Framer Motion", "GSAP", "MUI", "Shadcn/UI"].map(skill => (
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
                  <h4><Sparkles size={18} className="gradient-text" /> AI & Vibe Coding</h4>
                  <div className={styles.skillsList}>
                    {["Cursor", "Claude", "ChatGPT", "Codex", "Kiro", "Antigravity", "Prompt Engineering", "LLMs"].map(skill => (
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
                  <h4><Terminal size={18} className="gradient-text" /> Web3 Integration</h4>
                  <div className={styles.skillsList}>
                    {["Wagmi", "Viem", "Ethers.js", "MetaMask", "WalletConnect"].map(skill => (
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
                  <h4><Code2 size={18} className="gradient-text" /> Backend & Tools</h4>
                  <div className={styles.skillsList}>
                    {["NestJS", "Node.js", "Firebase", "Git", "AWS S3", "Vercel"].map(skill => (
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

          {/* Scroll Down Indicator */}
          <motion.div 
            className={styles.scrollIndicator}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <a href="#experience" aria-label="Scroll to Experience"><ChevronDown size={32} className="gradient-text" /></a>
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
                  <div className={styles.timelineDate}>Indore, India | 08/2024 - Present</div>
                  <ul className={styles.projectWorkings}>
                    <li>Build and maintain production-grade frontend applications across Web3, fintech, and astrology domains using React, Next.js, and TypeScript.</li>
                    <li>Leverage Antigravity AI IDE and prompt engineering for AI-assisted development — shipping features end-to-end without UI designs, accelerating delivery by 3-5x.</li>
                  </ul>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className={`${styles.timelineBlock} ${styles.timelineBlockRight}`}>
                <div className={styles.timelineDot}></div>
                <div className={`glass-panel ${styles.timelineContent}`}>
                  <h3 className={styles.timelineRole}>Frontend Developer <span className="gradient-text">@ Web Impact Software Solutions</span></h3>
                  <div className={styles.timelineDate}>Indore | 09/2023 - 07/2024</div>
                  <ul className={styles.projectWorkings}>
                    <li>Spearheaded the development of the core product utilizing Vue.js and Tailwind CSS.</li>
                    <li>Collaborated with design teams to ensure pixel-perfect implementation of UI mockups.</li>
                    <li>Improved overall application performance and maintained highly reusable component libraries.</li>
                  </ul>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className={`${styles.timelineBlock} ${styles.timelineBlockLeft}`}>
                <div className={styles.timelineDot}></div>
                <div className={`glass-panel ${styles.timelineContent}`}>
                  <h3 className={styles.timelineRole}>Frontend Developer <span className="gradient-text">@ Jona</span></h3>
                  <div className={styles.timelineDate}>USA (Remote) | 04/2022 - 11/2022</div>
                  <ul className={styles.projectWorkings}>
                    <li>Developed a high-performance Next.js web application for selling curated journalists lists.</li>
                    <li>Integrated Material UI (MUI) to rapidly build a consistent and accessible design system.</li>
                    <li>Worked asynchronously with international teams, delivering features on strict deadlines.</li>
                  </ul>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className={`${styles.timelineBlock} ${styles.timelineBlockRight}`}>
                <div className={styles.timelineDot}></div>
                <div className={`glass-panel ${styles.timelineContent}`}>
                  <h3 className={styles.timelineRole}>Software Engineer <span className="gradient-text">@ Bellurbis Technologies</span></h3>
                  <div className={styles.timelineDate}>Indore | 09/2021 - 03/2022</div>
                  <ul className={styles.projectWorkings}>
                    <li>Built a comprehensive recruitment management system using React.js.</li>
                    <li>Implemented complex state management using Redux, handling vast amounts of candidate data.</li>
                    <li>Designed features enabling organizations to streamline their hiring processes efficiently.</li>
                  </ul>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className={`${styles.timelineBlock} ${styles.timelineBlockLeft}`}>
                <div className={styles.timelineDot}></div>
                <div className={`glass-panel ${styles.timelineContent}`}>
                  <h3 className={styles.timelineRole}>Internship - Frontend Developer <span className="gradient-text">@ HemansAI</span></h3>
                  <div className={styles.timelineDate}>Indore | 01/2021 - 03/2021</div>
                  <ul className={styles.projectWorkings}>
                    <li>Developed RTBAnalytica, a web app showcasing services and offerings using HTML, CSS, and JS.</li>
                    <li>Gained hands-on experience with Bootstrap for rapid responsive design prototyping.</li>
                  </ul>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div 
            className={styles.scrollIndicator}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <a href="#projects" aria-label="Scroll to Projects"><ChevronDown size={32} className="gradient-text" /></a>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="projects" className={styles.section}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <motion.h2 className={styles.sectionTitle} style={{ y: yBg }}>Some Things I&apos;ve Built</motion.h2>
            <p className={styles.sectionSubtitle}>A collection of projects showcasing my expertise in modern web development.</p>

            <div className={styles.projectsGrid}>


              {/* House of Frac */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <TiltCard className={styles.projectCard}>
                  <div className={styles.projectContent}>
                    <div className={styles.projectHeader}>
                      <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.8s" }}>
                        <Layout className={styles.projectIcon} size={36} />
                      </motion.div>
                      <a href="https://staging.houseoffrac.com/" target="_blank" rel="noopener noreferrer" className={styles.projectLink}><ExternalLink size={20} /></a>
                    </div>
                    <h3 className={styles.projectTitle}>House of Frac</h3>
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
                  <div className={styles.projectContent}>
                    <div className={styles.projectHeader}>
                      <motion.div variants={floatAnimation} initial="hidden" animate="visible">
                        <Database className={styles.projectIcon} size={36} />
                      </motion.div>
                      <a href="https://meraastro.com/" target="_blank" rel="noopener noreferrer" className={styles.projectLink}><ExternalLink size={20} /></a>
                    </div>
                    <h3 className={styles.projectTitle}>Mera Astro</h3>
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

              {/* OCCSS Portal */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <TiltCard className={styles.projectCard}>
                  <div className={styles.projectContent}>
                    <div className={styles.projectHeader}>
                      <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.2s" }}>
                        <Layout className={styles.projectIcon} size={36} />
                      </motion.div>
                      <a href="https://occssg.org/" target="_blank" rel="noopener noreferrer" className={styles.projectLink}><ExternalLink size={20} /></a>
                    </div>
                    <h3 className={styles.projectTitle}>OCCSSG Portal</h3>
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

              {/* Bridgekey */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <TiltCard className={styles.projectCard}>
                  <img src="/images/projects/bridgekey.png" alt="Bridgekey" className={styles.projectImage} style={{ objectPosition: 'top' }} />
                  <div className={styles.projectContent}>
                    <div className={styles.projectHeader}>
                      <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.4s" }}>
                        <Code2 className={styles.projectIcon} size={28} />
                      </motion.div>
                      <a href="https://portfolio.bridgekey.io/" target="_blank" rel="noopener noreferrer" className={styles.projectLink}><ExternalLink size={20} /></a>
                    </div>
                    <h3 className={styles.projectTitle}>Bridgekey</h3>
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
                  <div className={styles.projectContent}>
                    <div className={styles.projectHeader}>
                      <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.4s" }}>
                        <Code2 className={styles.projectIcon} size={36} />
                      </motion.div>
                      <a href="https://dao.mstblockchain.com/" target="_blank" rel="noopener noreferrer" className={styles.projectLink}><ExternalLink size={20} /></a>
                    </div>
                    <h3 className={styles.projectTitle}>MST Mint Portal & DAO</h3>
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
                  <div className={styles.projectContent}>
                    <div className={styles.projectHeader}>
                      <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.6s" }}>
                        <Database className={styles.projectIcon} size={36} />
                      </motion.div>
                      <a href="https://chainpay.biz/" target="_blank" rel="noopener noreferrer" className={styles.projectLink}><ExternalLink size={20} /></a>
                    </div>
                    <h3 className={styles.projectTitle}>Chain Pay</h3>
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

          {/* Scroll Down Indicator */}
          <motion.div 
            className={styles.scrollIndicator}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <a href="#contact" aria-label="Scroll to Contact"><ChevronDown size={32} className="gradient-text" /></a>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className={`${styles.section} ${styles.contactSection}`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="glass-panel" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: "1rem" }}>Get In Touch</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "3rem" }}>
              Although I&apos;m currently looking for any new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
            </p>

            {/* Success Banner */}
            {formStatus === "success" && (
              <motion.div
                className={styles.formSuccess}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className={styles.formSuccessIcon}>✓</span>
                <div>
                  <strong>Message sent successfully!</strong>
                  <p>Thanks for reaching out. I&apos;ll get back to you as soon as possible.</p>
                </div>
              </motion.div>
            )}

            {/* Error Banner */}
            {formStatus === "error" && (
              <motion.div
                className={styles.formError}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>⚠</span>
                <div>
                  <strong>Something went wrong.</strong>
                  <p>Please try again or email me directly at kpiplaj0108@gmail.com</p>
                </div>
              </motion.div>
            )}

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
            <a href="https://linkedin.com/in/kirti-kumar01" target="_blank" rel="noreferrer" className={styles.socialIcon}><FaLinkedin size={20} /></a>
            <a href="https://github.com/" target="_blank" rel="noreferrer" className={styles.socialIcon}><FaGithub size={20} /></a>
          </div>
        </div>
      </footer>
    </>
  );
}
