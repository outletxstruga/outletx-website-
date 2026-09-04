import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import SiteLink from './SiteLink';
import StoreImage from './StoreImage';
import { useLanguage } from '../context/LanguageContext';

const PROMO_KEY = 'outletx_clearance_70_v1';
const SHOW_AGAIN_AFTER = 24 * 60 * 60 * 1000;

export default function PromoPopup({ product }) {
  const { tr } = useLanguage();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastSeen = 0;
    try { lastSeen = Number(localStorage.getItem(PROMO_KEY) || 0); } catch {}
    if (Date.now() - lastSeen < SHOW_AGAIN_AFTER) return undefined;

    let timer;
    const offerWhenReady = () => {
      if (document.querySelector('.consent-banner')) {
        timer = window.setTimeout(offerWhenReady, 700);
        return;
      }
      setOpen(true);
    };
    timer = window.setTimeout(offerWhenReady, 1100);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const dialog = dialogRef.current;
    const previous = document.activeElement;
    dialog.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = oldOverflow;
      if (previous?.isConnected) previous.focus();
    };
  }, [open]);

  const dismiss = () => {
    try { localStorage.setItem(PROMO_KEY, String(Date.now())); } catch {}
    setOpen(false);
  };

  if (!open) return null;
  const image = product?.images?.[0] || '/images/products/ultrarun-5-studio-v2.png';
  const name = product ? `${product.brand} ${product.name}` : 'OutletX footwear';

  return <dialog
    ref={dialogRef}
    className="promo-dialog"
    aria-labelledby="clearance-title"
    aria-describedby="clearance-description"
    onCancel={(event) => { event.preventDefault(); dismiss(); }}
    onClick={(event) => { if (event.target === event.currentTarget) dismiss(); }}
  >
    <button ref={closeRef} className="promo-close" onClick={dismiss} aria-label={tr('Close offer')}><Icon name="close" /></button>
    <div className="promo-layout">
      <div className="promo-copy">
        <div className="promo-logo" aria-label="OutletX">OUTLET<span>X</span></div>
        <p className="promo-kicker">{tr('Clearance event')}</p>
        <h2 id="clearance-title"><span>{tr('Up to')}</span><strong>70%</strong><em>{tr('Off')}</em></h2>
        <p id="clearance-description">{tr('Selected styles. Limited sizes. While stock lasts.')}</p>
        <div className="promo-actions">
          <SiteLink href="/products?sort=discount" className="promo-shop" onClick={dismiss}>{tr('Shop the clearance')} <Icon name="arrow" size={18} /></SiteLink>
          <button onClick={dismiss}>{tr('Keep browsing')}</button>
        </div>
        <small>{tr('Cash on delivery')} · {tr('Free delivery from')} 3,000 MKD</small>
      </div>
      <div className="promo-product" aria-hidden="true">
        <div className="promo-badge"><small>{tr('Selected styles')}</small><strong>−70%</strong></div>
        <div className="promo-product-image"><StoreImage src={image} alt="" sizes="(max-width: 720px) 88vw, 48vw" priority /></div>
        <div className="promo-product-footer"><span>OUTLETX · STRUGA</span><b>{name}</b></div>
      </div>
    </div>
  </dialog>;
}
