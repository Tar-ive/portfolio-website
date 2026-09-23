// stream-app.jsx: The Stream, identity rail + mixed chronological feed.
// Uses Saksham DS components from window.SakshamDesignSystem_f0fa33.

const SDS = window.SakshamDesignSystem_f0fa33;
const { Button, SutraQuote, ProjectCard, SocialLinks, Footer } = SDS;

const MONTH_NAMES = ['january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'];

const FILTERS = [
  { key: 'all', label: 'everything', match: (t) => t !== 'x' },
  { key: 'work', label: 'work experience', match: (t) => t === 'work'},
  { key: 'essay', label: 'essays', match: (t) => t === 'essay' },
  { key: 'paper', label: 'papers', match: (t) => t === 'paper' },
  { key: 'win', label: 'wins', match: (t) => t === 'win' },
  { key: 'project', label: 'projects', match: (t) => t === 'project' },
  { key: 'x', label: 'x posts', match: (t) => t === 'x' },
  { key: 'sutra', label: 'sūtras & takes', match: (t) => t === 'sutra' || t === 'take' },
];

const LOGOS = {
  aws: { src: '/media/logos/aws.svg', alt: 'AWS' },
  google: { src: '/media/logos/google.svg', alt: 'Google' },
  v0: { src: '/media/logos/v0.png', alt: 'v0' },
  webai: { src: '/media/logos/webai.png', alt: 'webAI', fill: true },
  nvidia: { src: '/media/logos/nvidia.svg', alt: 'NVIDIA' },
  vercel: { src: '/media/logos/vercel.svg', alt: 'Vercel', mono: true },
  ai4all: { src: '/media/logos/ai4all.png', alt: 'AI4ALL' },
  acm: { src: '/media/logos/acm-ai.png', alt: 'ACM AI @ TXST' },
  askslm: { src: '/media/logos/askslm.png', alt: 'AskSLM', fill: true },
  thrc: { src: '/media/logos/thrc.png', alt: 'Translational Health Research Center', fill: true },
};

function logoClass(logo, size) {
  return [
    'st-logo',
    `st-logo--${size || 'md'}`,
    logo.wide ? 'st-logo--wide' : '',
    logo.fill ? 'st-logo--fill' : '',
    logo.mono ? 'st-logo--mono' : '',
  ].filter(Boolean).join(' ');
}

function LogoMark({ k, size }) {
  const logo = LOGOS[k];
  if (!logo) return null;
  return <img className={logoClass(logo, size)} src={logo.src} alt={logo.alt} title={logo.alt}></img>;
}

function LogoRow({ keys, size }) {
  if (!keys || !keys.length) return null;
  return (
    <span className={`st-logos st-logos--${size || 'md'}`}>
      {keys.map((k) => <LogoMark key={k} k={k} size={size}></LogoMark>)}
    </span>
  );
}

function fmtDate(d, approx) {
  const [y, m, day] = d.split('-').map(Number);
  const mon = MONTH_NAMES[m - 1].slice(0, 3);
  return approx ? `${mon} ${y}` : `${mon} ${String(day).padStart(2, '0')}`;
}

const itemDate = (item) => item.display || fmtDate(item.date, item.dateApprox);

function TitleRow({ item, href, logos }) {
  const title = href
    ? <a className="st-item__title" href={href} target="_blank" rel="noreferrer">{item.title}</a>
    : <span className="st-item__title">{item.title}</span>;
  return (
    <div className="st-item__titleline">
      {logos && logos.length ? <LogoRow keys={logos} size="md"></LogoRow> : null}
      {title}
      <span className="st-item__date">{itemDate(item)}</span>
    </div>
  );
}

