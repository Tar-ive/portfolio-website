/**
 * Content for the /v3 page. Everything the page renders lives here, the same
 * way stream-data.js holds everything the stream renders. Numbers come from
 * the stream and llms.txt, so the two pages can't drift apart.
 */

export const navigation = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Research", href: "#research" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  name: "Saksham Adhikari",
  mark: "॥",
  status: "incoming to Cal Hacks",
  tagline:
    "ML engineer working on inference, recsys, computer vision, and large-scale data. I ship models into production and publish the receipts.",
  interactionHint: "the kites follow your cursor",
  cta: {
    primary: { text: "Get in touch", href: "#contact" },
    secondary: { text: "Read the stream", href: "/" },
  },
};

export const sections = {
  metrics: {
    title: "By the numbers",
    description: "The receipts, counted.",
  },
  experience: {
    title: "Professional Experience",
    description:
      "Inference on hardware, health data at scale, and the teams in between.",
  },
  projects: { title: "Projects" },
  research: {
    title: "Research",
    description: "Papers where the modeling was mine to defend.",
  },
  education: {
    title: "Education",
    description: "Academic background and the stack I work in.",
  },
  contact: {
    title: "Get in touch",
    description:
      "Working on inference, ranking, or health data? I answer every note.",
  },
};

export const socials = [
  { label: "GitHub", href: "https://github.com/Tar-ive", icon: "Github" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/adhsaksham/",
    icon: "Linkedin",
  },
  { label: "X", href: "https://x.com/saksham_adh", icon: "Twitter" },
  { label: "Email", href: "mailto:pqo14@txstate.edu", icon: "Mail" },
];

export const contact = {
  email: "pqo14@txstate.edu",
  location: "Austin / San Marcos, Texas",
  substack: "https://adhsaksham.substack.com",
};

/** The GitHub calendar the stream already reads, reused here. */
export const github = {
  user: "Tar-ive",
  endpoint: "https://github-contributions-api.jogruber.de/v4/Tar-ive?y=last",
  profile: "https://github.com/Tar-ive",
};

export const metrics = [
  {
    value: "6",
    label: "hackathon wins",
    note: "NVIDIA, webAI, Vercel v0 × AWS, UT Law, TXST, Novo",
  },
  {
    value: "~130k",
    label: "records indexed",
    note: "Cancer-care records, semantically searchable at BCRC",
  },
  {
    value: "180k+",
    label: "grants queryable",
    note: "Grants-MCP, 389+ downloads on PulseMCP",
  },
  {
    value: "~10,000",
    label: "hackers beaten",
    note: "Best Monetizable B2C App at H0, Vercel v0 × AWS",
  },
  {
    value: "78% → 91%",
    label: "test coverage",
    note: "Agentic healthcare stack at BCRC",
  },
  {
    value: "4.0",
    label: "GPA",
    note: "B.B.A. Computer Information Systems, Texas State",
  },
];

export type ExperienceEntry = {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  type: "engineering" | "research" | "leadership";
  bullets: string[];
  technologies: string[];
};

