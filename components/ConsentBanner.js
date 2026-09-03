import {useEffect,useState} from 'react';
import Script from 'next/script';
import {useRouter} from 'next/router';
import SiteLink from './SiteLink';
import Dialog from './Dialog';
import {useLanguage} from '../context/LanguageContext';
import {ANALYTICS_ID,applyAnalyticsChoice} from '../lib/analytics';
const KEY='outletx_analytics_consent';
export default function ConsentBanner(){
 const [choice,setChoice]=useState(null),[settings,setSettings]=useState(false),{tr}=useLanguage();
 const router=useRouter(),isAdmin=router.pathname.startsWith('/admin');
 useEffect(()=>{let saved=null;try{saved=localStorage.getItem(KEY);}catch{}setChoice(saved==='accepted'||saved==='declined'?saved:'unset');
  const open=()=>setSettings(true);window.addEventListener('outletx:privacy-settings',open);return()=>window.removeEventListener('outletx:privacy-settings',open);},[]);
 function decide(value){applyAnalyticsChoice(value,isAdmin);setChoice(value);setSettings(false);try{localStorage.setItem(KEY,value);}catch{}}
 useEffect(()=>{applyAnalyticsChoice(choice,isAdmin);},[choice,isAdmin]);
 useEffect(()=>{const changing=url=>{if(url.startsWith('/admin'))applyAnalyticsChoice(choice,true);};router.events.on('routeChangeStart',changing);return()=>router.events.off('routeChangeStart',changing);},[router.events,choice]);
 if(isAdmin)return null;
 return <>{choice==='accepted'&&<><Script src={'https://www.googletagmanager.com/gtag/js?id='+ANALYTICS_ID} strategy="afterInteractive"/><Script id="outletx-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${ANALYTICS_ID}',{allow_google_signals:false,allow_ad_personalization_signals:false});`}</Script></>}
 {choice==='unset'&&<section className="consent-banner" aria-label={tr('Privacy choices')}><div><b>{tr('Your privacy, your choice')}</b><p>{tr('We use necessary storage for your bag and language. With your permission, Google Analytics helps us understand how the shop is used.')}</p><SiteLink href="/privacy">{tr('Read the privacy notice')}</SiteLink></div><div><button className="store-button light" onClick={()=>decide('declined')}>{tr('Decline analytics')}</button><button className="store-button red" onClick={()=>decide('accepted')}>{tr('Accept analytics')}</button></div></section>}
 <Dialog open={settings} onClose={()=>setSettings(false)} title={tr('Cookie settings')}><div className="consent-settings"><div><b>{tr('Necessary storage')}</b><span>{tr('Always active')}</span><p>{tr('Keeps your bag, language and checkout retry protection on this device.')}</p></div><div><b>{tr('Google Analytics')}</b><span>{choice==='accepted'?tr('Accepted'):tr('Not accepted')}</span><p>{tr('Helps us measure visits and shopping actions. No advertising pixel is installed.')}</p></div><div className="consent-actions"><button className="store-button light" onClick={()=>decide('declined')}>{tr('Decline analytics')}</button><button className="store-button red" onClick={()=>decide('accepted')}>{tr('Accept analytics')}</button></div></div></Dialog></>;
}