function WorkItem({ item }) {
  const mark = item.logos && item.logos[0];
  const href = item.href || '#';
  const ext = href.startsWith('http');
  return (
    <div className="st-item st-item--work">
      <div className="sds-post">
        <span className="sds-post__date">{itemDate(item)}</span>
        <div className="st-work__main">
          <div className="st-item__titleline">
            {mark ? <LogoMark k={mark} size="md"></LogoMark> : null}
            <a
              className="sds-post__title"
              href={href}
              target={ext ? '_blank' : undefined}
              rel="noreferrer"
            >{item.title}</a>
          </div>
          {item.desc ? <p className="sds-post__desc">{item.desc}</p> : null}
        </div>
      </div>
    </div>
  );
}

function PaperItem({ item }) {
  return (
    <article className="sds-card st-item st-item--paper">
      <div className="sds-card__body">
        <TitleRow item={item} href={item.href}></TitleRow>
        {item.desc ? <p className="st-item__desc">{item.desc}</p> : null}
        {item.image ? (
          <a className="st-item__figure" href={item.href || item.image} target="_blank" rel="noreferrer">
            <img src={item.image} alt="" loading="lazy"></img>
          </a>
        ) : null}
        {item.href ? <a className="st-item__cta" href={item.href} target="_blank" rel="noreferrer">{item.hrefLabel || 'read'} ↗</a> : null}
      </div>
    </article>
  );
}

function EssayItem({ item }) {
  return (
    <article className="sds-card st-item">
      <div className="sds-card__body st-item__row">
        <div className="st-item__main">
          <TitleRow item={item} href={item.href}></TitleRow>
          {item.desc ? <p className="st-item__desc">{item.desc}</p> : null}
          <a className="st-item__cta" href={item.href} target="_blank" rel="noreferrer">read on {item.source || 'substack'} ↗</a>
        </div>
        {item.image ? (
          <a className="st-item__thumb" href={item.href} target="_blank" rel="noreferrer">
            <img src={item.image} alt={item.title} loading="lazy"></img>
          </a>
        ) : null}
      </div>
    </article>
  );
}

function ItemVideo({ item, className = 'st-video' }) {
  if (!item.video) return null;
  return (
    <video
      className={className}
      src={item.video + '#t=10'}
      style={item.videoAspect ? { aspectRatio: item.videoAspect } : undefined}
      controls
      muted
      playsInline
      preload="metadata"
    ></video>
  );
}

function ItemGallery({ item, fit }) {
  if (!item.images || !item.images.length) return null;
  const n = item.images.length;
  const cls = ['st-gallery', fit && 'st-gallery--fit', n === 3 && 'st-gallery--3'].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      {item.images.map((src, i) => (
        <a key={i} className="st-gallery__item" href={src} target="_blank" rel="noreferrer">
          <img src={src} alt={item.title} loading="lazy"></img>
        </a>
      ))}
    </div>
  );
}

function WinItem({ item }) {
  return (
    <article className="sds-card sds-card--tint st-item st-item--win">
      <div className="sds-card__body">
        <TitleRow item={item} href={item.href} logos={item.logos}></TitleRow>
        {item.desc ? <p className="st-item__desc">{item.desc}</p> : null}
        <ItemVideo item={item}></ItemVideo>
        <ItemGallery item={item} fit></ItemGallery>
        {item.href ? <a className="st-item__cta" href={item.href} target="_blank" rel="noreferrer">{item.hrefLabel || 'more'} ↗</a> : null}
      </div>
    </article>
  );
}

