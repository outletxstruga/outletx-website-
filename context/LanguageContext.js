import {createContext,useContext,useEffect,useState} from 'react';
import {messages} from '../lib/i18n';
const LanguageContext=createContext({lang:'en',setLang:()=>{},tr:value=>value});
export function LanguageProvider({children}){
 const [lang,setLangState]=useState('en');
 useEffect(()=>{try{const saved=localStorage.getItem('outletx_lang');if(['en','mk','sq'].includes(saved)){setLangState(saved);document.documentElement.lang=saved;}}catch{}},[]);
 function setLang(next){if(!['en','mk','sq'].includes(next))return;setLangState(next);try{localStorage.setItem('outletx_lang',next);}catch{}document.documentElement.lang=next;}
 function tr(key,values={}){let value=messages[lang]?.[key]||key;for(const [name,replacement] of Object.entries(values))value=value.replaceAll('{'+name+'}',String(replacement));return value;}
 return <LanguageContext.Provider value={{lang,setLang,tr}}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){return useContext(LanguageContext);}