export const experience: ExperienceEntry[] = [
  {
    id: "askslm",
    title: "Machine Learning Engineer Intern",
    company: "AskSLM",
    location: "Austin, TX",
    period: "Nov 2025 — present",
    type: "engineering",
    bullets: [
      "Real-time CV and VLM pipelines on NVIDIA Jetson Thor (DeepStream) for threat detection with Texas county law enforcement.",
      "llama.cpp inference optimization, so the model fits the hardware it has to run on.",
      "The model runs next to the camera rather than in someone else's cloud, and it has to work at 2am.",
    ],
    technologies: ["Jetson Thor", "DeepStream", "llama.cpp", "VLM", "Python"],
  },
  {
    id: "google",
    title: "TPU Cloud Student Researcher",
    company: "Google",
    location: "Remote",
    period: "Aug — Oct 2025",
    type: "research",
    bullets: [
      "Selected for Google's TPU Cloud research program.",
      "Turned vLLM community signals into concrete inference-stack fixes for research scientists' TPU workloads.",
    ],
    technologies: ["vLLM", "TPU", "inference", "Python"],
  },
  {
    id: "thrc",
    title: "Data and AI Researcher",
    company: "Translational Health Research Center",
    location: "San Marcos, TX",
    period: "Mar 2025 — Jan 2026",
    type: "research",
    bullets: [
      "Co-authored an Environmental Epidemiology paper on PFAS exposure and cognition in firefighters, modeling with OLS, PCA, and Random Forest.",
      "Co-authored a cluster analysis of rural women's healthcare access that found 7 vulnerability profiles predicting access better than race or insurance status.",
      "Findings drove activation programs in the most vulnerable Texas counties.",
    ],
    technologies: ["OLS", "PCA", "Random Forest", "survey data", "Python"],
  },
  {
    id: "bcrc",
    title: "Software Engineer Intern",
    company: "Breast Cancer Resource Center",
    location: "Austin, TX",
    period: "May — Aug 2025",
    type: "engineering",
    bullets: [
      "Semantically indexed roughly 130,000 cancer-care records so staff could actually find them.",
      "Grew test coverage on an agentic healthcare stack from 78% to 91%.",
    ],
    technologies: ["semantic search", "agents", "Python", "testing"],
  },
  {
    id: "acm",
    title: "Vice President",
    company: "ACM AI @ TXST",
    location: "San Marcos, TX",
    period: "Dec 2024 — Aug 2025",
    type: "leadership",
    bullets: [
      "Led a 70+ member club building full-stack apps: a campus marketplace, and an ML professor-recommendation bot with an 87% positive rate across 484 interactions.",
      "Organized a 50-person debate across faculty, industry, and Texas government on the environmental impacts of AI, and raised $1.7k in sponsorships for it.",
    ],
    technologies: ["full-stack", "recsys", "community"],
  },
  {
    id: "obvius",
    title: "Founder",
    company: "Obvius",
    location: "Texas",
    period: "Dec 2024 — May 2025",
    type: "leadership",
    bullets: [
      "Founded and led product development for an AI-driven platform.",
    ],
    technologies: ["product", "AI"],
  },
  {
    id: "ai4all",
    title: "Machine Learning Fellow",
    company: "AI4ALL Ignite",
    location: "Remote",
    period: "Aug 2024 — Feb 2025",
    type: "research",
    bullets: [
      "Led a 5-person team training an SVM for early Alzheimer's detection on the Darwin dataset.",
      "Shipped the app and a 91%-accuracy poster.",
    ],
    technologies: ["SVM", "scikit-learn", "Streamlit"],
  },
  {
    id: "intern-nepal",
    title: "AI Intern",
    company: "Intern Nepal",
    location: "Remote",
    period: "Sep 2024 — Jan 2025",
    type: "engineering",
    bullets: [
      "AI/ML projects contributing to Nepal's growing tech ecosystem.",
    ],
    technologies: ["ML", "Python"],
  },
  {
    id: "dursikshya",
    title: "Data Science Intern",
    company: "Dursikshya Education Network",
    location: "Kathmandu, Nepal",
    period: "Mar — Jun 2023",
    type: "engineering",
    bullets: [
      "Applied data science to educational data, supporting analytics and reporting.",
    ],
    technologies: ["pandas", "analytics", "Python"],
  },
];

export type Project = {
  id: string;
  title: string;
  summary: string;
  tech: string[];
  links: { label: string; href: string; kind: "primary" | "code" }[];
  status?: string;
};

export const projects: Project[] = [
  {
    id: "giftmaxxing",
    title: "Giftmaxxing",
    summary:
      "An AI gift concierge that compresses inspiration → curation → purchase, so nobody freezes on what to get them. Best Monetizable B2C App at H0 (Vercel v0 × AWS, ~10,000 participants), then shipped to the App Store.",
    tech: ["iOS", "AWS", "v0", "recsys"],
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/giftmaxxing/id6788124639",
        kind: "primary",
      },
    ],
    status: "live on the App Store",
  },
  {
    id: "twobot",
    title: "TwoBot",
    summary:
      "A two-tower GenRecSys where on-device curator agents (MLX) evaluate candidates and write personalized surfacing notes. Live A/B of a recency baseline against two-tower + MMR on a 1,300-node simulation.",
    tech: ["MLX", "two-tower", "MMR", "agents"],
    links: [
      { label: "Code", href: "https://github.com/Tar-ive/twobot", kind: "code" },
    ],
  },
  {
    id: "rent-agent",
    title: "Rent Agent",
    summary:
      "Text a maintenance issue and the agent logs into RentCafe, files the work order, and screenshots the confirmation. Handles Cloudflare and email OTP; pest control re-submits every Monday on a cron.",
    tech: ["Playwright", "Telegram", "agents", "cron"],
    links: [
      {
        label: "Code",
        href: "https://github.com/Tar-ive/rent-agent",
        kind: "code",
      },
    ],
    status: "running in production",
  },
  {
    id: "grants-mcp",
    title: "Grants-MCP",
    summary:
      "An MCP ecosystem for government grant discovery: AI assistants query 180k+ live grants through it. 389+ downloads on PulseMCP.",
    tech: ["MCP", "TypeScript", "Python"],
    links: [
      {
        label: "Code",
        href: "https://github.com/Tar-ive/grants-mcp",
        kind: "code",
      },
    ],
  },
  {
    id: "promptetheus",
    title: "Promptetheus",
    summary:
      "A recursive self-improving tracing stack for AI agents: incident response that captures failures, finds root causes, and generates the fix. Built at the UC Berkeley AI Hackathon.",
    tech: ["observability", "agents", "tracing"],
    links: [
      {
        label: "Product Hunt",
        href: "https://www.producthunt.com/products/promptethus",
        kind: "primary",
      },
      {
        label: "Code",
        href: "https://github.com/obro79/promptetheus-service",
        kind: "code",
      },
    ],
  },
];