function ProjectItem({ item }) {
  const hasBadge = item.meta && item.meta.productHuntBadge;
  const hasMedia = item.video || item.demo;
  return (
    <article className="st-item">
      {item.video ? <div className="st-media"><ItemVideo item={item} className=""></ItemVideo></div> : null}
      {item.demo ? <div className="st-media"><img src={item.demo} alt={item.title} style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'contain', display: 'block', background: 'var(--color-surface-alt, #1a1a2e)' }}></img></div> : null}
      <div className={hasMedia ? 'st-joined' : ''}>
        <ProjectCard
        title={item.title}
        description={item.desc}
        image={hasMedia ? null : item.image}
        tags={[]}
        status={item.status}
          github={hasBadge ? null : item.github}
          live={hasBadge ? null : item.live}
        ></ProjectCard>
      </div>
      {hasMedia && item.image ? (
        <a className="st-item__figure" href={item.image} target="_blank" rel="noreferrer">
          <img src={item.image} alt={item.title} loading="lazy"></img>
        </a>
      ) : null}
      {hasBadge ? (
        <div className="sds-project__links" style={{ padding: '0 var(--space-5) var(--space-4)', marginTop: 'calc(-1 * var(--space-2))' }}>
          {item.github ? <Button variant="outline" size="sm" href={item.github} target="_blank">GitHub</Button> : null}
          {item.live ? <Button variant="ghost" size="sm" href={item.live} target="_blank">Live ↗</Button> : null}
          <a href={item.meta.productHunt} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto' }}>
            <img
              src={item.meta.productHuntBadge}
              alt="Promptetheus on Product Hunt"
              width="120"
              height="26"
              style={{ display: 'block' }}
            ></img>
          </a>
        </div>
      ) : null}
      <div className="st-item__floatdate">{fmtDate(item.date, item.dateApprox)}</div>
    </article>
  );
}

function PhotoItem({ item }) {
  if (item.images && item.images.length) {
    return (
      <article className="sds-card st-item">
        <div className="sds-card__body">
          <TitleRow item={item}></TitleRow>
          {item.desc ? <p className="st-item__desc">{item.desc}</p> : null}
          <ItemGallery item={item}></ItemGallery>
        </div>
      </article>
    );
  }
  return (
    <article className="sds-card st-item">
      <div className="sds-card__body">
        <image-slot
          id={item.slotId}
          shape="rounded"
          radius="8"
          placeholder={item.desc}
          style={{ width: '100%', height: item.slotH || 280, display: 'block', marginTop: 'var(--space-3)' }}
        ></image-slot>
        <p className="st-item__desc" style={{ marginTop: 'var(--space-2)' }}>{item.title}</p>
      </div>
    </article>
  );
}

function SutraItem({ item }) {
  return (
    <article className="sds-card sds-card--tint st-item">
      <div className="sds-card__body">
        <SutraQuote
          devanagari={item.devanagari}
          translation={item.translation}
          source={item.source}
        ></SutraQuote>
        {item.take ? <p className="st-item__desc st-item__take">{item.take}</p> : null}
        <span className="st-item__date st-item__date--corner">{fmtDate(item.date, item.dateApprox)}</span>
      </div>
    </article>
  );
}

function TakeItem({ item }) {
  return (
    <article className="st-item st-item--take">
      <div className="st-item__main">
        <p className="st-item__desc st-item__takeline">{item.text}</p>
        {item.source ? <span className="st-item__src">{item.source}</span> : null}
      </div>
      <span className="st-item__date">{fmtDate(item.date, item.dateApprox)}</span>
    </article>
  );
}

// X's /i/web/status/ links don't resolve in the embed widget, so normalize
// every post URL to the canonical twitter.com/<user>/status/<id> form.
function canonicalTweetUrl(href) {
  const m = href.match(/status\/(\d+)/);
  return m ? `https://twitter.com/saksham_adh/status/${m[1]}` : href.replace('//x.com', '//twitter.com');
}

function TweetEmbed({ href, text, theme }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    let cancelled = false;
    const tryLoad = () => {
      if (cancelled || !ref.current) return;
      if (window.twttr && window.twttr.widgets) window.twttr.widgets.load(ref.current);
      else setTimeout(tryLoad, 300);
    };
    tryLoad();
    return () => { cancelled = true; };
  }, []);
  return (
    <div ref={ref} className="st-embed">
      <blockquote className="twitter-tweet" data-theme={theme} data-dnt="true" data-width="500">
        {text ? <p>{text}</p> : null}
        <a href={canonicalTweetUrl(href)}>view on X ↗</a>
      </blockquote>
    </div>
  );
}

