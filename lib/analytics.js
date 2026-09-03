export const ANALYTICS_ID='G-6307HFBLYF';
export function applyAnalyticsChoice(choice, isAdmin=false){
 if(typeof window==='undefined')return;
 const accepted=choice==='accepted'&&!isAdmin;
 window.outletxAnalyticsConsent=accepted?'accepted':'declined';
 window['ga-disable-'+ANALYTICS_ID]=!accepted;
 if(choice==='declined'&&typeof document!=='undefined'){
  // Remove first-party Analytics cookies when permission is withdrawn.
  const hostname=window.location.hostname,parts=hostname.split('.');
  const domains=['',...parts.map((_,index)=>parts.slice(index).join('.')).filter(part=>part.includes('.')).map(domain=>'; domain=.'+domain)];
  for(const cookie of document.cookie.split(';')){
   const name=cookie.split('=')[0].trim();
   if(name==='_ga'||name.startsWith('_ga_'))for(const domain of domains)document.cookie=name+'=; Max-Age=0; path=/'+domain+'; SameSite=Lax';
  }
 }
}
export function analyticsItems(items){return items.map(i=>({item_id:String(i.id),item_name:i.name,item_brand:i.brand,item_variant:i.size,price:i.newPrice,quantity:i.quantity||1}));}
export function track(name,parameters={}){if(typeof window!=='undefined'&&window.outletxAnalyticsConsent==='accepted'&&typeof window.gtag==='function')window.gtag('event',name,parameters);}
