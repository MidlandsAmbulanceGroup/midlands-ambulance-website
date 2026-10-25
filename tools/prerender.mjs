import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path';
const SRC=process.argv[2], OUT=process.argv[3], NOINDEX=process.argv[4]==='noindex';
const src=fs.readFileSync(SRC+'/index.html','utf8');
const css=src.match(/<style>([\s\S]*?)<\/style>/)[1]
  .replace(/\/\* preview bar \*\/[\s\S]*?(?=\/\* header \*\/)/,'')
  .replace(/\/\* page index \*\/[\s\S]*?(?=@media \(max-width:900px\))/,'');
const header=src.match(/<header class="hdr">[\s\S]*?<\/header>/)[0];
const siteJs=src.match(/<script id="site-js">([\s\S]*?)<\/script>/)[1].trim();
const footer=src.match(/<footer class="ftr">[\s\S]*?<\/footer>/)[0];
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
const p=await b.newPage();
await p.goto('file://'+SRC+'/index.html');
const pages=await p.evaluate(()=>[...document.querySelectorAll('#idxList a')].map(a=>({key:a.getAttribute('href').slice(1),label:a.querySelector('span').textContent,path:a.querySelector('code').textContent})));
// Wix Headless serves files at their exact path only (no folder index pages), so each page is its own .html file.
const map=Object.fromEntries(pages.map(x=>[x.key,x.path==='/'?'/':x.path+'.html']));
const fix=html=>html.replace(/(href|action)="#([\w-]+)"/g,(m,a,k)=>map[k]?`${a}="${map[k]}"`:m).replace(/(src=|url\()(["']?)img\//g,'$1$2/img/').replace(/href="#"/g,'href="/contact.html"').replace(/ data-ready=""/g,''); // data-ready is set by the preview's own run of site.js
const strip=s=>s.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const sitemap=[];
for(const pg of pages){
  await p.evaluate(k=>location.hash=k,pg.key); await p.waitForTimeout(20);
  const d=await p.evaluate(()=>({main:document.getElementById('main').innerHTML,h1:document.querySelector('#main h1')?.textContent||'',lede:document.querySelector('#main .lede')?.innerHTML||'',sec:[...document.querySelectorAll('#nav a.on')].map(a=>a.dataset.sec)[0]||''}));
  const title=pg.key==='home'?'Event Medical Cover across the UK | Midlands Ambulance Group':`${strip(d.h1)} | Midlands Ambulance Group`;
  let desc=strip(d.lede); if(desc.length>158) desc=desc.slice(0,155).replace(/\s\S*$/,'')+'…';
  const url='https://www.midlandsambulance.co.uk'+map[pg.key];
  const hdr=fix(header).replace(new RegExp(`data-sec="${d.sec}"`),`data-sec="${d.sec}" class="on" aria-current="page"`);
  const ld=pg.key==='home'?`<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"MedicalBusiness","name":"Midlands Ambulance Group","url":"https://www.midlandsambulance.co.uk/","telephone":"+443333358999","email":"info@midlandsambulance.co.uk","foundingDate":"2019","address":{"@type":"PostalAddress","addressLocality":"Swadlincote","addressRegion":"Derbyshire","postalCode":"DE11 9ED","addressCountry":"GB"},"areaServed":["United Kingdom","Paris, France"],"logo":"https://www.midlandsambulance.co.uk/img/logo-dark.png"})}</script>`:'';
  const html=`<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc.replace(/"/g,'&quot;')}">
${NOINDEX?'<meta name="robots" content="noindex, nofollow">\n':''}<link rel="canonical" href="${url}">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc.replace(/"/g,'&quot;')}"><meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:image" content="https://www.midlandsambulance.co.uk/img/hero.jpg">
<link rel="icon" href="/img/logo-dark.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,800&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
${ld}</head>
<body>
${hdr}
<main id="main">
${fix(d.main)}
</main>
${fix(footer)}
<script src="/assets/site.js" defer></script>
</body>
</html>
`;
  const file=path.join(OUT,map[pg.key]==='/'?'index.html':map[pg.key]); fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,html);
  if(!pg.key.startsWith('thank-you')) sitemap.push(url);
}
fs.mkdirSync(OUT+'/assets',{recursive:true});
fs.writeFileSync(OUT+'/assets/site.css','/* Midlands Ambulance Group site styles */\n*,*::before,*::after{box-sizing:border-box}body{margin:0}img{max-width:100%}\n'+css.trim()+'\n');
fs.writeFileSync(OUT+'/assets/site.js',siteJs+'\n');
fs.writeFileSync(OUT+'/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(u=>`  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(OUT+'/robots.txt',NOINDEX?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\nSitemap: https://www.midlandsambulance.co.uk/sitemap.xml\n');
fs.writeFileSync(OUT+'/404.html',fs.readFileSync(path.join(OUT,'index.html'),'utf8'));
console.log(pages.length,'pages');
await b.close();