export type Publication = {
  id: string;
  title: string;
  venue: string;
  role: string;
  summary: string;
  href: string;
};

export const publications: Publication[] = [
  {
    id: "pfas",
    title:
      "Associations of cognitive function with recent and cumulative PFAS exposure in firefighters",
    venue: "Environmental Epidemiology · Aug 2026",
    role: "Co-author",
    summary:
      "Cumulative PFOS associated with slower processing speed, with a recent × cumulative interaction. Modeled with OLS, PCA, and Random Forest.",
    href: "https://www.ovid.com/jnls/environepidem/fulltext/10.1097/ee9.0000000000000522~associations-of-cognitive-function-with-recent-and",
  },
  {
    id: "quantafold",
    title:
      "QuantaFold: scaling protein language model fine-tuning to 5,000 families",
    venue: "SC25 poster",
    role: "Lead author",
    summary:
      "78% training-time reduction scaling ESM-2 fine-tuning to 400k sequences across 5,000 protein families.",
    href: "https://ai.vixra.org/pdf/2509.0070v1.pdf",
  },
  {
    id: "ruralwomen",
    title:
      "Rural women's healthcare access through social vulnerability profiles",
    venue: "Cluster analysis of Texas survey data",
    role: "Co-author",
    summary:
      "Unsupervised profiling found 7 subgroups that predict healthcare access better than race or insurance status, driving county activation programs.",
    href: "https://www.researchgate.net/publication/403284768_Profiles_of_Non-medical_Drivers_and_Health_Burden_Associated_With_Care_Seeking_Among_Rural_Women",
  },
];

export type Course = { code: string; title: string; note?: string };

export const education: {
  institution: string;
  location: string;
  degree: string;
  gpa: string;
  note: string;
  coursework: Course[];
  certifications: { title: string; note: string }[];
  skills: string[];
} = {
  institution: "Texas State University",
  location: "San Marcos, Texas",
  degree: "B.B.A. Computer Information Systems",
  gpa: "4.0 GPA",
  note: "Full-tuition Merit Scholar, one of 15 awarded schoolwide. AKAEF Undergraduate Launch Scholar and Merry Kone FitzPatrick Endowment Scholar.",
  coursework: [
    { code: "ISAN 3392", title: "Introduction to Machine Learning" },
    { code: "ANLY 3339", title: "Data Mining and Visualization" },
    { code: "ANLY 3334", title: "Statistical Modeling" },
    { code: "ANLY 2333", title: "Business Statistics" },
    { code: "ISAN 3382", title: "Computer Data Base Systems" },
    { code: "ISAN 3374", title: "System Analysis and Design" },
    { code: "ISAN 3305", title: "Business Programming I", note: "Python" },
    { code: "ISAN 3325", title: "Business Programming II", note: "Python and Rust" },
  ],
  certifications: [
    {
      title: "Supervised Machine Learning: Regression and Classification",
      note: "certificate",
    },
  ],
  skills: [
    "Inference engineering",
    "Computer vision",
    "Recommendation systems",
    "LLM optimization",
    "NVIDIA Jetson",
    "DeepStream",
    "vLLM",
    "llama.cpp",
    "MLX",
    "PyTorch",
    "TensorFlow",
    "Python",
    "TypeScript",
    "FastAPI",
    "Next.js",
    "Playwright",
    "MCP",
  ],
};

export const footer = {
  note: "Built slow, to last. No trackers, no noise.",
  streamLabel: "the stream",
};
