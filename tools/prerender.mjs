import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path';
const SRC=process.argv[2], OUT=process.argv[3], NOINDEX=process.argv[4]==='noindex';
const src=fs.readFileSync(SRC+'/index.html','utf8');
const css=src.match(/<style>([\s\S]*?)<\/style>/)[1]
  .replace(/\/\* preview bar \*\/[\s\S]*?(?=\/\* header \*\/)/,'')
  .replace(/\/\* page index \*\/[\s\S]*?(?=@media \(max-width:900px\))/,'');
const header=src.match(/<div class="topbar">[\s\S]*?<\/header>/)[0];
const footer=src.match(/<footer class="ftr">[\s\S]*?<\/footer>/)[0];
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
const p=await b.newPage();
await p.goto('file://'+SRC+'/index.html');
const pages=await p.evaluate(()=>[...document.querySelectorAll('#idxList a')].map(a=>({key:a.getAttribute('href').slice(1),label:a.querySelector('span').textContent,path:a.querySelector('code').textContent})));
const map=Object.fromEntries(pages.map(x=>[x.key,x.path==='/'?'/':x.path+'/']));
const fix=html=>html.replace(/href="#([\w-]+)"/g,(m,k)=>map[k]?`href="${map[k]}"`:m).replace(/(src=|url\()(["']?)img\//g,'$1$2/img/').replace(/href="#"/g,'href="/contact/"');
const strip=s=>s.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const sitemap=[];
for(const pg of pages){
  await p.evaluate(k=>location.hash=k,pg.key); await p.waitForTimeout(20);
  const d=await p.evaluate(()=>({main:document.getElementById('main').innerHTML,h1:document.querySelector('#main h1')?.textContent||'',lede:document.querySelector('#main .lede')?.innerHTML||'',sec:[...document.querySelectorAll('#nav a.on')].map(a=>a.dataset.sec)[0]||''}));
  const title=pg.key==='home'?'Event Medical Cover and First Aid Training in the Midlands | Midlands Ambulance Group':`${strip(d.h1)} | Midlands Ambulance Group`;
  let desc=strip(d.lede); if(desc.length>158) desc=desc.slice(0,155).replace(/\s\S*$/,'')+'…';
  const url='https://www.midlandsambulance.co.uk'+map[pg.key];
  const hdr=fix(header).replace(new RegExp(`data-sec="${d.sec}"`),`data-sec="${d.sec}" class="on" aria-current="page"`);
  const ld=pg.key==='home'?`<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"MedicalBusiness","name":"Midlands Ambulance Group","url":"https://www.midlandsambulance.co.uk/","telephone":"+443333358999","email":"info@midlandsambulance.co.uk","foundingDate":"2019","address":{"@type":"PostalAddress","addressLocality":"Swadlincote","addressRegion":"Derbyshire","postalCode":"DE11 9ED","addressCountry":"GB"},"areaServed":"Midlands, United Kingdom","logo":"https://www.midlandsambulance.co.uk/img/logo-dark.png"})}</script>`:'';
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
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap" rel="stylesheet">
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
  const dir=path.join(OUT,map[pg.key]); fs.mkdirSync(dir,{recursive:true}); fs.writeFileSync(path.join(dir,'index.html'),html);
  if(!pg.key.startsWith('thank-you')) sitemap.push(url);
}
fs.mkdirSync(OUT+'/assets',{recursive:true});
fs.writeFileSync(OUT+'/assets/site.css','/* Midlands Ambulance Group site styles */\n*,*::before,*::after{box-sizing:border-box}body{margin:0}img{max-width:100%}\n'+css.trim()+'\n');
fs.writeFileSync(OUT+'/assets/site.js',`// Enquiry forms send to the UKMRG Control Centre (Client Hub pipeline), then show the thank-you page.
(function(){
var URL='https://mag-sag-operations-ukrmg.vercel.app/api/intake?key=mag-website';
var THANKS={training:'/thank-you-training/',quote:'/thank-you-quote/',contact:'/thank-you-quote/'};
var MAP={'q-type':'eventType','q-date':'eventDate','q-venue':'venue','q-att':'attendance','q-notes':'message','q-name':'name','q-contact':'contact','t-course':'course','t-date':'preferredDates','t-num':'attendees','t-name':'name','t-contact':'contact','c-name':'name','c-contact':'contact','c-msg':'message'};
// A hidden field people never see: only bots fill it in.
document.querySelectorAll('form[data-form]').forEach(function(f){var h=document.createElement('input');h.type='text';h.name='website_hp';h.tabIndex=-1;h.autocomplete='off';h.setAttribute('aria-hidden','true');h.style.cssText='position:absolute;left:-9999px;width:1px;height:1px;opacity:0';f.appendChild(h);});
document.addEventListener('submit',function(e){var f=e.target.closest('form[data-form]');if(!f)return;e.preventDefault();
var b=f.querySelector('button[type=submit]');if(b)b.disabled=true;
var data={form:f.dataset.form,page:location.pathname};
f.querySelectorAll('input,select,textarea').forEach(function(el){var k=MAP[el.id]||el.name;if(k&&el.value)data[k]=el.value;});
fetch(URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).then(function(r){if(!r.ok)throw new Error(r.status);location.href=THANKS[f.dataset.form]||THANKS.quote;})
.catch(function(){if(b)b.disabled=false;var p=f.querySelector('.form-error');if(!p){p=document.createElement('p');p.className='note form-error';p.setAttribute('role','alert');f.appendChild(p);}p.textContent='Sorry, that didn’t send. Please call 0333 335 8999 or email info@midlandsambulance.co.uk.';});
});
})();
`);
fs.writeFileSync(OUT+'/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(u=>`  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(OUT+'/robots.txt',NOINDEX?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\nSitemap: https://www.midlandsambulance.co.uk/sitemap.xml\n');
fs.writeFileSync(OUT+'/404.html',fs.readFileSync(path.join(OUT,'index.html'),'utf8'));
console.log(pages.length,'pages');
await b.close();
