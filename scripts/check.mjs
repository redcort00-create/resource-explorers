import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { topics } from '../src/content.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const errors=[];
const pages=(await readdir(dist)).filter(f=>f.endsWith('.html'));
const documents=Object.fromEntries(await Promise.all(pages.map(async f=>[f,await readFile(path.join(dist,f),'utf8')])));
for(const [file,html] of Object.entries(documents)){
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length)errors.push(`${file}: duplicate IDs`);
  if(!html.includes('lang="ko"'))errors.push(`${file}: missing Korean language`);
  if((html.match(/<h1>/g)||[]).length!==1)errors.push(`${file}: must have one h1`);
  for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
    const value=match[1].replaceAll('&amp;','&');
    if(/^(https?:|data:|mailto:)/.test(value))continue;
    const [filename,anchor]=value.split('#');
    const target=filename||file;
    try{await stat(path.resolve(dist,target));}catch{errors.push(`${file}: missing ${target}`);continue;}
    if(anchor){const targetHtml=documents[target];if(!targetHtml?.includes(`id="${anchor}"`))errors.push(`${file}: missing #${anchor} in ${target}`);}
  }
  for(const m of html.matchAll(/<img\b[^>]+>/g))if(!m[0].includes('alt='))errors.push(`${file}: image has no alt`);
  for(const m of html.matchAll(/<textarea\b[^>]*id="([^"]+)"/g))if(!html.includes(`for="${m[1]}"`))errors.push(`${file}: note field has no label`);
  for(const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g))if(!m[0].includes('noopener'))errors.push(`${file}: external link missing noopener`);
}
for(const f of (await readdir(path.join(dist,'assets'))).filter(f=>f.endsWith('.svg'))){
  const svg=await readFile(path.join(dist,'assets',f),'utf8');
  if(!svg.includes('viewBox=')||!svg.includes('aria-label='))errors.push(`${f}: missing scalable viewBox or label`);
}
for(const t of topics){
  const html=documents[t.id+'.html'];
  if(!html)errors.push(`Missing topic ${t.id}`);
  if(!/^[\w-]{11}$/.test(t.video.id))errors.push(`${t.id}: missing video ID`);
  if((html.match(/class="reading-section"/g)||[]).length!==5)errors.push(`${t.id}: missing reading sections`);
  if((html.match(/<textarea /g)||[]).length!==6)errors.push(`${t.id}: missing note fields`);
  if(!html.includes('youtube-nocookie.com/embed/'))errors.push(`${t.id}: no embedded video`);
  if(!html.includes('referrerpolicy="strict-origin-when-cross-origin"'))errors.push(`${t.id}: missing video referrer`);
  if(html.indexOf('id="video"')<html.indexOf('id="sources"'))errors.push(`${t.id}: video must be last`);
  console.log(`${t.name}: ${t.sections.reduce((n,s)=>n+s.paragraphs.join('').length,0)} characters, ${t.sections.length} reading sections, 6 note fields`);
}
execFileSync(process.execPath,['--check',path.join(dist,'assets','app.js')]);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`PASS: ${pages.length} pages; internal links, anchors, assets, form labels, video placements and JavaScript syntax.`);
