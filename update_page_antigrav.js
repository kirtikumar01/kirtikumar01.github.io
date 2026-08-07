const fs = require('fs');

const tsxPath = '/home/mongoose/.gemini/antigravity-ide/scratch/kirti-portfolio/src/app/page.tsx';
let tsxContent = fs.readFileSync(tsxPath, 'utf8');

// 1. Imports
tsxContent = tsxContent.replace(
  'import { useState, useEffect } from "react";',
  'import { useState, useEffect, useRef } from "react";\nimport { useScroll, useTransform } from "framer-motion";\nimport TiltCard from "../components/TiltCard";'
);

// 2. Add scroll hooks and ref
tsxContent = tsxContent.replace(
  'const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });',
  'const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });\n  const containerRef = useRef(null);\n  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });\n  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);\n  const yImages = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);'
);

tsxContent = tsxContent.replace(
  '<div className={`container ${styles.pageWrapper}`}>',
  '<div ref={containerRef} className={`container ${styles.pageWrapper}`}>'
);

// 3. Add parallax to some floating elements (like the hero badge or something)
tsxContent = tsxContent.replace(
  '<div className={styles.heroBadge}>',
  '<motion.div className={styles.heroBadge} style={{ y: yImages }}>'
);
tsxContent = tsxContent.replace(
  '             <span className={styles.pulseDot}></span> Available for new opportunities\n            </div>',
  '             <span className={styles.pulseDot}></span> Available for new opportunities\n            </motion.div>'
);

// 4. Update project cards to use TiltCard
// The starting tag
tsxContent = tsxContent.replaceAll(
  '<motion.div variants={fadeIn} whileHover={{ y: -10 }} className={styles.projectCard}>',
  '<motion.div variants={fadeIn} style={{ height: "100%", display: "flex", flexDirection: "column" }}>\\n                <TiltCard className={styles.projectCard}>'
);

// The closing tag. I need to be careful. I will replace the block closing of project cards.
// Each project card ends with:
//                   </div>
//                 </div>
//               </motion.div>
// I can replace this pattern specific to the projects grid.

let gridStartIndex = tsxContent.indexOf('<div className={styles.projectsGrid}>');
let gridEndIndex = tsxContent.indexOf('</div>', tsxContent.indexOf('House of Frac'));
// We want to replace all closing motion.divs inside the grid.
let gridContent = tsxContent.substring(gridStartIndex, gridEndIndex + 500);

// We know each project card ends with:
//                   </div>
//                 </div>
//               </motion.div>
// Let's just use regex to replace the exact ending.
let updatedGridContent = gridContent.replaceAll(
  '                  </div>\n                </div>\n              </motion.div>',
  '                  </div>\n                </div>\n              </TiltCard>\n              </motion.div>'
);

tsxContent = tsxContent.replace(gridContent, updatedGridContent);

fs.writeFileSync(tsxPath, tsxContent);
console.log("Success");
