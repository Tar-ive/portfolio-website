/* @ds-bundle: {"format":3,"namespace":"SakshamDesignSystem_f0fa33","components":[{"name":"PostItem","sourcePath":"components/content/PostItem.jsx"},{"name":"ProjectCard","sourcePath":"components/content/ProjectCard.jsx"},{"name":"SutraQuote","sourcePath":"components/content/SutraQuote.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Footer","sourcePath":"components/site/Footer.jsx"},{"name":"NavBar","sourcePath":"components/site/NavBar.jsx"},{"name":"SectionHeading","sourcePath":"components/site/SectionHeading.jsx"},{"name":"SocialLinks","sourcePath":"components/site/SocialLinks.jsx"},{"name":"HomeScreen","sourcePath":"ui_kits/website/HomeScreen.jsx"},{"name":"ProjectsScreen","sourcePath":"ui_kits/website/ProjectsScreen.jsx"},{"name":"WritingScreen","sourcePath":"ui_kits/website/WritingScreen.jsx"}],"sourceHashes":{"components/content/PostItem.jsx":"b3bfafe40b57","components/content/ProjectCard.jsx":"19a4b3357bfc","components/content/SutraQuote.jsx":"4a507b12dae2","components/core/Button.jsx":"66178fb47560","components/core/Card.jsx":"e739d337fbbb","components/core/Tag.jsx":"329737873989","components/site/Footer.jsx":"2b0442c88c86","components/site/NavBar.jsx":"ffe2c7736b2f","components/site/SectionHeading.jsx":"d919b2c588ae","components/site/SocialLinks.jsx":"1b39dbd47c36","ui_kits/website/HomeScreen.jsx":"70b93891dce9","ui_kits/website/ProjectsScreen.jsx":"f2047ee649ed","ui_kits/website/WritingScreen.jsx":"2ba8e56c65f9"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SakshamDesignSystem_f0fa33 = window.SakshamDesignSystem_f0fa33 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/SutraQuote.jsx
try { (() => {
function SutraQuote({
  devanagari,
  translation,
  source,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("blockquote", {
    className: `sds-sutra ${className}`.trim()
  }, devanagari ? /*#__PURE__*/React.createElement("span", {
    className: "sds-sutra__devanagari"
  }, devanagari) : null, translation ? /*#__PURE__*/React.createElement("span", {
    className: "sds-sutra__translation"
  }, translation) : null, source ? /*#__PURE__*/React.createElement("cite", {
    className: "sds-sutra__source"
  }, source) : null);
}
Object.assign(__ds_scope, { SutraQuote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SutraQuote.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = "primary",
  size = "md",
  href,
  disabled = false,
  children,
  className = "",
  ...rest
}) {
  const cls = ["sds-btn", `sds-btn--${variant}`, `sds-btn--${size}`, disabled ? "sds-btn--disabled" : "", className].filter(Boolean).join(" ");
  if (href) {
    return /*#__PURE__*/React.createElement("a", _extends({
      className: cls,
      href: href,
      "aria-disabled": disabled || undefined
    }, rest), children);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    disabled: disabled
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  eyebrow,
  title,
  tint = false,
  children,
  className = "",
  ...rest
}) {
  const cls = ["sds-card", tint ? "sds-card--tint" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sds-card__body"
  }, eyebrow ? /*#__PURE__*/React.createElement("div", {
    className: "sds-card__eyebrow"
  }, eyebrow) : null, title ? /*#__PURE__*/React.createElement("div", {
    className: "sds-card__title"
  }, title) : null, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  variant = "default",
  children,
  className = "",
  ...rest
}) {
  const cls = ["sds-tag", variant !== "default" ? `sds-tag--${variant}` : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/content/PostItem.jsx
try { (() => {
function PostItem({
  date,
  title,
  href = "#",
  description,
  source,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sds-post"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sds-post__date"
  }, date), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "sds-post__title",
    href: href,
    onClick: onClick,
    target: href && href.startsWith("http") ? "_blank" : undefined,
    rel: "noreferrer"
  }, title), description ? /*#__PURE__*/React.createElement("p", {
    className: "sds-post__desc"
  }, description) : null), source ? /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    variant: "outline"
  }, source) : null);
}
Object.assign(__ds_scope, { PostItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/PostItem.jsx", error: String((e && e.message) || e) }); }

// components/content/ProjectCard.jsx
try { (() => {
function ProjectCard({
  title,
  description,
  image,
  tags = [],
  status,
  github,
  live,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `sds-card sds-project ${className}`.trim()
  }, image ? /*#__PURE__*/React.createElement("div", {
    className: "sds-project__media"
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title
  })) : null, /*#__PURE__*/React.createElement("div", {
    className: "sds-project__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sds-project__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sds-card__title"
  }, title), status ? /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    variant: status === "currently building" ? "accent" : "outline"
  }, status) : null), description ? /*#__PURE__*/React.createElement("p", {
    className: "sds-project__desc"
  }, description) : null, tags.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "sds-project__tags"
  }, tags.map(t => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: t
  }, t))) : null, github || live ? /*#__PURE__*/React.createElement("div", {
    className: "sds-project__links"
  }, github ? /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    href: github,
    target: "_blank"
  }, "GitHub") : null, live ? /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "sm",
    href: live,
    target: "_blank"
  }, "Live \u2197") : null) : null));
}
Object.assign(__ds_scope, { ProjectCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ProjectCard.jsx", error: String((e && e.message) || e) }); }

// components/site/Footer.jsx
try { (() => {
function Footer({
  note = "Built slow, to last. No trackers, no noise.",
  children,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: `sds-footer ${className}`.trim()
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "danda"
  }, "\u0965"), " \xA9 ", new Date().getFullYear(), " Saksham Adhikari \xB7 ", note), children);
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/Footer.jsx", error: String((e && e.message) || e) }); }

// components/site/NavBar.jsx
try { (() => {
function NavBar({
  items = [{
    label: "Home",
    href: "#",
    active: true
  }, {
    label: "Writing",
    href: "#"
  }, {
    label: "Projects",
    href: "#"
  }, {
    label: "About",
    href: "#"
  }],
  wordmark = "saksham",
  onNavigate,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: `sds-nav ${className}`.trim()
  }, /*#__PURE__*/React.createElement("a", {
    className: "sds-nav__mark",
    href: "#",
    onClick: e => {
      e.preventDefault();
      if (onNavigate) onNavigate(items[0]);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "danda"
  }, "\u0965"), /*#__PURE__*/React.createElement("span", null, wordmark)), /*#__PURE__*/React.createElement("div", {
    className: "sds-nav__links"
  }, items.map(item => /*#__PURE__*/React.createElement("a", {
    key: item.label,
    href: item.href || "#",
    className: `sds-nav__link${item.active ? " sds-nav__link--active" : ""}`,
    onClick: e => {
      if (onNavigate) {
        e.preventDefault();
        onNavigate(item);
      }
    }
  }, item.label))));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/site/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionHeading({
  children,
  rule = true,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `sds-section-heading ${className}`.trim()
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sds-section-heading__danda",
    "aria-hidden": "true"
  }, "\u0965"), /*#__PURE__*/React.createElement("h2", {
    className: "sds-section-heading__text"
  }, children), rule ? /*#__PURE__*/React.createElement("span", {
    className: "sds-section-heading__rule"
  }) : null);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/site/SocialLinks.jsx
try { (() => {
const ICONS = {
  x: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 512 462.799",
    fill: "currentColor",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
  })),
  linkedin: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"
  })),
  github: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 18c-4.51 2-5-2-7-2"
  })),
  substack: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"
  })),
  college: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 10v6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5"
  })),
  email: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "20",
    height: "16",
    x: "2",
    y: "4",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
  }))
};
const DEFAULT_LINKS = [{
  kind: "x",
  href: "https://x.com/saksham_adh",
  label: "X"
}, {
  kind: "linkedin",
  href: "https://www.linkedin.com/in/adhsaksham/",
  label: "LinkedIn"
}, {
  kind: "github",
  href: "https://github.com/Tar-ive",
  label: "GitHub"
}, {
  kind: "substack",
  href: "https://substack.com/@sakshamadhikari",
  label: "Substack"
}, {
  kind: "college",
  href: "https://www.txst.edu/",
  label: "Texas State"
}];
function SocialLinks({
  links = DEFAULT_LINKS,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `sds-social ${className}`.trim()
  }, links.map(link => /*#__PURE__*/React.createElement("a", {
    key: link.kind + link.href,
    className: "sds-social__item",
    href: link.href,
    target: "_blank",
    rel: "noreferrer",
    title: link.label,
    "aria-label": link.label
  }, ICONS[link.kind] || ICONS.email)));
}
Object.assign(__ds_scope, { SocialLinks });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/SocialLinks.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeScreen.jsx
try { (() => {
function HomeScreen({
  assetBase = "../../",
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      gap: "var(--space-6)",
      alignItems: "flex-start",
      padding: "var(--space-7) 0 var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "var(--text-3xl)"
    }
  }, "Saksham Adhikari"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-xs)",
      color: "var(--text-faint)",
      letterSpacing: "var(--tracking-wide)",
      textTransform: "uppercase"
    }
  }, "Austin, TX \xB7 builder \xB7 writer \xB7 studier of s\u0101\u1E45khya"), /*#__PURE__*/React.createElement(__ds_scope.SocialLinks, null), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: "var(--measure-prose)",
      fontSize: "var(--text-md)",
      lineHeight: "var(--leading-prose)",
      margin: 0,
      textWrap: "pretty"
    }
  }, "Nepal-born, Texas-based, eternally curious. I spend my days tinkering with AI, making data tell stories, and building whatever sounds fun. Most of what I learn ends up on the blog \u2014 notes on TPU kernels, research, and the slow practice of paying attention."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    onClick: () => onNavigate && onNavigate("Writing")
  }, "Read the writing"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    href: "https://substack.com/@sakshamadhikari",
    target: "_blank"
  }, "Subscribe on Substack"))), /*#__PURE__*/React.createElement("img", {
    src: assetBase + "assets/photos/profile.jpeg",
    alt: "Saksham Adhikari",
    style: {
      width: 168,
      height: 168,
      borderRadius: "var(--radius-full)",
      objectFit: "cover",
      border: "3px solid var(--line-1)"
    }
  })), /*#__PURE__*/React.createElement(__ds_scope.SutraQuote, {
    devanagari: "\u0926\u0941\u0903\u0916\u0924\u094D\u0930\u092F\u093E\u092D\u093F\u0918\u093E\u0924\u093E\u091C\u094D\u091C\u093F\u091C\u094D\u091E\u093E\u0938\u093E \u0924\u0926\u092D\u093F\u0918\u093E\u0924\u0915\u0947 \u0939\u0947\u0924\u094C",
    translation: "From the torment of the three sufferings arises the desire to know the means of their removal.",
    source: "S\u0101\u1E45khya-k\u0101rik\u0101 1"
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--space-7) 0 0"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, null, "Now"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "var(--space-4)",
      marginTop: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Card, {
    eyebrow: "research",
    title: "TPU @ Google"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-2) 0 0",
      fontSize: "var(--text-base)",
      color: "var(--text-muted)",
      lineHeight: "var(--leading-normal)"
    }
  }, "Optimizing attention backends for vLLM on Cloud TPU v6e.")), /*#__PURE__*/React.createElement(__ds_scope.Card, {
    eyebrow: "building",
    title: "Grants-MCP"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-2) 0 0",
      fontSize: "var(--text-base)",
      color: "var(--text-muted)",
      lineHeight: "var(--leading-normal)"
    }
  }, "An MCP server that makes federal grants searchable.")), /*#__PURE__*/React.createElement(__ds_scope.Card, {
    eyebrow: "studying",
    title: "S\u0101\u1E45khya"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-2) 0 0",
      fontSize: "var(--text-base)",
      color: "var(--text-muted)",
      lineHeight: "var(--leading-normal)"
    }
  }, "Reading the k\u0101rik\u0101s slowly, one verse at a time.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--space-7) 0 var(--space-7)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, null, "Interests"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-2)",
      marginTop: "var(--space-5)"
    }
  }, ["Vipassana", "Investing", "Books", "Distance running", "Sanskrit scriptures", "TPUs", "Protein science"].map(t => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: t
  }, t)))));
}
Object.assign(__ds_scope, { HomeScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ProjectsScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProjectsScreen({
  assetBase = "../../"
}) {
  const projects = [{
    title: "Grants-MCP",
    status: "currently building",
    description: "MCP server for searching and analyzing federal grants programmatically.",
    image: assetBase + "assets/projects/grants-mcp.jpeg",
    tags: ["Python", "MCP", "FastAPI"],
    github: "https://github.com/Tar-ive",
    live: "https://grants-mcp-website.vercel.app/"
  }, {
    title: "Find&Fund",
    status: "completed",
    description: "Matching researchers with funding opportunities.",
    image: assetBase + "assets/projects/find-and-fund.jpeg",
    tags: ["Next.js", "Postgres"],
    github: "https://github.com/Tar-ive"
  }, {
    title: "Research Assistant",
    status: "completed",
    description: "Researcher discovery across 2,454 academic papers with UMAP clustering.",
    image: assetBase + "assets/projects/research-ai.jpg",
    tags: ["Python", "UMAP", "NLP"],
    github: "https://github.com/Tar-ive"
  }, {
    title: "Echoz",
    status: "research",
    description: "Audio experiments.",
    image: assetBase + "assets/projects/echoz.jpeg",
    tags: ["ML", "Audio"],
    github: "https://github.com/Tar-ive"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: "var(--space-7)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, null, "Projects"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-5)",
      marginTop: "var(--space-5)",
      paddingBottom: "var(--space-7)"
    }
  }, projects.map(p => /*#__PURE__*/React.createElement(__ds_scope.ProjectCard, _extends({
    key: p.title
  }, p)))));
}
Object.assign(__ds_scope, { ProjectsScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ProjectsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/WritingScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const POSTS = [{
  date: "2026-05-30",
  title: "What TPUs taught me about attention",
  description: "Notes from optimizing vLLM backends on v6e. Mostly mistakes, some wins.",
  source: "substack"
}, {
  date: "2026-04-12",
  title: "Sāṅkhya for systems thinkers",
  description: "Twenty-five tattvas as a dependency graph.",
  source: "substack"
}, {
  date: "2026-03-02",
  title: "Shipping a researcher discovery tool in 6 weeks",
  description: "2,454 papers, UMAP clustering, and a 259KB payload.",
  source: "substack"
}, {
  date: "2026-01-18",
  title: "A year of Vipassana and version control",
  source: "substack"
}, {
  date: "2025-11-04",
  title: "Learning Lean from Google DeepMind",
  description: "Formal proofs as a second language.",
  source: "blog"
}];
function WritingScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: "var(--space-7)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, null, "Writing"), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: "var(--measure-prose)",
      fontSize: "var(--text-md)",
      lineHeight: "var(--leading-prose)",
      color: "var(--text-muted)",
      margin: "var(--space-4) 0 var(--space-5)"
    }
  }, "Essays live on Substack and update here. New posts roughly monthly \u2014 technical when it should be, readable always."), /*#__PURE__*/React.createElement("div", null, POSTS.map(p => /*#__PURE__*/React.createElement(__ds_scope.PostItem, _extends({
    key: p.title
  }, p, {
    href: "https://substack.com/@sakshamadhikari"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "accent",
    href: "https://substack.com/@sakshamadhikari",
    target: "_blank"
  }, "Subscribe on Substack")));
}
Object.assign(__ds_scope, { WritingScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/WritingScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.PostItem = __ds_scope.PostItem;

__ds_ns.ProjectCard = __ds_scope.ProjectCard;

__ds_ns.SutraQuote = __ds_scope.SutraQuote;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.SocialLinks = __ds_scope.SocialLinks;

__ds_ns.HomeScreen = __ds_scope.HomeScreen;

__ds_ns.ProjectsScreen = __ds_scope.ProjectsScreen;

__ds_ns.WritingScreen = __ds_scope.WritingScreen;

})();
