import {SITE_URL} from '../components/Seo';
import {getProducts} from '../lib/store';
function xml(value){return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');}
export async function getServerSideProps({res}){
 const staticPaths=['','products','about','contact','help','size-guide','shipping','returns','privacy','terms'];
 let products=[];try{products=await getProducts();}catch{}
 const urls=[...staticPaths.map(path=>SITE_URL+'/'+path),...products.map(p=>SITE_URL+'/product/'+p.id)];
 res.setHeader('Content-Type','application/xml');res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=86400');
 res.write('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>'<url><loc>'+xml(url)+'</loc></url>').join('')+'</urlset>');res.end();
 return {props:{}};
}
export default function Sitemap(){return null;}