function XItem({ item, theme, xembed }) {
  if (item.href && xembed) {
    return (
      <article className="st-item st-item--embed">
        <TweetEmbed key={theme} href={item.href} text={item.text} theme={theme}></TweetEmbed>
      </article>
    );
  }
  if (item.linkOnly) {
    return (
      <article className="st-item st-item--take">
        <div className="st-item__main">
          <a className="st-item__cta" href={item.href} target="_blank" rel="noreferrer">a post from this day · view on X ↗</a>
        </div>
        <span className="st-item__date">{fmtDate(item.date, item.dateApprox)}</span>
      </article>
    );
  }
  return (
    <article className="sds-card st-item">
      <div className="sds-card__body">
        <TitleRow item={item} href={item.href}></TitleRow>
        <p className="st-item__xtext">{item.text}</p>
        {item.href ? <a className="st-item__cta" href={item.href} target="_blank" rel="noreferrer">view on X ↗</a> : null}
      </div>
    </article>
  );
}

const RENDERERS = { essay: EssayItem, win: WinItem, project: ProjectItem, photo: PhotoItem, sutra: SutraItem, take: TakeItem, x: XItem, work: WorkItem, paper: PaperItem };

function MonthMarker({ ym }) {
  const [y, m] = ym.split('-').map(Number);
  const label = `${MONTH_NAMES[m - 1]} ${y}`;
  return (
    <div className="st-month" data-screen-label={label}>
      <span className="st-month__tick"></span>
      <span className="st-month__label">{label}</span>
      <span className="st-month__rule"></span>
    </div>
  );
}

const LAYOUTS = [
  { key: 'stream', label: 'stream', hint: 'chronological diary' },
  { key: 'stack', label: 'stack', hint: 'proof first' },
  { key: 'lanes', label: 'lanes', hint: 'by craft' },
];

function groupByMonth(items) {
  const groups = [];
  items.forEach((it) => {
    const ym = it.date.slice(0, 7);
    const last = groups[groups.length - 1];
    if (last && last.ym === ym) last.items.push(it);
    else groups.push({ ym, items: [it] });
  });
  return groups;
}

function tileMedia(item) {
  if (item.image) return { kind: 'img', src: item.image };
  if (item.images && item.images[0]) return { kind: 'img', src: item.images[0] };
  if (item.demo) return { kind: 'img', src: item.demo };
  if (item.video) return { kind: 'video', src: item.video + '#t=10' };
  return null;
}

function ProofCard({ item }) {
  const href = item.href || item.github || item.live;
  const media = tileMedia(item);
  const brand = !media && item.logos && item.logos[0];
  const brandMeta = LOGOS[brand];
  const title = href
    ? <a className="st-item__title" href={href} target="_blank" rel="noreferrer">{item.title}</a>
    : <span className="st-item__title">{item.title}</span>;
  return (
    <article className={`sds-card st-proofcard${media || brand ? ' st-proofcard--media' : ''}`}>
      {media && media.kind === 'img' ? (
        <a className="st-tile__media" href={href || media.src} target="_blank" rel="noreferrer">
          <img src={media.src} alt="" loading="lazy"></img>
        </a>
      ) : null}
      {media && media.kind === 'video' ? (
        <div className="st-tile__media">
          <video src={media.src} muted playsInline preload="metadata"></video>
        </div>
      ) : null}
      {brand ? (
        <div className={`st-tile__media st-tile__media--brand${brandMeta && brandMeta.fill ? ' st-tile__media--fill' : ''}`}>
          <LogoMark k={brand} size="hero"></LogoMark>
        </div>
      ) : null}
      <div className="sds-card__body">
        <div className="st-item__titleline">
          {media ? <LogoRow keys={item.logos} size="md"></LogoRow> : null}
          {title}
          <span className="st-item__date">{itemDate(item)}</span>
        </div>
        {item.desc ? (
          <p className="st-item__desc st-proofcard__desc">{item.desc}</p>
        ) : null}
      </div>
    </article>
  );
}

// GitHub contributions, read live from the public contributions mirror of the
// GraphQL calendar. No token, no backend: the browser asks on every load.
const GH_USER = 'Tar-ive';
const GH_ENDPOINT = `https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`;
const GH_DAYS = ['Sun', '', 'Tue', '', 'Thu', '', 'Sat'];
const GH_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const GH_BLANK = Array.from({ length: 53 }, () => new Array(7).fill(null));

