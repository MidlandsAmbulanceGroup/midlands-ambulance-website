// Enquiry forms send to the UKMRG Control Centre (Client Hub pipeline), then show the thank-you page.
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
