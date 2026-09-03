import {useEffect,useRef} from 'react';
import Icon from './Icon';
import {useLanguage} from '../context/LanguageContext';
export default function Dialog({open,onClose,title,children,className=''}) {
 const ref=useRef(null), closeRef=useRef(onClose);closeRef.current=onClose;
 const {tr}=useLanguage();
 useEffect(()=>{
  if(!open)return;
  const node=ref.current, previous=document.activeElement;
  node.showModal();
  const oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{node.close();document.body.style.overflow=oldOverflow;if(previous?.isConnected)previous.focus();};
 },[open]);
 if(!open)return null;
 return <dialog ref={ref} className={'store-dialog '+className} aria-label={title} onCancel={e=>{e.preventDefault();closeRef.current();}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeRef.current();}}}>
 <header className="dialog-header"><h2>{title}</h2><button autoFocus onClick={onClose} aria-label={tr('Close')}><Icon name="close"/></button></header>{children}</dialog>;
}