const ghDay = (date) => new Date(`${date}T00:00:00Z`).getUTCDay();

// Calendar columns are weeks; a day lands on its own weekday row, so a year
// that starts mid-week keeps the leading cells empty instead of shifting.
function ghWeeks(days) {
  const weeks = [];
  let week = new Array(7).fill(null);
  days.forEach((d) => {
    week[ghDay(d.date)] = d;
    if (ghDay(d.date) === 6) {
      weeks.push(week);
      week = new Array(7).fill(null);
    }
  });
  if (week.some(Boolean)) weeks.push(week);
  return weeks;
}

function ghMonthLabels(weeks) {
  let prev = -1;
  return weeks.map((w) => {
    const first = w.find(Boolean);
    if (!first) return null;
    const m = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (m === prev) return null;
    prev = m;
    return GH_MONTHS[m];
  });
}

function GitHubActivity() {
  const [gh, setGh] = React.useState({ status: 'loading', days: [], total: 0, at: '' });

  React.useEffect(() => {
    let live = true;
    fetch(GH_ENDPOINT)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json) => {
        if (!live) return;
        const days = Array.isArray(json.contributions) ? json.contributions : [];
        const total = (json.total && json.total.lastYear) || days.reduce((n, d) => n + (d.count || 0), 0);
        setGh({
          status: days.length ? 'ok' : 'error',
          days,
          total,
          at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      })
      .catch(() => { if (live) setGh({ status: 'error', days: [], total: 0, at: '' }); });
    return () => { live = false; };
  }, []);

  const weeks = React.useMemo(() => (gh.days.length ? ghWeeks(gh.days) : GH_BLANK), [gh.days]);
  const months = React.useMemo(() => ghMonthLabels(weeks), [weeks]);
  const ok = gh.status === 'ok';

  return (
    <section className="st-gh" aria-label="GitHub activity">
      <p className="st-gh__cmd"><span className="st-gh__prompt">$</span> git log --contributions</p>
      <h2 className="st-gh__head">GitHub Activity</h2>
      <div className="st-gh__card">
        <div className="st-gh__top">
          <div>
            <p className="st-gh__total">
              {ok ? `${gh.total.toLocaleString()} contributions` : gh.status === 'loading' ? 'reading the calendar' : 'contributions'}
            </p>
            <p className="st-gh__sub">github.com/{GH_USER} · the last year</p>
            <a className="st-gh__link" href={`https://github.com/${GH_USER}`} target="_blank" rel="noreferrer">&gt; github</a>
          </div>
          <p className={`st-gh__live${ok ? '' : ' st-gh__live--off'}`}>
            <span className="st-dot"></span>
            {ok ? 'LIVE' : gh.status === 'loading' ? 'FETCHING' : 'OFFLINE'}
          </p>
        </div>
        {gh.status === 'error' ? (
          <p className="st-gh__err">GitHub did not answer this time. The graph is on the profile.</p>
        ) : (
          <div className="st-gh__scroll">
            <div className="st-gh__cal">
              <div className="st-gh__months">
                {months.map((m, i) => <span key={i}>{m}</span>)}
              </div>
              <div className="st-gh__daylabels">
                {GH_DAYS.map((d, i) => <span key={i}>{d}</span>)}
              </div>
              <div className="st-gh__grid">
                {weeks.map((w, wi) => w.map((d, di) => (
                  <span
                    key={`${wi}-${di}`}
                    className={`st-gh__cell st-gh__cell--l${d ? d.level : 0}${d ? '' : ' st-gh__cell--none'}`}
                    title={d ? `${d.count} on ${d.date}` : undefined}
                  ></span>
                )))}
              </div>
            </div>
          </div>
        )}
        <div className="st-gh__foot">
          <span>{ok ? `updated ${gh.at}` : gh.status === 'loading' ? 'updating' : 'last fetch failed'}</span>
          <span className="st-gh__legend">
            Less
            {[0, 1, 2, 3, 4].map((l) => <i key={l} className={`st-gh__cell st-gh__cell--l${l}`}></i>)}
            More
          </span>
        </div>
      </div>
    </section>
  );
}

