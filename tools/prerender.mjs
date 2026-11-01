import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path';
import {PAGES,IMG,title as seoTitle,areaSeo,SITE} from './seo.mjs';
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
// Fonts are self-hosted (tools/fonts) so no request to Google blocks the first paint. font-display:optional plus
// preloading the above-the-fold faces means text never jumps when a font arrives late (the fallback is much wider).
const FONTS=[['Barlow',400,'normal','barlow-latin-400-normal'],['Barlow',500,'normal','barlow-latin-500-normal'],['Barlow',600,'normal','barlow-latin-600-normal'],['Barlow',700,'normal','barlow-latin-700-normal'],
 ['Barlow Condensed',600,'normal','barlow-condensed-latin-600-normal'],['Barlow Condensed',700,'normal','barlow-condensed-latin-700-normal'],['Barlow Condensed',800,'normal','barlow-condensed-latin-800-normal'],['Barlow Condensed',800,'italic','barlow-condensed-latin-800-italic'],
 ['IBM Plex Mono',500,'normal','ibm-plex-mono-latin-500-normal'],['IBM Plex Mono',600,'normal','ibm-plex-mono-latin-600-normal']];
const fontCss=FONTS.map(([f,w,st,file])=>`@font-face{font-family:'${f}';font-style:${st};font-weight:${w};font-display:optional;src:url(/fonts/${file}.woff2) format('woff2')}`).join('');
const PRELOAD=['barlow-latin-400-normal','barlow-latin-600-normal','barlow-condensed-latin-800-normal','ibm-plex-mono-latin-600-normal'].map(f=>`<link rel="preload" href="/fonts/${f}.woff2" as="font" type="font/woff2" crossorigin>`).join('');
// Photo panels (.ph) are drawn with CSS backgrounds in the preview. On the live pages each becomes a real <img> with a
// phone-sized version and lazy loading, so phones download small files and only the photos that scroll into view.
const imgify=html=>{let first=true;return html.replace(/<(div|section|a)\b([^>]*)>/g,(m,tag,attrs)=>{
  const cls=(attrs.match(/class="([^"]*)"/)||[])[1]||''; if(!/(^|\s)ph(\s|$)/.test(cls)) return m;
  const st=attrs.match(/style="([^"]*)"/); const u=st&&st[1].match(/background(?:-image)?:url\(\/img\/([\w-]+)\.webp\)([^;]*)/); if(!u) return m;
  const pos=((st[1].match(/background-position:([^;]+)/)||[])[1]||(u[2].match(/^\s*([^\/]+)\//)||[])[1]||'center').trim();
  const rest=st[1].replace(/background(?:-image)?:url\([^)]*\)[^;]*;?/,'').replace(/background-position:[^;]+;?/,'').replace(/^;+|;+$/g,'');
  const lcp=first; first=false;
  const sizes=/(^|\s)hero(\s|$)/.test(cls)?'100vw':/(^|\s)tile(\s|$)/.test(cls)?'(max-width:900px) 50vw, 25vw':'(max-width:900px) 100vw, 50vw';
  const lab=/role="img"/.test(attrs)&&(attrs.match(/aria-label="([^"]*)"/)||[])[1];
  const alt=lab||(/(^|\s)hero(\s|$)/.test(cls)&&IMG[u[1]]?IMG[u[1]][1]:'');
  if(lab) attrs=attrs.replace(/\s?role="img"/,'').replace(/\s?aria-label="[^"]*"/,'');
  const img=`<img class="phi" src="/img/${u[1]}.webp" srcset="/img/${u[1]}-800.webp 800w, /img/${u[1]}.webp 1400w" sizes="${sizes}" alt="${alt}"${lcp?' fetchpriority="high"':' loading="lazy"'} decoding="async"${pos!=='center'?` style="object-position:${pos}"`:''}>`;
  return `<${tag}${attrs.replace(/\sstyle="[^"]*"/,rest?` style="${rest}"`:'')}>${img}`;});};
const strip=s=>s.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const sitemap=[];
const siteCss=fontCss+'*,*::before,*::after{box-sizing:border-box}body{margin:0}img{max-width:100%}'+css.trim().replace(/\n+/g,'');
for(const pg of pages){
  await p.evaluate(k=>location.hash=k,pg.key); await p.waitForTimeout(20);
  const d=await p.evaluate(()=>({main:document.getElementById('main').innerHTML,h1:document.querySelector('#main h1')?.textContent||'',lede:document.querySelector('#main .lede')?.innerHTML||'',sec:[...document.querySelectorAll('#nav a.on')].map(a=>a.dataset.sec)[0]||'',
    crumbs:[...(document.querySelector('#main .crumbs')?.childNodes||[])].filter(n=>n.nodeName!=='SPAN').map(n=>[n.textContent.trim(),n.getAttribute?n.getAttribute('href').slice(1):null]),
    faq:[...document.querySelectorAll('#main .faq details')].map(x=>[x.querySelector('summary').textContent.trim(),x.querySelector('p').textContent.trim()])}));
  const pth=map[pg.key], h1=strip(d.h1), isArea=pth.startsWith('/areas/'), isGuide=pth.startsWith('/guides/'), isEvent=pth.startsWith('/event-medical-cover/');
  const seo=PAGES[pg.key]||(isArea?areaSeo(pg.key,h1.replace(/^Event medical cover in /i,'')):null);
  const title=seoTitle(seo?seo[0]:h1);
  let desc=seo?seo[1]:strip(d.lede); if(!seo&&desc.length<100) desc+=isGuide?' A free guide for event organisers from Midlands Ambulance Group.':'';
  if(desc.length>160) desc=desc.slice(0,157).replace(/\s\S*$/,'')+'…';
  const url=SITE+pth;
  const noindex=NOINDEX||pg.key.startsWith('thank-you');
  const ORG={'@id':SITE+'/#org'};
  const graph=[{"@type":"MedicalBusiness","@id":SITE+"/#org","name":"Midlands Ambulance Group","legalName":"Midlands Ambulance Group Ltd","url":SITE+"/","telephone":"+443333358999","email":"info@midlandsambulance.co.uk","foundingDate":"2019","founder":{"@type":"Person","name":"John Blake","jobTitle":"Managing Director"},"address":{"@type":"PostalAddress","addressLocality":"Swadlincote","addressRegion":"Derbyshire","postalCode":"DE11 9ED","addressCountry":"GB"},"areaServed":["United Kingdom","Paris, France"],"logo":SITE+"/img/logo-dark.png","image":SITE+"/img/hero.jpg","knowsAbout":["Event medical cover","Event first aid cover","Event medical planning","First aid training"]},
    {"@type":"WebSite","@id":SITE+"/#website","url":SITE+"/","name":"Midlands Ambulance Group","publisher":ORG,"inLanguage":"en-GB"}];
  if(d.crumbs.length) graph.push({"@type":"BreadcrumbList","itemListElement":d.crumbs.map(([n,k],i)=>({"@type":"ListItem","position":i+1,"name":n,...(k!==null?{"item":SITE+(map[k]||'/')}:{})}))});
  if(d.faq.length) graph.push({"@type":"FAQPage","mainEntity":d.faq.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))});
  if(isArea||isEvent||pg.key==='event-medical-cover') graph.push({"@type":"Service","name":h1,"serviceType":pg.key==='ambulance-hire'?'Event ambulance hire':pg.key==='medical-planning'?'Event medical planning':'Event medical cover',"provider":ORG,"areaServed":isArea?h1.replace(/^Event medical cover in /i,''):'United Kingdom',"url":url});
  if(pth.startsWith('/training/')&&pg.key!=='onsite-training') graph.push({"@type":"Course","name":h1+' course',"description":desc,"provider":{"@type":"Organization","name":"Midlands Ambulance Group","sameAs":SITE+"/"},"url":url});
  if(isGuide) graph.push({"@type":"Article","headline":h1,"description":desc,"author":ORG,"publisher":ORG,"mainEntityOfPage":url,"inLanguage":"en-GB"});
  const hdr=fix(header).replace(new RegExp(`data-sec="${d.sec}"`),`data-sec="${d.sec}" class="on" aria-current="page"`);
  const ld=`<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@graph":graph}).replace(/</g,'\\u003c')}</script>`;
  const html=`<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc.replace(/"/g,'&quot;')}">
${noindex?'<meta name="robots" content="noindex, nofollow">\n':''}<link rel="canonical" href="${url}">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc.replace(/"/g,'&quot;')}"><meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:image" content="__OGIMG__"><meta property="og:site_name" content="Midlands Ambulance Group"><meta property="og:locale" content="en_GB"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/img/logo-dark.png">
${PRELOAD}
<style>${siteCss}</style>
${ld}</head>
<body>
${hdr}
<main id="main">
${imgify(fix(d.main))}
</main>
${fix(footer)}
<script src="/assets/site.js" defer></script>
</body>
</html>
`;
  // Photos are published under descriptive file names (tools/seo.mjs).
  let out=html.replace(/\/img\/([\w-]+?)(-800)?\.webp/g,(m,n,sz)=>IMG[n]?`/img/${IMG[n][0]}${sz||''}.webp`:m);
  const og=(out.match(/class="phi" src="(\/img\/[\w-]+\.webp)"/)||[])[1];
  out=out.replace('__OGIMG__',og?SITE+og:SITE+'/img/hero.jpg');
  const file=path.join(OUT,pth==='/'?'index.html':pth); fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,out);
  if(!pg.key.startsWith('thank-you')) sitemap.push(url);
}
fs.mkdirSync(OUT+'/assets',{recursive:true});
fs.writeFileSync(OUT+'/assets/site.css','/* Midlands Ambulance Group site styles (also inlined in every page) */\n'+siteCss+'\n');
fs.mkdirSync(OUT+'/fonts',{recursive:true});
for(const f of fs.readdirSync(path.join(SRC,'../fonts'))) fs.copyFileSync(path.join(SRC,'../fonts',f),path.join(OUT,'fonts',f));
fs.mkdirSync(OUT+'/img',{recursive:true});
for(const f of fs.readdirSync(OUT+'/img')) fs.unlinkSync(path.join(OUT,'img',f));
for(const f of fs.readdirSync(SRC+'/img')) if(/\.webp$|^hero\.jpg$|^logo-dark\.png$/.test(f)){
  const m=f.match(/^([\w-]+?)(-800)?\.webp$/), to=m&&IMG[m[1]]?IMG[m[1]][0]+(m[2]||'')+'.webp':f;
  fs.copyFileSync(path.join(SRC,'img',f),path.join(OUT,'img',to));}
fs.writeFileSync(OUT+'/assets/site.js',siteJs+'\n');
fs.writeFileSync(OUT+'/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(u=>`  <url><loc>${u}</loc><lastmod>${new Date().toISOString().slice(0,10)}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(OUT+'/robots.txt',NOINDEX?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\nSitemap: https://www.midlandsambulance.co.uk/sitemap.xml\n');
fs.writeFileSync(OUT+'/404.html',fs.readFileSync(path.join(OUT,'index.html'),'utf8').replace(/<link rel="canonical"[^>]*>/,'').replace(/<meta name="robots"[^>]*>\n?/,'').replace('<title>','<meta name="robots" content="noindex">\n<title>'));
console.log(pages.length,'pages');
await b.close();
