const paths = {
 search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
 bag: <><path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></>,
 menu: <path d="M3 6h18M3 12h18M3 18h18"/>,
 close: <path d="m6 6 12 12M6 18 12-12"/>,
 arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
 check: <path d="m5 12 4 4L19 6"/>,
};
export default function Icon({ name, size = 22 }) {
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.arrow}</svg>;
}