function ViewSwitch({ layout, onLayout }) {
  return (
    <nav className="st-viewswitch" aria-label="Presentation">
      <span className="st-rail__filterhead">view</span>
      {LAYOUTS.map((v) => (
        <button
          key={v.key}
          className={`st-view${layout === v.key ? ' st-view--on' : ''}`}
          onClick={() => onLayout(v.key)}
          title={v.hint}
        >
          {v.label}
        </button>
      ))}
    </nav>
  );
}

function ChronoFeed({ items, theme, xembed }) {
  const groups = groupByMonth(items);
  return (
    <React.Fragment>
      {groups.map((g) => (
        <section key={g.ym} className="st-group">
          <MonthMarker ym={g.ym}></MonthMarker>
          {g.items.map((it) => {
            const R = RENDERERS[it.type];
            return <R key={it.id} item={it} theme={theme} xembed={xembed}></R>;
          })}
        </section>
      ))}
    </React.Fragment>
  );
}

function StackFeed({ byId, data, filter, theme, xembed }) {
  const P = window.STREAM_PRESENTATION;
  const featured = P.featured.map((id) => byId[id]).filter(Boolean);
  const hidden = new Set(P.featured);
  const active = FILTERS.find((f) => f.key === filter);
  const signal = (t) => t === 'work' || t === 'project' || t === 'paper' || t === 'win' || t === 'photo';
  const rest = data.filter((it) => !hidden.has(it.id) && (filter === 'all' ? signal(it.type) : active.match(it.type)));
  return (
    <React.Fragment>
      <div className="st-stats">
        {P.stats.map((s) => {
          return (
            <div className={`st-stat${s.big ? ' st-stat--big' : ''}`} key={s.label}>
              <span className="st-stat__n">{s.n}</span>
              <span className="st-stat__org">
                {s.logo ? <LogoMark k={s.logo} size="hero"></LogoMark> : null}
                <span className="st-stat__l">{s.label}</span>
              </span>
            </div>
          );
        })}
      </div>
      <h2 className="st-sectionhead">selected work</h2>
      <div className="st-featured">
        {featured.map((it) => <ProofCard key={it.id} item={it}></ProofCard>)}
      </div>
      <h2 className="st-sectionhead">the rest of the stream</h2>
      <div className="st-rest">
        <ChronoFeed items={rest} theme={theme} xembed={xembed}></ChronoFeed>
      </div>
    </React.Fragment>
  );
}

