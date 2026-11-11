import { cp, mkdir, rm, readFile } from 'node:fs/promises';
const dest = 'dist';
await rm(dest, { recursive: true, force: true });
await mkdir(dest, { recursive: true });
for (const file of ['index.html']) await cp(file, `${dest}/${file}`);
for (const dir of ['src', 'styles', 'assets']) await cp(dir, `${dest}/${dir}`, { recursive: true });
const html = await readFile(`${dest}/index.html`, 'utf8');
if (!html.includes('src/app.js')) throw Error('Entry script missing from output');
console.log('Build complete → dist/ (zero runtime dependencies)');
