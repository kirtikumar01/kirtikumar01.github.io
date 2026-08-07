"use client";

import { motion } from "framer-motion";
import { Mail, Phone, ExternalLink, Code2, Database, Layout, Terminal, Sparkles, Gamepad2, Tv, Bot } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import TiltCard from "../components/TiltCard";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const yImages = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "experience", "projects", "contact"];
      const scrollY = window.scrollY;
      
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
        </div>
      </nav>

      <div ref={containerRef} className={`container ${styles.pageWrapper}`}>
        
        {/* Hero Section */}
        <section id="home" className={`${styles.section} ${styles.hero}`}>
          <motion.div className={styles.heroContent} initial="hidden" animate="visible" variants={fadeIn}>
            <motion.div className={styles.heroBadge} style={{ y: yImages }}>
              <span className={styles.pulseDot}></span> Available for new opportunities
            </motion.div>
            <motion.h1 className={styles.heroTitle} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, type: "spring" }}>
              Crafting Digital Experiences as a <br />
              <span className="gradient-text">Frontend Developer</span>
            </motion.h1>
            <h2 className={styles.heroSubtitle}>Hi, I&apos;m Kirti Kumar Piplaj</h2>
            <p className={styles.heroDescription}>
              I specialize in building exceptional digital experiences. Currently, I&apos;m focused on building accessible, human-centered products using modern web technologies. Recently, I have also ventured deep into the world of AI—doing <strong>vibe coding</strong>, meaning I can build almost anything you can imagine just by using prompts!
            </p>
            <div className={styles.heroCta}>
              <a href="#projects" className="btn-primary">
                <span className="btn-primary-content">Explore My Work</span>
              </a>
              <a href="#contact" className="btn-secondary">Let&apos;s Talk</a>
            </div>
            <div className={styles.socialLinks}>
              <a href="https://linkedin.com/in/kirti-kumar01" target="_blank" rel="noreferrer" className={styles.socialIcon}><FaLinkedin size={24} /></a>
              <a href="mailto:kpiplaj0108@gmail.com" className={styles.socialIcon}><Mail size={24} /></a>
              <a href="tel:9340531981" className={styles.socialIcon}><Phone size={24} /></a>
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
              alt="Kirti Avatar" 
              className={styles.heroAvatar}
              variants={floatAnimation}
              initial="hidden"
              animate="visible"
            />
          </motion.div>
        </section>

        {/* About & Skills Section */}
        <section id="about" className={styles.section}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}>
            <h2 className={styles.sectionTitle}>About Me & Vibe</h2>
            <div className={styles.aboutGrid}>
              <div className={styles.aboutText}>
                <p>
                  Hello! My name is Kirti and I enjoy creating things that live on the internet. What started as hacking together simple HTML & CSS has evolved into a full-fledged passion for engineering highly interactive web applications.
                </p>
                <p>
                  Beyond traditional coding, I have strongly embraced the <strong>AI revolution</strong>. I am constantly working on AI integrations and doing <span className="gradient-text">vibe coding</span>. With advanced prompt engineering, I can rapidly prototype, debug, and build entire software architectures just by chatting with LLMs!
                </p>
                
                {/* Hobbies Grid */}
                <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>My Vibe & Interests</h3>
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

              <div className={styles.skillsContainer}>
                <h3>Technical Arsenal</h3>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <motion.div variants={fadeIn} className={styles.skillCategory}>
                    <h4><Layout size={18} className="gradient-text"/> Core Frontend</h4>
                    <div className={styles.skillsList}>
                      {["ReactJS", "NextJS", "Vuejs", "Javascript", "HTML5", "CSS3"].map(skill => (
                        <span key={skill} className={styles.skillBadge}>{skill}</span>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div variants={fadeIn} className={styles.skillCategory}>
                    <h4><Code2 size={18} className="gradient-text"/> Styling & UI</h4>
                    <div className={styles.skillsList}>
                      {["TailwindCSS", "Bootstrap", "MUI", "Framer Motion", "Vanilla CSS"].map(skill => (
                        <span key={skill} className={styles.skillBadge}>{skill}</span>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div variants={fadeIn} className={styles.skillCategory}>
                    <h4><Sparkles size={18} className="gradient-text"/> AI & Vibe Coding</h4>
                    <div className={styles.skillsList}>
                      {["Prompt Engineering", "Vibe Coding", "LLM Integrations", "AI Agents"].map(skill => (
                        <span key={skill} className={styles.skillBadge}>{skill}</span>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div variants={fadeIn} className={styles.skillCategory}>
                    <h4><Terminal size={18} className="gradient-text"/> Tools & Others</h4>
                    <div className={styles.skillsList}>
                      {["Git", "Redux", "Google Analytics", "Python (Basic)"].map(skill => (
                        <span key={skill} className={styles.skillBadge}>{skill}</span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section id="experience" className={styles.section}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <h2 className={styles.sectionTitle}>Where I&apos;ve Worked</h2>
            <div className={styles.timeline}>
              
              <motion.div variants={fadeIn} className={styles.timelineBlock}>
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

              <motion.div variants={fadeIn} className={styles.timelineBlock}>
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

              <motion.div variants={fadeIn} className={styles.timelineBlock}>
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

              <motion.div variants={fadeIn} className={styles.timelineBlock}>
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
        </section>

        {/* Projects Section */}
        <section id="projects" className={styles.section}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <h2 className={styles.sectionTitle}>Some Things I&apos;ve Built</h2>
            <p className={styles.sectionSubtitle}>A collection of projects showcasing my expertise in modern web development.</p>
            
            <div className={styles.projectsGrid}>
              
              {/* Cryptiva */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>\n                <TiltCard className={styles.projectCard}>
                <img src="/images/projects/cryptiva.png" alt="Cryptiva" className={styles.projectImage} style={{ objectPosition: 'top' }} />
                <div className={styles.projectContent}>
                  <div className={styles.projectHeader}>
                    <motion.div variants={floatAnimation} initial="hidden" animate="visible">
                      <Layout className={styles.projectIcon} size={28} />
                    </motion.div>
                    <a href="#" className={styles.projectLink}><ExternalLink size={20} /></a>
                  </div>
                  <h3 className={styles.projectTitle}>Cryptiva</h3>
                  <p className={styles.projectDesc}>A premium Web3 platform offering transparency, DAO governance, and decentralized token staking.</p>
                  <ul className={styles.projectWorkings}>
                    <li>Robust frontend built with React & Redux Toolkit.</li>
                    <li>Highly animated UI utilizing Framer Motion.</li>
                    <li>Integrated i18n for multilingual support.</li>
                  </ul>
                  <div className={styles.projectTechStack}>
                    <span className={styles.techTag}>React</span>
                    <span className={styles.techTag}>Redux</span>
                    <span className={styles.techTag}>Framer</span>
                    <span className={styles.techTag}>Webpack</span>
                  </div>
                </div>
              </TiltCard>
              </motion.div>

              {/* Art & Ode Portal */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>\n                <TiltCard className={styles.projectCard}>
                <img src="/images/projects/art-and-ode.png" alt="Art & Ode" className={styles.projectImage} style={{ objectFit: 'contain', padding: '2rem', background: '#fff' }} />
                <div className={styles.projectContent}>
                  <div className={styles.projectHeader}>
                    <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.2s" }}>
                      <Layout className={styles.projectIcon} size={28} />
                    </motion.div>
                    <a href="#" className={styles.projectLink}><ExternalLink size={20} /></a>
                  </div>
                  <h3 className={styles.projectTitle}>Art & Ode Portal</h3>
                  <p className={styles.projectDesc}>A high-performance modern web application for art discovery and interactive audio experiences.</p>
                  <ul className={styles.projectWorkings}>
                    <li>Next-generation React 19 & Vite architecture.</li>
                    <li>Real-time database integration via Firebase.</li>
                    <li>Complex state management using Zustand & React Query.</li>
                  </ul>
                  <div className={styles.projectTechStack}>
                    <span className={styles.techTag}>React 19</span>
                    <span className={styles.techTag}>Vite</span>
                    <span className={styles.techTag}>Firebase</span>
                    <span className={styles.techTag}>Zustand</span>
                  </div>
                </div>
              </TiltCard>
              </motion.div>

              {/* Bridgekey */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>\n                <TiltCard className={styles.projectCard}>
                <img src="/images/projects/bridgekey.png" alt="Bridgekey" className={styles.projectImage} style={{ objectPosition: 'top' }} />
                <div className={styles.projectContent}>
                  <div className={styles.projectHeader}>
                    <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.4s" }}>
                      <Code2 className={styles.projectIcon} size={28} />
                    </motion.div>
                    <a href="#" className={styles.projectLink}><ExternalLink size={20} /></a>
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

              {/* Jotlingo */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>\n                <TiltCard className={styles.projectCard}>
                <img src="/images/projects/jotlingo.png" alt="Jotlingo" className={styles.projectImage} style={{ objectFit: 'contain', padding: '2rem', background: '#fff' }} />
                <div className={styles.projectContent}>
                  <div className={styles.projectHeader}>
                    <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.6s" }}>
                      <Layout className={styles.projectIcon} size={28} />
                    </motion.div>
                    <a href="#" className={styles.projectLink}><ExternalLink size={20} /></a>
                  </div>
                  <h3 className={styles.projectTitle}>JotLingo</h3>
                  <p className={styles.projectDesc}>Hybrid AI and human-in-the-loop translation platform delivering publication-ready Hindi, Marathi, and Telugu translations.</p>
                  <ul className={styles.projectWorkings}>
                    <li>Developed highly scalable UI using React 19 and Vite.</li>
                    <li>Integrated real-time operations using Firebase and Zustand.</li>
                    <li>Implemented robust offline caching with IndexedDB and Workbox.</li>
                  </ul>
                  <div className={styles.projectTechStack}>
                    <span className={styles.techTag}>React 19</span>
                    <span className={styles.techTag}>Firebase</span>
                    <span className={styles.techTag}>Zustand</span>
                    <span className={styles.techTag}>IndexedDB</span>
                  </div>
                </div>
              </TiltCard>
              </motion.div>

                            {/* Mera Astro */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>\n                <TiltCard className={styles.projectCard}>
                <div className={styles.projectContent}>
                  <div className={styles.projectHeader}>
                    <motion.div variants={floatAnimation} initial="hidden" animate="visible">
                      <Database className={styles.projectIcon} size={36} />
                    </motion.div>
                    <a href="#" className={styles.projectLink}><ExternalLink size={20} /></a>
                  </div>
                  <h3 className={styles.projectTitle}>Mera Astro</h3>
                  <p className={styles.projectDesc}>An astrology platform bringing together rich user experiences, daily predictions, and specialized features tailored for users seeking astrological guidance.</p>
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
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>\n                <TiltCard className={styles.projectCard}>
                <div className={styles.projectContent}>
                  <div className={styles.projectHeader}>
                    <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.2s" }}>
                      <Layout className={styles.projectIcon} size={36} />
                    </motion.div>
                    <a href="#" className={styles.projectLink}><ExternalLink size={20} /></a>
                  </div>
                  <h3 className={styles.projectTitle}>OCCSS Portal</h3>
                  <p className={styles.projectDesc}>A highly robust Next.js portal featuring community engagement, research publications, and events tracking.</p>
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
              
              {/* MST Mint Portal & DAO */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>\n                <TiltCard className={styles.projectCard}>
                <div className={styles.projectContent}>
                  <div className={styles.projectHeader}>
                    <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.4s" }}>
                      <Code2 className={styles.projectIcon} size={36} />
                    </motion.div>
                    <a href="#" className={styles.projectLink}><ExternalLink size={20} /></a>
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
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>\n                <TiltCard className={styles.projectCard}>
                <div className={styles.projectContent}>
                  <div className={styles.projectHeader}>
                    <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.6s" }}>
                      <Database className={styles.projectIcon} size={36} />
                    </motion.div>
                    <a href="#" className={styles.projectLink}><ExternalLink size={20} /></a>
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
              
              {/* House of Frac */}
              <motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>\n                <TiltCard className={styles.projectCard}>
                <div className={styles.projectContent}>
                  <div className={styles.projectHeader}>
                    <motion.div variants={floatAnimation} initial="hidden" animate="visible" style={{ animationDelay: "0.8s" }}>
                      <Layout className={styles.projectIcon} size={36} />
                    </motion.div>
                    <a href="#" className={styles.projectLink}><ExternalLink size={20} /></a>
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
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className={`${styles.section} ${styles.contactSection}`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="glass-panel" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: "1rem" }}>Get In Touch</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "3rem" }}>
              Although I&apos;m currently looking for any new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
            </p>
            <div className={styles.contactForm}>
              <div className={styles.formGroup}>
                <input type="text" placeholder="Name" className={styles.inputField} />
                <input type="email" placeholder="Email" className={styles.inputField} />
              </div>
              <textarea placeholder="Message" className={styles.inputField} rows={5}></textarea>
              <button className="btn-primary" style={{ marginTop: "1rem", width: "100%" }}>
                <span className="btn-primary-content">Say Hello</span>
              </button>
            </div>
            
            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <Mail size={20} className="gradient-text"/>
                <span>kpiplaj0108@gmail.com</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={20} className="gradient-text"/>
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
