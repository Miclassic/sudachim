import { mkdirSync, writeFileSync } from 'node:fs';

const SB = 'https://tfqsyovyshheqkslsjhx.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmcXN5b3Z5c2hoZXFrc2xzamh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1MTU3MTMsImV4cCI6MjEwMzA5MTcxM30.S5-0MVJ6HLyFs2TQ5tpE7IlRXum25j7Vwhvnab1pAIY';
const SITE = 'https://miclassic.github.io/sudachim';

const r = await fetch(SB + '/rest/v1/cases?status=eq.approved&hidden=eq.false&select=id,text,hype_title,short_title,category,cover_url&order=id.desc&limit=80', {
  headers: { apikey: KEY, authorization: 'Bearer ' + KEY }
});
const cases = await r.json();
if (!Array.isArray(cases)) { console.log('no cases'); process.exit(0); }

mkdirSync('v', { recursive: true });

for (const c of cases) {
  const clean = String(c.text || '').replace(/\|\|[\s\S]+?\|\|/g, '[скрыто]').replace(/\s+/g, ' ').trim();
  const title = (c.hype_title || c.short_title || clean.slice(0, 70)) + ' — народный суд';
  const desc = 'Народный суд бытовых историй: свайпай и выноси вердикт. Народ решит, кто прав.';
  const page = SITE + '/v/case-' + c.id + '.html';
  const app = SITE + '/?case=' + c.id;
  const img = c.cover_url || (SITE + '/og.png?v=3');
  const html = '<!doctype html><html lang="ru"><head><meta charset="utf-8">' +
    '<title>' + title + '</title>' +
    '<meta name="description" content="' + desc + '">' +
    '<meta property="og:type" content="article">' +
    '<meta property="og:title" content="' + title + '">' +
    '<meta property="og:description" content="' + desc + '">' +
    '<meta property="og:url" content="' + page + '">' +
    '<meta property="og:image" content="' + img + '">' +
    '<scr' + 'ipt>setTimeout(function(){ location.replace("' + app + '") }, 1500);</scr' + 'ipt>' +
    '</head><body>Открываем народный суд… <a href="' + app + '">перейти</a></body></html>';
  writeFileSync('v/case-' + c.id + '.html', html);
}
console.log('generated', cases.length);
