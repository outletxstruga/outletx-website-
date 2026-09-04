import Image from 'next/image';

// Keep the live database URLs stable while presenting the current catalogue with
// one consistent, white-background studio treatment across the entire store.
const studioImages = {
  '/images/products/1782507220334_maratonki-adidas-ultrarun-5-tr-jq0019-2.jpg': '/images/products/ultrarun-5-studio-v2.png',
  '/images/products/1782508670275_669261.jpg': '/images/products/vl-court-bold-brown-studio-v2.png',
  '/images/products/1782508962810_buty-mlodziezowe-adidas-court-bold-bordowe-ih4780-skorzane-sportowe-36-b-iext187545553.jpg': '/images/products/vl-court-bold-jr-burgundy-studio-v2.png'
};

export default function StoreImage({ src, alt = '', sizes = '(max-width: 720px) 50vw, 25vw', priority = false, className = '' }) {
  if (!src) return <div className="image-unavailable">Image unavailable</div>;
  const displaySrc = studioImages[src] || src;
  // Optimise local and known store uploads; preserve support for other admin-supplied HTTPS images.
  const optimised = displaySrc.startsWith('/') && !displaySrc.startsWith('//') ||
    displaySrc.startsWith('https://qkkscxaenwgqrcpdqeyb.supabase.co/storage/v1/object/public/');
  return <Image src={displaySrc} alt={alt} fill sizes={sizes} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'}
    unoptimized={!optimised} className={className} />;
}
