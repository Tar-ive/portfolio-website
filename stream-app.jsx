// stream-app.jsx — The Stream: identity rail + mixed chronological feed.
// Uses Saksham DS components from window.SakshamDesignSystem_f0fa33.

const SDS = window.SakshamDesignSystem_f0fa33;
const { Tag, Button, SutraQuote, ProjectCard, SocialLinks, Footer, PostItem } = SDS;

const MONTH_NAMES = ['january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'];

const TYPE_LABEL = { essay: 'essay', win: 'win', project: 'project', photo: 'photo', sutra: 'sūtra', take: 'take', x: 'x', work: 'work', paper: 'paper' };

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

function fmtDate(d, approx) {
  const [y, m, day] = d.split('-').map(Number);
  const mon = MONTH_NAMES[m - 1].slice(0, 3);
  return approx ? `${mon} ${y}` : `${mon} ${String(day).padStart(2, '0')}`;
}

const itemDate = (item) => item.display || fmtDate(item.date, item.dateApprox);

function ItemMeta({ item }) {
  return (
    <div className="st-item__meta">
      <Tag variant={item.type === 'win' ? 'accent' : 'outline'}>{TYPE_LABEL[item.type]}</Tag>
      {(item.tags || []).map((t) => <Tag key={t}>{t}</Tag>)}
      <span className="st-item__date">{itemDate(item)}</span>
    </div>
  );
}

function WorkItem({ item }) {
  return (
    <div className="st-item st-item--work">
      <PostItem
        date={itemDate(item)}
        title={item.title}
        href={item.href || '#'}
        description={item.desc}
        source={(item.tags && item.tags[0]) || 'work'}
      ></PostItem>
    </div>
  );
}

function PaperItem({ item }) {
  return (
    <article className="sds-card st-item">
      <div className="sds-card__body">
        <ItemMeta item={item}></ItemMeta>
        <span className="st-item__title st-item__title--paper">{item.title}</span>
        {item.desc ? <p className="st-item__desc">{item.desc}</p> : null}
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
          <ItemMeta item={item}></ItemMeta>
          <a className="st-item__title" href={item.href} target="_blank" rel="noreferrer">{item.title}</a>
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

function WinItem({ item }) {
  return (
    <article className="sds-card sds-card--tint st-item st-item--win">
      <div className="sds-card__body">
        <ItemMeta item={item}></ItemMeta>
        {item.href
          ? <a className="st-item__title" href={item.href} target="_blank" rel="noreferrer">{item.title}</a>
          : <span className="st-item__title">{item.title}</span>}
        {item.desc ? <p className="st-item__desc">{item.desc}</p> : null}
        <ItemVideo item={item}></ItemVideo>
        {item.href ? <a className="st-item__cta" href={item.href} target="_blank" rel="noreferrer">{item.hrefLabel || 'more'} ↗</a> : null}
      </div>
    </article>
  );
}

function ProjectItem({ item }) {
  return (
    <article className="st-item">
      {item.video ? <div className="st-media"><ItemVideo item={item} className=""></ItemVideo></div> : null}
      <div className={item.video ? 'st-joined' : ''}>
        <ProjectCard
        title={item.title}
        description={item.desc}
        tags={item.tags || []}
        status={item.status}
          github={item.github}
          live={item.live}
        ></ProjectCard>
      </div>
      <div className="st-item__floatdate">{fmtDate(item.date, item.dateApprox)}</div>
    </article>
  );
}

function PhotoItem({ item }) {
  return (
    <article className="sds-card st-item">
      <div className="sds-card__body">
        <ItemMeta item={item}></ItemMeta>
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
      <Tag variant="outline">take</Tag>
      <div className="st-item__main">
        <p className="st-item__desc st-item__takeline">{item.text}</p>
        {item.source ? <span className="st-item__src">{item.source}</span> : null}
      </div>
      <span className="st-item__date">{fmtDate(item.date, item.dateApprox)}</span>
    </article>
  );
}

// X's /i/web/status/ links don't resolve in the embed widget — normalize
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
        <Tag variant="outline">x</Tag>
        <div className="st-item__main">
          <a className="st-item__cta" href={item.href} target="_blank" rel="noreferrer">a post from this day — view on X ↗</a>
        </div>
        <span className="st-item__date">{fmtDate(item.date, item.dateApprox)}</span>
      </article>
    );
  }
  return (
    <article className="sds-card st-item">
      <div className="sds-card__body">
        <ItemMeta item={item}></ItemMeta>
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

function Rail({ filter, setFilter, counts, theme, onTheme }) {
  return (
    <aside className="st-rail">
      <a className="sds-nav__mark st-rail__mark" href="#">
        <span className="danda">॥</span><span>saksham</span>
      </a>
      <p className="st-rail__bio">
        ML/AI Engineer — I work on recommendation systems, computer vision,
        inference engineering, high performance servers, backend apis.
      </p>
      <SutraQuote
        devanagari="दृष्टमनुमानमाप्तवचनं च"
        translation="Perception, inference, and trusted testimony — the three means of valid knowledge."
        source="sāṅkhya kārikā · 4"
        className="st-rail__sutra"
      ></SutraQuote>
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
      <div className="st-rail__foot">
        <SocialLinks links={[
          { kind: 'x', href: 'https://x.com/saksham_adh', label: 'X' },
          { kind: 'linkedin', href: 'https://www.linkedin.com/in/adhsaksham/', label: 'LinkedIn' },
          { kind: 'github', href: 'https://github.com/Tar-ive', label: 'GitHub' },
          { kind: 'substack', href: 'https://adhsaksham.substack.com', label: 'Substack' },
        ]}></SocialLinks>
        <Button variant="outline" size="sm" href="https://adhsaksham.substack.com" target="_blank">subscribe — anumāna ↗</Button>
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

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', t.theme === 'dark');
    document.documentElement.classList.toggle('st-compact', t.density === 'compact');
    document.documentElement.classList.toggle('st-nothumbs', !t.thumbs);
  }, [t]);

  const data = React.useMemo(
    () => [...window.STREAM_DATA].filter((it) => it.type !== 'photo').sort((a, b) => b.date.localeCompare(a.date)),
    []
  );

  const counts = React.useMemo(() => {
    const c = {};
    FILTERS.forEach((f) => { c[f.key] = data.filter((it) => f.match(it.type)).length; });
    return c;
  }, [data]);

  const active = FILTERS.find((f) => f.key === filter);
  const shown = data.filter((it) => active.match(it.type));

  // group by month
  const groups = [];
  shown.forEach((it) => {
    const ym = it.date.slice(0, 7);
    const last = groups[groups.length - 1];
    if (last && last.ym === ym) last.items.push(it);
    else groups.push({ ym, items: [it] });
  });

  return (
    <React.Fragment>
      <div className="st-page">
        <Rail
          filter={filter} setFilter={setFilter} counts={counts}
          theme={t.theme} onTheme={() => setTweak('theme', t.theme === 'dark' ? 'light' : 'dark')}
        ></Rail>
        <main className="st-feed">
          {groups.map((g) => (
            <section key={g.ym} className="st-group">
              <MonthMarker ym={g.ym}></MonthMarker>
              {g.items.map((it) => {
                const R = RENDERERS[it.type];
                return <R key={it.id} item={it} theme={t.theme} xembed={t.xembed}></R>;
              })}
            </section>
          ))}
          <p className="st-end">॥ the stream began here ॥</p>
          <Footer note="Built slow, to last. No trackers, no noise."></Footer>
        </main>
      </div>

    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<StreamApp></StreamApp>);
