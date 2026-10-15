// After a Cognito form is submitted, send the visitor to the matching thank-you page (quote and training forms only).
if(window.Cognito&&Cognito.on){Cognito.on('afterSubmit',function(){var w=document.querySelector('.cog-wrap[data-thanks]');if(w)location.href='/'+w.dataset.thanks+'.html';});}