function LanesFeed({ byId }) {
  const P = window.STREAM_PRESENTATION;
  return (
    <div className="st-lanes">
      {P.lanes.map((lane) => (
        <section className="st-lane" key={lane.key}>
          <header className="st-lane__head">
            <h2>{lane.label}</h2>
            <p>{lane.blurb}</p>
          </header>
          <div className="st-lane__items">
            {lane.ids.map((id) => byId[id]).filter(Boolean).map((it) => (
              <ProofCard key={it.id} item={it}></ProofCard>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Rail({ filter, setFilter, counts, theme, onTheme, layout, onLayout }) {
  return (
    <aside className="st-rail">
      <a className="sds-nav__mark st-rail__mark" href="#">
        <span className="danda">॥</span><span>saksham</span>
      </a>
      <p className="st-rail__status">
        <span className="st-dot"></span>incoming to calhacks
      </p>
      <p className="st-rail__bio">
        {window.STREAM_BIO}
      </p>
      {layout === 'stream' ? (
        <SutraQuote
          devanagari="दृष्टमनुमानमाप्तवचनं च"
          translation="Perception, inference, and trusted testimony: the three means of valid knowledge."
          source="sāṅkhya kārikā · 4"
          className="st-rail__sutra"
        ></SutraQuote>
      ) : null}
      <ViewSwitch layout={layout} onLayout={onLayout}></ViewSwitch>
      {layout !== 'lanes' ? (
        <nav className="st-rail__filters" aria-label="Filter the stream">
          <span className="st-rail__filterhead">filter</span>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`st-filter${filter === f.key ? ' st-filter--on' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              <span>{f.label}</span>
              <span className="st-filter__n">{counts[f.key]}</span>
            </button>
          ))}
        </nav>
      ) : null}
      <div className="st-rail__foot">
        <SocialLinks links={[
          { kind: 'x', href: 'https://x.com/saksham_adh', label: 'X' },
          { kind: 'linkedin', href: 'https://www.linkedin.com/in/adhsaksham/', label: 'LinkedIn' },
          { kind: 'github', href: 'https://github.com/Tar-ive', label: 'GitHub' },
          { kind: 'substack', href: 'https://adhsaksham.substack.com', label: 'Substack' },
        ]}></SocialLinks>
        <Button variant="outline" size="sm" href="https://adhsaksham.substack.com" target="_blank">subscribe · anumāna ↗</Button>
        <button className="st-theme" onClick={onTheme} title="Toggle light / dark">
          {theme === 'dark' ? '☾ puruṣa' : '☀ prakṛti'}
        </button>
      </div>
    </aside>
  );
}

// Local preference state (theme/density) persisted to localStorage
function usePrefs(defaults) {
  const [t, setT] = React.useState(() => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem('stream-prefs') || '{}') }; }
    catch (e) { return defaults; }
  });
  const set = (k, v) => setT((p) => {
    const n = { ...p, [k]: v };
    try { localStorage.setItem('stream-prefs', JSON.stringify(n)); } catch (e) {}
    return n;
  });
  return [t, set];
}

function StreamApp() {
  const [t, setTweak] = usePrefs(window.STREAM_TWEAK_DEFAULTS);
  const [filter, setFilter] = React.useState('all');
  const layout = t.layout || 'stream';

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', t.theme === 'dark');
    document.documentElement.classList.toggle('st-compact', t.density === 'compact');
    document.documentElement.classList.toggle('st-nothumbs', !t.thumbs);
  }, [t]);

  const data = React.useMemo(
    () => [...window.STREAM_DATA].filter((it) => it.type !== 'photo' || (it.images && it.images.length)).sort((a, b) => b.date.localeCompare(a.date)),
    []
  );

  const byId = React.useMemo(() => {
    const m = {};
    data.forEach((it) => { m[it.id] = it; });
    return m;
  }, [data]);

  const counts = React.useMemo(() => {
    const c = {};
    FILTERS.forEach((f) => { c[f.key] = data.filter((it) => f.match(it.type)).length; });
    return c;
  }, [data]);

  const active = FILTERS.find((f) => f.key === filter);
  const shown = data.filter((it) => active.match(it.type));

  return (
    <React.Fragment>
      <div className={`st-page st-page--${layout}`}>
        <Rail
          filter={filter} setFilter={setFilter} counts={counts}
          theme={t.theme} onTheme={() => setTweak('theme', t.theme === 'dark' ? 'light' : 'dark')}
          layout={layout} onLayout={(v) => setTweak('layout', v)}
        ></Rail>
        <main className="st-feed">
          <GitHubActivity></GitHubActivity>
          {layout === 'stack' ? (
            <StackFeed
              byId={byId} data={data} filter={filter} theme={t.theme} xembed={t.xembed}
            ></StackFeed>
          ) : null}
          {layout === 'lanes' ? (
            <LanesFeed byId={byId}></LanesFeed>
          ) : null}
          {layout === 'stream' ? (
            <ChronoFeed items={shown} theme={t.theme} xembed={t.xembed}></ChronoFeed>
          ) : null}
          <p className="st-end">॥ the stream began here ॥</p>
          <Footer note="Built slow, to last. No trackers, no noise."></Footer>
        </main>
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<StreamApp></StreamApp>);
