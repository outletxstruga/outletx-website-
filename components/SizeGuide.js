import Dialog from './Dialog';
import {useLanguage} from '../context/LanguageContext';
import {useStore} from '../context/StoreContext';
export function SizeGuideContent(){
 const {tr}=useLanguage(), {content}=useStore();
 return <div className="size-guide-copy"><p>{tr('Fit varies by brand and model. Use the size printed on your shoe label; don’t rely on one universal conversion table.')}</p>
 <ol><li><b>{tr('Check a pair that fits')}</b><p>{tr('Look at the size label inside your current shoes. A photo helps us compare the brand and model.')}</p></li>
 <li><b>{tr('Measure both feet')}</b><p>{tr('Stand on paper with your heel against a wall. Mark the longest toe and measure heel to toe. Keep the larger measurement.')}</p></li>
 <li><b>{tr('Ask before ordering')}</b><p>{tr('Send the product code, your usual shoe size and foot length to our Instagram. We’ll help you check the right size.')}</p></li></ol>
 <p className="notice-box">{tr('Sizes shown are the product’s listed sizes. Confirm the sizing system with us if you are unsure, especially for children’s shoes.')}</p>
 <a className="store-button" href={'https://instagram.com/'+content.settings.instagram.replace(/^@/,'')} target="_blank" rel="noopener noreferrer">{tr('Ask for size help')} ↗</a></div>;
}
export default function SizeGuide({isOpen,onClose}){const {tr}=useLanguage();return <Dialog open={isOpen} onClose={onClose} title={tr('Size guide')}><SizeGuideContent/></Dialog>;}
