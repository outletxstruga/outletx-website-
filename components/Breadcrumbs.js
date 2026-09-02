import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function Breadcrumbs({ items }) {
  const { dark } = useTheme();
  const textColor = dark ? '#AAA' : '#555';
  const separatorColor = dark ? '#444' : '#CCC';

  return (
    <nav style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 6, 
      marginBottom: 16, 
      fontFamily: 'Inter, sans-serif', 
      fontSize: 13, 
      fontWeight: 500 
    }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isLast ? (
              <span style={{ color: '#DC2626', fontWeight: 700 }}>{item.label}</span>
            ) : (
              <Link href={item.link} style={{ 
                color: textColor, 
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}>
                {item.label}
              </Link>
            )}
            {!isLast && <span style={{ color: separatorColor }}>/</span>}
          </span>
        );
      })}
    </nav>
  );
}