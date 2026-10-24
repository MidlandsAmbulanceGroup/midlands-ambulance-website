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
