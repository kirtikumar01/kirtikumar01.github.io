import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import styles from "./page.module.css";

// Use standard type instead of Next 15's Promise type for params, as this is Next.js 14/15 depending on version. 
// Next.js 14 and earlier use synchronous params. Next.js 15+ allows async/Promise params. We will define it as synchronous as standard, but handle both if needed.
// Wait, the project is Next.js 16.3 according to the logs. So params is a Promise!
type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return [
    { slug: "house-of-frac" },
    { slug: "mera-astro" },
    { slug: "mst-mint-portal" },
  ];
}

const projectsData: Record<string, any> = {
  "house-of-frac": {
    title: "House of Frac",
    role: "[ADD ROLE]",
    overview: "An admin and frontend portal built for fractional ownership and seamless management, utilizing modern web frameworks. It allows users to easily invest in fractional real estate assets.",
    techStack: ["React 19", "Redux", "Firebase", "GSAP", "Google Maps API"],
    keyChallenge: "[ADD KEY CHALLENGE]",
    solution: "[ADD SOLUTION]",
    result: "[ADD RESULT]",
    liveLink: "https://staging.houseoffrac.com/", // TODO: Replace staging URL with production URL
    githubLink: "https://github.com/[ADD REPO]",
  },
  "mera-astro": {
    title: "Mera Astro",
    role: "[ADD ROLE]",
    overview: "An astrology platform bringing together rich user experiences, daily predictions, and specialized features tailored for users seeking astrological guidance.",
    techStack: ["React 19", "Vite", "MUI", "Zustand"],
    keyChallenge: "[ADD KEY CHALLENGE]",
    solution: "[ADD SOLUTION]",
    result: "[ADD RESULT]",
    liveLink: "https://meraastro.com/",
    githubLink: "https://github.com/[ADD REPO]",
  },
  "mst-mint-portal": {
    title: "MST Mint Portal & DAO",
    role: "[ADD ROLE]",
    overview: "A decentralized Web3 platform interface enabling secure token minting, DAO interactions, and governance.",
    techStack: ["Next.js", "Framer Motion", "TailwindCSS v4", "Zod", "React Hook Form"],
    keyChallenge: "[ADD KEY CHALLENGE]",
    solution: "[ADD SOLUTION]",
    result: "[ADD RESULT]",
    liveLink: "https://dao.mstblockchain.com/",
    githubLink: "https://github.com/[ADD REPO]",
  },
};

export default async function ProjectPage(props: { params: Params }) {
  const params = await props.params;
  const project = projectsData[params.slug];

  if (!project) {
    notFound();
  }

  const isProd = process.env.NODE_ENV === "production";

  // Helper to conditionally render blocks if they have unfilled placeholders in production
  const renderBlock = (title: string, content: string) => {
    if (isProd && content.includes("[ADD")) {
      return null;
    }
    return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.content}>{content}</p>
      </div>
    );
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back to Portfolio
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>{project.title}</h1>
          
          <div className={styles.links}>
            {(!isProd || !project.githubLink.includes("[ADD")) && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className={styles.link}>
                <FaGithub size={20} />
                View Source
              </a>
            )}
            {(!isProd || !project.liveLink.includes("[ADD")) && (
              <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className={styles.link}>
                <ExternalLink size={20} />
                Visit Live Site
              </a>
            )}
          </div>
        </header>

        <div className={styles.contentWrapper}>
          {renderBlock("Overview", project.overview)}
          {renderBlock("My Role", project.role)}

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Tech Stack</h2>
            <div className={styles.tags}>
              {project.techStack.map((tech: string) => (
                <span key={tech} className={styles.tag}>{tech}</span>
              ))}
            </div>
          </div>

          {renderBlock("Key Challenge", project.keyChallenge)}
          {renderBlock("Solution", project.solution)}
          {renderBlock("Result", project.result)}
        </div>
      </div>
    </main>
  );
}
