// Verifies the static site can't ship a broken reference:
//   - every /media and /_ds asset named in legacy/ source exists on disk
//   - every id used by the presentation resolves to a real item in STREAM_DATA
// Run: node scripts/check-site.mjs
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

// The stream is retired. It still has to hang together in legacy/ so it can
// be revived, so the checker validates it there.
const root = path.join(process.cwd(), 'legacy');
const sources = ['index.html', 'stream-app.jsx', 'stream-data.js'];
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
const { STREAM_DATA, STREAM_PRESENTATION } = sandbox.window;

if (!Array.isArray(STREAM_DATA) || !STREAM_DATA.length) problems.push('STREAM_DATA is empty');
const ids = new Set((STREAM_DATA || []).map((it) => it.id));

const requireIds = (list, where) => {
  (list || []).forEach((id) => {
    if (!ids.has(id)) problems.push(`unknown item id "${id}" in ${where}`);
  });
};

requireIds(STREAM_PRESENTATION?.featured, 'STREAM_PRESENTATION.featured');

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):`);
  problems.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
}

console.log(`✓ ${STREAM_DATA.length} items, ${seen.size} assets — all references resolve`);
