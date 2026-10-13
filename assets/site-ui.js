/* Navigation helpers. Analytics and consent are handled by assets/analytics.js. */
(()=>{
'use strict';
let previousContentFocus=null;
document.addEventListener('focusin',event=>{
 const target=event.target;
 if(target instanceof HTMLElement&&!target.closest('.vc-consent')&&!target.matches('.vc-cookie-settings'))previousContentFocus=target;
});
document.addEventListener('click',event=>{
 const target=event.target instanceof Element?event.target.closest('.vc-consent button[data-choice]'):null;
 if(!target)return;
 const x=window.scrollX,y=window.scrollY;
 const returnTo=previousContentFocus&&previousContentFocus.isConnected?previousContentFocus:document.querySelector('main');
 requestAnimationFrame(()=>{
  if(!document.querySelector('.vc-consent')?.hidden)return;
  if(returnTo instanceof HTMLElement){
   if(!returnTo.matches('a,button,input,select,textarea,[tabindex]'))returnTo.setAttribute('tabindex','-1');
   returnTo.focus({preventScroll:true});
  }
  const html=document.documentElement;
  const behavior=html.style.scrollBehavior;
  html.style.scrollBehavior='auto';
  window.scrollTo({left:x,top:y,behavior:'instant'});
  html.style.scrollBehavior=behavior;
 });
},true);
})();
