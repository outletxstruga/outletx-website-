import Seo from './Seo';
import StoreLayout from './store/StoreLayout';
import Breadcrumbs from './Breadcrumbs';
import {useLanguage} from '../context/LanguageContext';
export default function InfoPage({title,description,eyebrow='OutletX help',path,children}){
 const {lang}=useLanguage();const pick=value=>typeof value==='object'?value[lang]||value.en:value;
 return <StoreLayout><Seo title={pick(title)+' | OutletX'} description={pick(description)} path={path}/><section className="policy-hero"><div className="store-container"><Breadcrumbs items={[{label:pick(title)}]}/><p className="store-eyebrow">{pick(eyebrow)}</p><h1 className="store-title">{pick(title)}</h1><p>{pick(description)}</p></div></section><section className="policy-page store-container">{typeof children==='function'?children({lang,pick}):children}</section></StoreLayout>;
}
