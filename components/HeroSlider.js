import SiteLink from './SiteLink';
import StoreImage from './StoreImage';
import Icon from './Icon';
import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { discountOf, stockOf, money } from '../lib/catalogue';
import { useLanguage } from '../context/LanguageContext';

export default function HeroSlider() {
  const { content, products } = useStore();
  const [current, setCurrent] = useState(0);
  const { tr } = useLanguage();
  const available = products.filter((product) => stockOf(product) > 0);
  const slides = content.slides?.length ? content.slides : [{ title: 'GOOD SHOES.', subtitle: 'BETTER PRICES.', link: '/products', linkText: 'Find your pair' }];
  const slideIndex = current % slides.length;
  const slide = slides[slideIndex];
  const product = available[slideIndex % Math.max(available.length, 1)];
  const maxDiscount = Math.max(0, ...available.map(discountOf));
  // Replace only the original starter campaigns; custom campaigns remain editable in the admin.
  const starter = ['BRANDED SPORTSWEAR.', 'NEW COLLECTION.', 'UP TO 70% OFF.'].includes(slide.title);
  const title = starter ? tr(['GOOD SHOES.', 'FIND YOUR', 'OUTLET PRICES.'][slideIndex % 3]) : slide.title;
  const subtitle = starter ? tr(['BETTER PRICES.', 'EVERYDAY PAIR.', 'REAL SAVINGS.'][slideIndex % 3]) : slide.subtitle;
  const description = starter
    ? (slideIndex % 3 === 2 && maxDiscount > 0 ? tr('Save up to {count}% on the styles currently in stock.', { count: maxDiscount }) : tr('Discover branded footwear at OutletX. Choose your pair online or try it on at Dua Mall, Struga.'))
    : slide.description;
  const src = starter && product ? product.images?.[0] : slide.image;
  const discount = product ? discountOf(product) : 0;

  function previous() { setCurrent((current - 1 + slides.length) % slides.length); }
  function next() { setCurrent((current + 1) % slides.length); }

  return <section className="home-hero" aria-label={tr('Featured collection')} aria-roledescription={slides.length > 1 ? 'carousel' : undefined}>
    <div className="home-hero-content">
      <p className="store-eyebrow">{starter ? 'OUTLETX · STRUGA' : slide.tag}</p>
      <h1>{title}<span>{subtitle}</span></h1>
      <p className="hero-description">{description}</p>
      <nav aria-label={tr('Featured collection links')}>
        <SiteLink className="store-button red" href={slide.link || '/products'}>{starter ? tr('Find your pair') : slide.linkText}<Icon name="arrow" /></SiteLink>
        <SiteLink className="hero-secondary" href="/contact">{tr('Visit the store')} ↗</SiteLink>
      </nav>
      <div className="hero-benefits">
        <span><Icon name="check" size={16} />{tr('Cash on delivery')}</span>
        <span><Icon name="check" size={16} />{tr('Free delivery from')} {money(content.settings.freeDeliveryOver)}</span>
        <span><Icon name="check" size={16} />{content.settings.address}</span>
      </div>
    </div>

    <div className="hero-visual">
      <div className="hero-image"><StoreImage src={src} alt={starter && product ? `${product.brand} ${product.name}` : ''} sizes="(max-width: 720px) 100vw, 55vw" priority /></div>
      {starter && product && <>
        <div className="hero-stock-note"><span>{tr('In stock')}</span>{discount > 0 && <b>−{discount}%</b>}</div>
        <SiteLink className="hero-product-label" href={`/product/${product.id}`}>
          <span className="hero-product-name"><small>{product.brand} · {product.sku}</small><b>{product.name}</b></span>
          <span className="hero-product-price">{discount > 0 && <del>{money(product.oldPrice)}</del>}<b>{money(product.newPrice)}</b><Icon name="arrow" size={20} /></span>
        </SiteLink>
      </>}
    </div>

    {slides.length > 1 && <div className="home-hero-controls">
      <button type="button" aria-label={tr('Previous featured slide')} onClick={previous}>←</button>
      <span aria-live="polite">{String(slideIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
      <button type="button" aria-label={tr('Next featured slide')} onClick={next}>→</button>
    </div>}
  </section>;
}
