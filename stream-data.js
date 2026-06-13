// stream-data.js — content for The Stream.
// Sources: Substack export (uploads/Substack….md) + CV (uploads/Saksham_CV….md).
// Each item: { id, type, date (YYYY-MM-DD), title, desc, href, image, tags, meta }
// type: essay | win | project | photo | sutra | take
// NOTE: dates for wins/projects without exact dates are month-level guesses — edit freely.

const SUBSTACK = 'https://adhsaksham.substack.com';
const img = (u) => u; // substackcdn URLs already sized w_320

window.STREAM_DATA = [
  // ——— June 2026 ———
  {
    id: 'limitless', type: 'essay', date: '2026-06-13',
    title: 'limitless',
    desc: 'How hacking has taught me more about myself',
    href: SUBSTACK + '/p/limitless',
    image: img('https://substackcdn.com/image/fetch/$s_!cCcj!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F409b3a0c-8f05-4be1-8ce3-3d9ca6a39646_844x668.jpeg'),
    tags: ['hacking', 'personal'],
  },
  {
    id: 'meet', type: 'essay', date: '2026-06-10',
    title: 'how to build google meet',
    desc: 'webrtc components behind google meet',
    href: SUBSTACK + '/p/how-to-build-google-meet',
    image: img('https://substackcdn.com/image/fetch/$s_!SiRh!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F49d65552-105d-4e47-a9a2-f8257062708f_928x1695.png'),
    tags: ['systems', 'webrtc'],
  },
  // ——— June 2026 ———
  {
    id: 'base-thought', type: 'essay', date: '2026-05-30',
    title: 'base_thought',
    desc: 'It is easy to say something and hard to do it.',
    href: SUBSTACK + '/p/base_thought',
    image: img('https://substackcdn.com/image/fetch/$s_!glxZ!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2adf7f9d-4176-4ade-8366-fe64f75dd2e6_1672x941.png'),
    tags: ['notes'],
  },
  {
    id: 'genrec', type: 'essay', date: '2026-05-24',
    title: 'How to Build A Generative Recommendation System',
    desc: 'A Twitter clone for agents — generating content for humans on the fly.',
    href: SUBSTACK + '/p/how-to-build-a-generative-recommendation',
    image: img('https://substackcdn.com/image/fetch/$s_!wMGv!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F22e9767e-12ee-4d64-a797-8db5ae071d38_3840x2221.png'),
    tags: ['recsys', 'agents'],
  },
  {
    id: 'sutra-pangu', type: 'sutra', date: '2026-05-20',
    devanagari: 'पुरुषस्य दर्शनार्थं कैवल्यार्थं तथा प्रधानस्य ।\nपङ्ग्वन्धवदुभयोरपि संयोगस्तत्कृतः सर्गः ॥',
    translation: 'Like the lame man and the blind man joining — one sees, the other carries — spirit and matter cooperate, and from that union the world proceeds.',
    source: 'sāṅkhya kārikā · 21',
    take: 'The cleanest frame I know for human–AI systems: the model carries, the human sees.',
  },
  {
    id: 'uncertainty', type: 'essay', date: '2026-05-17',
    title: 'Giving AI Uncertainty an Address',
    desc: 'What is the AI Layered Reference Model?',
    href: SUBSTACK + '/p/giving-ai-uncertainty-an-address',
    image: img('https://substackcdn.com/image/fetch/$s_!ArMV!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd4aed625-5375-4127-bc6a-812144f0a20e_1672x941.png'),
    tags: ['inference', 'verifiability'],
  },
  {
    id: 'cv-reflections', type: 'essay', date: '2026-05-16',
    title: 'reflections on computer vision systems in the era of AI',
    desc: 'Is the future of computer vision future intelligence?',
    href: SUBSTACK + '/p/reflections-on-computer-vision-systems',
    image: img('https://substackcdn.com/image/fetch/$s_!QwQS!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8c46876f-5d4b-461f-9386-9cc116b12556_1693x929.png'),
    tags: ['vision'],
  },
  {
    id: 'fight-flee', type: 'essay', date: '2026-05-03',
    title: 'fight or flee?',
    desc: 'Solving the lifelong dilemma between exploration and exploitation',
    href: SUBSTACK + '/p/fight-or-flee',
    image: img('https://substackcdn.com/image/fetch/$s_!NdAQ!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc69a08f1-ebcf-4fac-be5d-df58486a58b6_1408x768.png'),
    tags: ['rl', 'philosophy'],
  },

  // ——— April 2026 ———
  {
    id: 'fire-equations', type: 'essay', date: '2026-04-27',
    title: 'The Fire in the Equations',
    desc: 'On how foundation model companies actually start making money',
    href: SUBSTACK + '/p/the-fire-in-the-equations',
    image: img('https://substackcdn.com/image/fetch/$s_!nvQZ!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0368492c-c4ca-43dc-a96a-041c16866037_1672x940.png'),
    tags: ['economics'],
  },
  {
    id: 'agents-thoughts', type: 'essay', date: '2026-04-25',
    title: 'some thoughts on agents',
    desc: 'From Copilot to Cursor — what the agent wave actually changed.',
    href: SUBSTACK + '/p/some-thoughts-on-agents',
    image: img('https://substackcdn.com/image/fetch/$s_!yxtu!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F142e528f-fb03-4fed-9601-318d32872d26_1536x1024.heic'),
    tags: ['agents'],
  },
  {
    id: 'take-satyam', type: 'take', date: '2026-04-12',
    text: 'satyaṃ jñānam anantaṃ brahma — truth, knowledge, without end. Verifiability work is just engineering toward the first two words.',
    source: 'taittirīya upaniṣad · 2.1',
  },

  // ——— March 2026 ———
  {
    id: 'win-dataport', type: 'win', date: '2026-03-01', dateApprox: true,
    title: 'Data Portability Hackathon — Winner',
    desc: 'UT Law Data Portability Track winner + 3rd overall. A personalized game that helps people with ADHD run a congruent daily life.',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7443301667917365249/',
    hrefLabel: 'view on linkedin',
    tags: ['UT Law track', '3rd overall'],
  },

  // ——— February 2026 ———
  {
    id: 'openclaw', type: 'essay', date: '2026-02-26',
    title: 'How to Use OpenClaw to Get Context Aware Personalized Job Updates',
    desc: '$0.2313 per recommendation sent, worth it?',
    href: SUBSTACK + '/p/how-i-used-openclaw-to-get-context',
    image: img('https://substackcdn.com/image/fetch/$s_!IzYL!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fed3edd30-6cd0-4040-ae2d-a795f95b7acd_894x558.png'),
    tags: ['recsys', 'agents'],
  },
  // ——— January 2026 ———
  {
    id: 'twobot', type: 'project', date: '2026-05-30',
    title: 'TwoBot',
    desc: 'A two-tower GenRecSys: on-device curator agents (MLX) evaluate candidates and write personalized surfacing notes, with a live force-directed graph of 1,300 simulation nodes.',
    github: 'https://github.com/Tar-ive/twobot',
    video: '/media/video-1.mp4',
    videoAspect: '16 / 9',
    tags: ['recsys', 'mlx', 'agents'],
    status: 'currently building',
  },
  {
    id: 'sutra-nasmi', type: 'sutra', date: '2026-01-08',
    devanagari: 'एवं तत्त्वाभ्यासान्नास्मि न मे नाहमित्यपरिशेषम् ।\nअविपर्ययाद्विशुद्धं केवलमुत्पद्यते ज्ञानम् ॥',
    translation: '"I am not, nothing is mine, there is no I" — from sustained practice with the tattvas arises knowledge that is complete, pure, and alone.',
    source: 'sāṅkhya kārikā · 64',
    take: 'Ego-ablation as a training objective. The oldest regularizer.',
  },

  // ——— November 2025 ———
  {
    id: 'win-nvidia', type: 'win', date: '2025-11-01',
    title: 'AITX × NVIDIA Hackathon — Winner, 2 tracks',
    desc: 'Weights & Biases Track + LomanAI Track. Hyper-personalized real-time voice agents with 3 layers of authentication for bulk food orders.',
    href: SUBSTACK + '/p/how-i-won-2-tracks-in-an-nvdia-hackathon',
    hrefLabel: 'read the write-up',
    tags: ['voice agents', 'W&B', 'LomanAI'],
  },
  {
    id: 'photo-nov25', type: 'photo', date: '2025-11-01',
    title: 'demo night',
    desc: 'Drop a photo from the NVIDIA hackathon here.',
    slotId: 'photo-nov25', slotH: 260,
  },
  {
    id: 'quantafold', type: 'paper', date: '2025-11-18', display: 'nov 2025',
    title: 'QuantaFold: Scaling Protein Language Model Fine-tuning to 5,000 Families Through Systematic Optimization',
    desc: 'Lead author. 78% training-time reduction scaling ESM-2 fine-tuning to 400k sequences across 5,000 protein families. Poster presentation at SC25.',
    href: 'https://ai.vixra.org/pdf/2509.0070v1.pdf',
    hrefLabel: 'read the paper (pdf)',
    tags: ['lead author', 'SC25', 'HPC'],
  },

  // ——— October 2025 ———
  {
    id: 'win-datathon', type: 'win', date: '2025-02-15', display: 'feb 2025',
    title: 'TXST Datathon — 1st Place',
    desc: 'Greedy parking-space optimizer and TensorFlow ML model for strategic campus parking.',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7297066335698591744/',
    hrefLabel: 'view on linkedin',
    tags: ['tensorflow'],
  },
  {
    id: 'win-novohacks', type: 'win', date: '2024-11-15', display: 'nov 2024',
    title: 'Novo Hacks — Best Design',
    tags: ['design'],
  },

  // ——— September 2025 ———
  {
    id: 'deepmind', type: 'essay', date: '2025-09-13',
    title: 'DeepMind Philosophy',
    desc: 'Core ideologies behind breakthrough AI innovation',
    href: SUBSTACK + '/p/deepmind-philosophy',
    image: img('https://substackcdn.com/image/fetch/$s_!Ecby!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0a759e99-8d8a-4eeb-a478-21e50c037876_1024x809.jpeg'),
    tags: ['research culture'],
  },
  {
    id: 'semester', type: 'essay', date: '2025-09-10',
    title: 'me this semester',
    desc: 'Writing and I have this weird relationship.',
    href: SUBSTACK + '/p/me-this-semester',
    tags: ['personal'],
  },
  {
    id: 'grid', type: 'essay', date: '2025-09-01',
    title: 'First Principles Analysis: AI-Native Grid Intelligence',
    desc: 'Signal vs noise in electric grid transformation',
    href: SUBSTACK + '/p/first-principles-analysis-ai-native',
    image: img('https://substackcdn.com/image/fetch/$s_!0ZUw!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F59997aa8-8343-4956-ae0b-53a39e3bdc22_1454x994.png'),
    tags: ['energy', 'first principles'],
  },

  // ——— August 2025 ———
  {
    id: 'win-tpu', type: 'win', date: '2025-08-20', display: 'aug 2025',
    title: 'TPU Cloud Research Program — Google',
    desc: 'Selected for Google’s TPU Cloud research program.',
    tags: ['google'],
  },
  {
    id: 'grants-mcp', type: 'project', date: '2025-08-15', dateApprox: true,
    title: 'Grants-MCP',
    desc: 'MCP ecosystem for government grant discovery — AI assistants querying 180k+ live grants. 389+ downloads on PulseMCP.',
    github: 'https://github.com/Tar-ive/grants-mcp',
    live: 'https://glama.ai/mcp/servers/@Tar-ive/grants-mcp',
    tags: ['mcp', 'python', 'typescript'],
  },

  // ——— January 2025 ———
  {
    id: 'tiktok', type: 'essay', date: '2025-01-12',
    title: "The Secret Sauce Behind TikTok's Algorithm: A Deep Dive into Hashing",
    desc: 'Part 1 of Understanding DSA for Recommendation Algorithms',
    href: SUBSTACK + '/p/the-secret-sauce-behind-tiktoks-algorithm',
    image: img('https://substackcdn.com/image/fetch/$s_!BPgH!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4b0a0040-e876-41af-9e8d-dc9fcb77f8e4_1024x768.jpeg'),
    tags: ['recsys', 'dsa'],
  },
  {
    id: 'uber', type: 'essay', date: '2025-01-11',
    title: "Inside Uber's Money Machine",
    desc: 'How AI splits billions of dollars across 10,000+ cities in minutes',
    href: SUBSTACK + '/p/inside-ubers-money-machine',
    image: img('https://substackcdn.com/image/fetch/$s_!HO5m!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F71caf9e9-0c23-45a6-b111-691e2a09108f_1024x768.jpeg'),
    tags: ['recsys', 'economics'],
  },

  // ——— X posts (pasted export, Jun 2026) ———
  {
    id: 'x-openai', type: 'x', date: '2026-05-31',
    text: "I'd switch from Claude in an instant if @OpenAI only had this.",
    href: 'https://x.com/i/web/status/2061231884080758909',
  },
  {
    id: 'codex-ext', type: 'project', date: '2026-05-31',
    title: 'codex cli extension',
    desc: 'Extension built around the Codex CLI — demo below.',
    video: '/media/video-2.mp4',
    videoAspect: '16 / 9',
    tags: ['codex', 'cli'],
  },
  {
    id: 'x-twobot', type: 'x', date: '2026-05-30',
    text: 'X for your agents :)',
    href: 'https://x.com/i/web/status/2060826026649809283',
    tags: ['twobot'],
  },
  {
    id: 'win-webai', type: 'win', date: '2026-05-25',
    title: '“Don’t Get Up” — webAI hackathon win',
    desc: 'Rage-baits you out of bed. YOLO models running on MLX — the future of alarm clocks, built in 36 hours.',
    video: '/media/video-3.mp4',
    videoAspect: '960 / 624',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7465758282662641664/',
    hrefLabel: 'view on linkedin',
    tags: ['YOLO', 'MLX', 'webAI'],
  },
  {
    id: 'x-dontgetup', type: 'x', date: '2026-05-25',
    text: '“Don’t Get Up” rage-baits you out of bed. Powered by YOLO models running on MLX, we built the future of alarm clocks in 36 hours. #YOLOMLX @thewebAI',
    tags: ['hackathon build'],
  },
  {
    id: 'x-haus', type: 'x', date: '2026-05-10',
    text: 'Haus turns floor plans and Pinterest inspiration into personalized photo-to-video apartment walkthroughs. A lot of home and architecture inspiration already starts on Pinterest, but it usually stays disconnected from the real floor plans people are actually touring.',
    tags: ['build'],
  },
  {
    id: 'x-simulation', type: 'x', date: '2026-03-15',
    text: 'Here’s what the simulation predicts. Oil ↑ → energy ↑ → DRAM costs ↑ → hyperscalers cut CapEx → memory demand ↓ → prices might stabilize. InP shortage → transceiver prices ↑ → hyperscalers still must buy because there is no substitute → bottleneck persists.',
    href: 'https://x.com/i/web/status/2033310597387894816',
    tags: ['simulation', 'economics'],
  },
  {
    id: 'x-skillsense', type: 'x', date: '2025-11-09',
    text: '24 hours building this beauty → Skillsense',
    href: 'https://x.com/i/web/status/1987640405857345783',
    tags: ['hackathon build'],
  },
  {
    id: 'win-mcp-hacknight', type: 'win', date: '2025-10-29',
    title: 'World Wild Web MCP Server Hack Night — 3rd place',
    desc: 'An MCP server on Cloudflare + Fiberplane that talks to Bluesky, grabs stock posts, analyzes sentiment, and says buy or sell.',
    href: 'https://x.com/i/web/status/1983593740594798766',
    hrefLabel: 'view on X',
    tags: ['cloudflare', 'mcp', 'bluesky'],
  },
  {
    id: 'x-5agents', type: 'x', date: '2025-10-28',
    text: 'These 5 agents helped me win 2 tracks at the @aitxcommunity @NVIDIAAIDev hackathon, and I’m open-sourcing them for everyone to use. Excited to see what folks build with them!',
    href: 'https://x.com/i/web/status/1983249868022804600',
    tags: ['open source'],
  },
  {
    id: 'x-airmattress', type: 'x', date: '2025-10-25',
    text: 'Day 2 of the @aitxcommunity hackathon: coding on an air mattress in an empty Austin apartment because who needs furniture when you’ve got ideas?',
    href: 'https://x.com/i/web/status/1982094790792470668',
  },
  {
    id: 'x-residency', type: 'x', date: '2025-10-25',
    text: 'Sleeping at a stranger’s house after 8 hours of coding on an air mattress during the @aitxcommunity hackathon — building in public for @enter_delta and @theresidency.',
    href: 'https://x.com/i/web/status/1982009439923093580',
  },

  // ——— X posts — link-only (text to be filled in) ———
  { id: 'x-oct26', type: 'x', date: '2025-10-26', linkOnly: true, href: 'https://x.com/saksham_adh/status/1982489137111560450' },
  { id: 'x-sep16', type: 'x', date: '2025-09-16', linkOnly: true, href: 'https://x.com/saksham_adh/status/1968088565490860533' },
  { id: 'x-sep10', type: 'x', date: '2025-09-10', linkOnly: true, href: 'https://x.com/saksham_adh/status/1965671633781400045' },
  { id: 'x-feb18', type: 'x', date: '2025-02-18', linkOnly: true, href: 'https://x.com/saksham_adh/status/1891981939482976661' },
  { id: 'x-jan16', type: 'x', date: '2025-01-16', linkOnly: true, href: 'https://x.com/saksham_adh/status/1879941672999743631' },
  { id: 'x-dec19', type: 'x', date: '2024-12-19', linkOnly: true, href: 'https://x.com/saksham_adh/status/1869668823571591582' },
  // ——— Medium essays (2024) ———
  {
    id: 'm-replit', type: 'essay', date: '2024-11-12', source: 'medium',
    title: 'How the Replit Agent Might Work',
    desc: 'Reverse-engineering an AI coding assistant built for people with minimal coding experience.',
    href: 'https://medium.com/@adhsaksham27/how-the-replit-agent-might-work-c8b265269b69',
    image: 'https://miro.medium.com/v2/da:true/resize:fill:320:214/0*TESvq12kCD5LnAc9',
    tags: ['agents'],
  },
  {
    id: 'm-instagram', type: 'essay', date: '2024-10-14', source: 'medium',
    title: 'Designing a Ranking Model for Instagram’s Feed',
    desc: 'The intricate design of a feed-ranking model aimed at user engagement.',
    href: 'https://medium.com/@adhsaksham27/designing-a-ranking-model-for-instagrams-feed-448acf2d93b4',
    image: 'https://miro.medium.com/v2/resize:fill:320:214/1*AfKXk4eBRXC1kjRIzS351g.png',
    tags: ['recsys'],
  },
  {
    id: 'm-learning-machines', type: 'essay', date: '2024-09-07', source: 'medium',
    title: 'learning machines',
    desc: 'Why do some individuals consistently achieve while others falter?',
    href: 'https://medium.com/@adhsaksham27/learning-machines-07850cc14bd6',
    image: 'https://miro.medium.com/v2/resize:fill:320:214/1*a9P6g4M_shiMrUNnsrXEkA.jpeg',
    tags: ['philosophy'],
  },
  {
    id: 'm-college', type: 'essay', date: '2024-09-01', source: 'medium',
    title: '7 Essential College Success Strategies for Freshmen and Sophomores',
    desc: 'Making the most of the college experience.',
    href: 'https://medium.com/@adhsaksham27/7-essential-college-success-strategies-for-freshmen-and-sophomores-a6de85397273',
    image: 'https://miro.medium.com/v2/resize:fill:320:214/1*KhDQkeOYn9shVek28c2UNA.jpeg',
    tags: ['personal'],
  },
  {
    id: 'm-year1', type: 'essay', date: '2024-08-11', source: 'medium',
    title: 'year 1',
    desc: 'One year since leaving Nepal to pursue an education in the US.',
    href: 'https://medium.com/@adhsaksham27/year-1-c4819fc9d006',
    image: 'https://miro.medium.com/v2/resize:fill:320:214/1*8NaXP0UGEU9hhBtYlxqzaA.jpeg',
    tags: ['personal'],
  },
  {
    id: 'm-tech-inspire', type: 'essay', date: '2024-08-10', source: 'medium',
    title: 'why does tech inspire me?',
    desc: 'Technology as a blessing with the power to transform lives.',
    href: 'https://medium.com/@adhsaksham27/why-does-tech-inspire-me-43089bb6694f',
    image: 'https://miro.medium.com/v2/da:true/resize:fill:320:214/0*cbYiGYh1cK1TqBDx',
    tags: ['personal'],
  },
  {
    id: 'm-ami', type: 'essay', date: '2024-08-04', source: 'medium',
    title: 'what is AMI and how I learn about it.',
    desc: 'Artificial Machine Intelligence — a branch of AI, and how I study it.',
    href: 'https://medium.com/@adhsaksham27/what-is-ami-and-how-i-learn-about-it-4b80a6ee50d2',
    image: 'https://miro.medium.com/v2/resize:fill:320:214/1*qOovULmCnjxzW9KZ5Soc3A.png',
    tags: ['notes'],
  },
  {
    id: 'm-incentives', type: 'essay', date: '2024-07-25', source: 'medium',
    title: 'incentives to work harder',
    desc: 'Why do humans work? What makes humans tick?',
    href: 'https://medium.com/@adhsaksham27/incentives-to-work-harder-59ac3063ed91',
    image: 'https://miro.medium.com/v2/resize:fill:320:214/1*efikDrEOvQAVewKmXrqivw.jpeg',
    tags: ['philosophy'],
  },

  // ——— Work ———
  {
    id: 'work-hotchips', type: 'work', date: '2027-08-15', display: 'aug 2027',
    title: 'Hot Chips — Volunteer',
    desc: 'Upcoming — volunteering at the Hot Chips conference.',
    tags: ['volunteer', 'upcoming'],
  },
  {
    id: 'work-askslm', type: 'work', date: '2025-11-15', display: 'nov 2025',
    title: 'AskSLM — AI Engineering Intern',
    desc: 'Austin · current. Real-time CV + VLM pipelines on NVIDIA Jetson Thor (DeepStream) for threat detection with Texas county law enforcement; llama.cpp inference optimization.',
    tags: ['current'],
  },
  {
    id: 'work-google', type: 'work', date: '2025-08-20', display: 'aug 2025',
    title: 'Google — TPU Cloud Student Researcher',
    desc: 'Aug–Oct 2025 · remote. Turned vLLM community signals into concrete inference-stack fixes for research scientists’ TPU workloads.',
  },
  {
    id: 'work-bcrc', type: 'work', date: '2025-05-15', display: 'may 2025',
    title: 'Breast Cancer Research Center — Software Development Intern',
    desc: 'May–Jul 2025 · Austin. Semantically indexed ~130k cancer-care records; grew test coverage on an agentic healthcare stack from 78% to 91%.',
  },
  {
    id: 'work-thrc', type: 'work', date: '2025-03-20', display: 'mar 2025',
    title: 'Translational Health Research Center — Data and AI Researcher',
    desc: 'Mar 2025–Jan 2026 · part-time · 11 mos.',
  },
  {
    id: 'work-debate', type: 'work', date: '2025-03-01', display: 'mar 2025',
    title: 'AI Ethics Debate — ACM AI @ TXST',
    desc: 'Organized a 50-person debate across faculty, industry, and Texas government on the environmental impacts of AI; raised $1.7k in sponsorships.',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7301004748164411392/',
    tags: ['event'],
  },
  {
    id: 'work-acm', type: 'work', date: '2024-12-15', display: 'dec 2024',
    title: 'ACM AI @ TXST — Vice President',
    desc: 'Current. Leading a 70+ member club building full-stack apps — campus marketplace, and an ML professor-recommendation bot with an 87% positive rate across 484 interactions.',
    tags: ['current'],
  },
  {
    id: 'work-ai4all', type: 'work', date: '2024-09-15', display: 'sep 2024',
    title: 'AI4All Ignite — Machine Learning Fellow',
    desc: 'Sep 2024–Feb 2025 · remote. Led a 5-person team training an SVM for early Alzheimer’s detection (Darwin dataset); shipped the app and a 91%-accuracy poster.',
    href: 'https://ai4all.streamlit.app',
  },
  {
    id: 'work-sxsw', type: 'work', date: '2024-03-10', display: 'mar 2024',
    title: 'SXSW — Volunteer',
    tags: ['volunteer'],
  },

  // ——— Papers ———
  {
    id: 'paper-grantmatch', type: 'paper', date: '2025-07-23',
    title: 'Intelligent Grant Matching Engine: A Comprehensive Technical Whitepaper',
    href: 'https://drive.google.com/file/d/11g1JklRx81PRIZcOOgyRLgjFa6xv4eIt/view?usp=sharing',
    hrefLabel: 'read the whitepaper',
    tags: ['whitepaper'],
  },
  {
    id: 'paper-ruralwomen', type: 'paper', date: '2025-07-01', display: '2025',
    title: 'Exploring rural women’s healthcare access through social vulnerability profiles: a cluster analysis of regional survey data in Texas',
    desc: 'Co-author. Unsupervised vulnerability profiling identified 7 distinct subgroups of rural women — stronger predictors of healthcare access than race or insurance status. Insights drove activation programs in the most vulnerable counties.',
    href: 'https://www.researchgate.net/publication/403284768_Profiles_of_Non-medical_Drivers_and_Health_Burden_Associated_With_Care_Seeking_Among_Rural_Women',
    hrefLabel: 'read on researchgate',
    tags: ['co-author'],
  },

  // ——— Scholarships & awards ———
  {
    id: 'win-merit', type: 'win', date: '2023-08-15', display: 'aug 2023',
    title: 'Texas State Merit Scholar',
    desc: 'Full-tuition scholarship awarded to 15 students schoolwide for outstanding leadership, academic excellence, and commitment to social impact.',
    tags: ['scholarship'],
  },
  {
    id: 'win-akaef', type: 'win', date: '2024-05-20', display: 'may 2024',
    title: 'AKAEF Undergraduate Launch Scholar',
    desc: '$5,000 awarded for technical potential and commitment to a more inclusive, equitable tech industry.',
    tags: ['scholarship'],
  },
  {
    id: 'win-fitzpatrick', type: 'win', date: '2024-05-10', display: 'may 2024',
    title: 'Merry Kone FitzPatrick Endowment Scholarship',
    desc: '$4,000 awarded for honors excellence and commitment to an inclusive campus community.',
    tags: ['scholarship'],
  },
  {
    id: 'win-montgomery', type: 'win', date: '2025-05-15', display: 'may 2025',
    title: 'Montgomery Endowment Web Service Scholarship',
    desc: '$2,000 for excellence in web service and leadership in housing communities.',
    tags: ['scholarship'],
  },
  {
    id: 'win-olympiad', type: 'win', date: '2022-06-01', display: '2022',
    title: 'National Economics Olympiad — Gold Medalist, Business Case Analysis',
    desc: 'Kathmandu, Nepal. Pitched a business plan to sell Himalayan fresh water à la Fiji and raised funding from FMCG companies.',
    tags: ['gold', 'nepal'],
  },
];
