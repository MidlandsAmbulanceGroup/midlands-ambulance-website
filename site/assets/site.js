// Until the Cognito forms are embedded, enquiry forms go straight to the matching thank-you page.
document.addEventListener('submit',function(e){var f=e.target.closest('form[data-form]');if(!f)return;e.preventDefault();location.href=f.dataset.form==='training'?'/thank-you-training/':'/thank-you-quote/';});
