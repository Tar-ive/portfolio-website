// Verifies the static site can't ship a broken reference:
//   - every /media and /_ds asset named in source exists on disk
//   - every id used by presentation, lanes, and the onboarding lenses
//     resolves to a real item in STREAM_DATA
// Run: node scripts/check-site.mjs
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const sources = ['index.html', 'stream-app.jsx', 'stream-data.js', 'llms.txt', 'sitemap.xml'];
const problems = [];

for (const file of sources) {
  if (!existsSync(path.join(root, file))) problems.push(`missing source file: ${file}`);
}

const seen = new Set();
for (const file of sources.filter((f) => existsSync(path.join(root, f)))) {
  const text = readFileSync(path.join(root, file), 'utf8');
  for (const match of text.matchAll(/["'(](\/(?:media|_ds)\/[^"')\s]+)["')]/g)) {
    const rel = match[1].slice(1).split('#')[0];
    if (seen.has(rel)) continue;
    seen.add(rel);
    if (!existsSync(path.join(root, rel))) problems.push(`asset missing: ${rel} (referenced in ${file})`);
  }
}

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(readFileSync(path.join(root, 'stream-data.js'), 'utf8'), sandbox);
const { STREAM_DATA, STREAM_PRESENTATION, STREAM_ONBOARD } = sandbox.window;

if (!Array.isArray(STREAM_DATA) || !STREAM_DATA.length) problems.push('STREAM_DATA is empty');
const ids = new Set((STREAM_DATA || []).map((it) => it.id));

const requireIds = (list, where) => {
  (list || []).forEach((id) => {
    if (!ids.has(id)) problems.push(`unknown item id "${id}" in ${where}`);
  });
};

requireIds(STREAM_PRESENTATION?.featured, 'STREAM_PRESENTATION.featured');
(STREAM_PRESENTATION?.lanes || []).forEach((lane) => requireIds(lane.ids, `lane "${lane.key}"`));

const rounds = STREAM_ONBOARD?.rounds || [];
if (rounds.length < 2) problems.push('STREAM_ONBOARD needs at least two rounds');
rounds.forEach((round) => {
  if (!ids.has(round.itemId)) problems.push(`round "${round.id}" points at unknown item "${round.itemId}"`);
  if ((round.arms || []).length !== 2) problems.push(`round "${round.id}" must have exactly two arms`);
  (round.arms || []).forEach((arm) => {
    if (!arm.title || !arm.body) problems.push(`round "${round.id}" arm "${arm.key}" is missing title or body`);
    if (arm.image && !existsSync(path.join(root, arm.image.slice(1)))) {
      problems.push(`round "${round.id}" arm "${arm.key}" image missing: ${arm.image}`);
    }
  });
});

const lenses = STREAM_ONBOARD?.lenses || {};
const armKeys = rounds.map((r) => (r.arms || []).map((a) => a.key));
const combos = armKeys.length === 2 ? armKeys[0].length * armKeys[1].length : 0;
if (Object.keys(lenses).length !== combos) {
  problems.push(`expected ${combos} lenses for ${combos} pick combinations, found ${Object.keys(lenses).length}`);
}
Object.entries(lenses).forEach(([key, lens]) => {
  if (!lens.bio || !lens.label) problems.push(`lens "${key}" is missing label or bio`);
  requireIds(lens.featured, `lens "${key}".featured`);
  requireIds(lens.picks, `lens "${key}".picks`);
});

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):`);
  problems.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
}

console.log(`✓ ${STREAM_DATA.length} items, ${seen.size} assets, ${Object.keys(lenses).length} lenses — all references resolve`);
