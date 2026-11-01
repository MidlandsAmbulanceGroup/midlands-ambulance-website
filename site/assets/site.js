// After a Cognito form is submitted, send the visitor to the matching thank-you page (quote and training forms only).
if(window.Cognito&&Cognito.on){Cognito.on('afterSubmit',function(){var w=document.querySelector('.cog-wrap[data-thanks]');if(w)location.href='/'+w.dataset.thanks+'.html';});}
// Medical cover guide: picks an indicative level from crowd size and risk factors. A guide only; cover is confirmed in the medical plan.
window.MAGinit=function(){
  document.querySelectorAll('[data-est]:not([data-ready])').forEach(function(el){
    el.setAttribute('data-ready','');
    var L=JSON.parse(el.querySelector('.lvl-data').textContent),r=el.querySelector('[data-crowd]'),out=el.querySelector('[data-crowd-out]'),boxes=el.querySelectorAll('[data-risk]');
    function crowd(v){var n=Math.exp(Math.log(100)+(Math.log(50000)-Math.log(100))*v/100),st=n<1000?50:n<5000?250:n<20000?500:1000;return Math.round(n/st)*st;}
    function draw(){
      var n=crowd(+r.value),f=0,lvl=n<500?1:n<2000?2:n<5000?3:n<10000?4:5;
      out.textContent=n.toLocaleString('en-GB')+(+r.value>=100?'+':'');
      boxes.forEach(function(b){if(b.checked)f+=+b.dataset.risk;});
      if(f>=2)lvl++;if(f>=4)lvl++;lvl=Math.min(5,lvl);
      var d=L[lvl-1];
      el.querySelectorAll('.level i').forEach(function(i,k){i.classList.toggle('on',k<lvl);});
      el.querySelector('[data-lvl-name]').textContent='Level '+lvl+': '+d.name;
      el.querySelector('[data-lvl-sum]').textContent=d.sum;
      el.querySelector('[data-lvl-list]').innerHTML=d.items.map(function(x){return '<li>'+x+'</li>';}).join('');
    }
    r.addEventListener('input',draw);boxes.forEach(function(b){b.addEventListener('change',draw);});draw();
  });
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',window.MAGinit);else window.MAGinit();
// Google Analytics (G-HR5SEVPPY7), loaded only after the visitor accepts cookies, and only on the live domain.
(function(){
  var ID='G-HR5SEVPPY7',K='mag-consent',live=/(^|\.)midlandsambulance\.co\.uk$/.test(location.hostname);
  function get(){try{return localStorage.getItem(K);}catch(e){return null;}}
  function set(v){try{localStorage.setItem(K,v);}catch(e){}}
  function load(){
    window['ga-disable-'+ID]=false;
    if(!live||window.gtag)return;
    window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};
    gtag('js',new Date());gtag('config',ID);
    var m=location.pathname.match(/thank-you-(quote|training)/);if(m)gtag('event','generate_lead',{form_name:m[1]});
    var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+ID;document.head.appendChild(s);
  }
  function clear(){
    window['ga-disable-'+ID]=true;
    document.cookie.split(';').forEach(function(c){var n=c.split('=')[0].trim();if(/^_ga/.test(n)){['',';domain=.midlandsambulance.co.uk',';domain=midlandsambulance.co.uk'].forEach(function(d){document.cookie=n+'=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'+d;});}});
  }
  function banner(){
    if(document.getElementById('ck'))return;
    var d=document.createElement('div');d.id='ck';d.className='ck';d.setAttribute('role','region');d.setAttribute('aria-label','Cookie choice');
    d.innerHTML='<p>We would like to use Google Analytics cookies to see how people use our website, so we can improve it. They are only set if you accept. <a href="/privacy-policy.html#cookies">Privacy policy</a></p><div class="ck-b"><button type="button" class="btn btn-red" data-ck="granted">Accept</button><button type="button" class="btn btn-ghost" data-ck="denied">Reject</button></div>';
    d.addEventListener('click',function(e){var v=e.target.getAttribute('data-ck');if(!v)return;set(v);d.parentNode.removeChild(d);if(v==='granted')load();else clear();});
    document.body.appendChild(d);
  }
  function init(){
    var c=get();if(c==='granted')load();else if(c!=='denied')banner();
    document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-cookies]'))banner();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
