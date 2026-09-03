import SiteLink from './SiteLink';
export default function Breadcrumbs({ items = [] }) {
 return <nav aria-label="Breadcrumb" className="breadcrumbs"><ol><li><SiteLink href="/">Home</SiteLink></li>{items.map((item,i)=><li key={i}>{item.href ? <SiteLink href={item.href}>{item.label}</SiteLink> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>;
}
