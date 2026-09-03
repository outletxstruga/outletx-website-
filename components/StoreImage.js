import Image from 'next/image';
export default function StoreImage({ src, alt = '', sizes = '(max-width: 720px) 50vw, 25vw', priority = false, className = '' }) {
  if (!src) return <div className="image-unavailable">Image unavailable</div>;
  // Optimise local and known store uploads; preserve support for other admin-supplied HTTPS images.
  const optimised = src.startsWith('/') && !src.startsWith('//') ||
    src.startsWith('https://qkkscxaenwgqrcpdqeyb.supabase.co/storage/v1/object/public/');
  return <Image src={src} alt={alt} fill sizes={sizes} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'}
    unoptimized={!optimised} className={className} />;
}
