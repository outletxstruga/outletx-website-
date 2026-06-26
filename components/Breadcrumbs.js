import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#999', marginBottom: 16, flexWrap: 'wrap'}}>
      <Link href="/" style={{color: '#999', textDecoration: 'none', fontWeight: 500}}>Home</Link>
      {items.map((item, i) => (
        <span key={i} style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <span style={{color: '#CCC'}}>/</span>
          {i === items.length - 1 ? (
            <span style={{color: '#000', fontWeight: 600}}>{item.label}</span>
          ) : (
            <Link href={item.link} style={{color: '#999', textDecoration: 'none', fontWeight: 500}}>{item.label}</Link>
          )}
        </span>
      ))}
    </div>
  );
}