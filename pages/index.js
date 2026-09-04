import SiteLink from '../components/SiteLink';
import Seo from '../components/Seo';
import StoreLayout from '../components/store/StoreLayout';
import HeroSlider from '../components/HeroSlider';
import PromoPopup from '../components/PromoPopup';
import ProductCard from '../components/ProductCard';
import StoreImage from '../components/StoreImage';
import { useStore } from '../context/StoreContext';
import { discountOf, stockOf, groupLabel } from '../lib/catalogue';
import { useLanguage } from '../context/LanguageContext';

export { getStorePageProps as getStaticProps } from '../lib/storePage';

export default function Home() {
  const { products, content, loading } = useStore();
  const { tr } = useLanguage();
  const available = products.filter((product) => stockOf(product) > 0);
  const featured = [...available]
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.id - a.id)
    .slice(0, 6);
  const men = available.find((product) => product.gender.toLowerCase() === 'men');
  const women = available.find((product) => product.gender.toLowerCase() === 'women');
  const categoryIds = new Set([men?.id, women?.id].filter(Boolean));
  const sale = [...available]
    .sort((a, b) => discountOf(b) - discountOf(a))
    .find((product) => !categoryIds.has(product.id)) || available.find((product) => discountOf(product) > 0);
  const collections = [
    men && { key: 'men', title: groupLabel(men.gender), href: '/products?gender=men', product: men },
    women && { key: 'women', title: groupLabel(women.gender), href: '/products?gender=women', product: women },
    sale && { key: 'sale', title: 'Best savings', href: '/products?sort=discount', product: sale }
  ].filter(Boolean);
  const brands = [...new Map(available.map((product) => [product.brand.toLowerCase(), product.brand])).values()];
  const settings = content.settings;

  return <StoreLayout>
    <Seo
      title="OutletX Struga | Branded Footwear. Outlet Prices."
      description="Find your next pair at OutletX. Browse branded shoes, available sizes and outlet prices. Visit Dua Mall, Struga or order with cash on delivery."
    />
    <HeroSlider />
    <PromoPopup product={sale || featured[0]} />

    <section className="home-proof" aria-label={tr('Why shop with OutletX')}>
      <article><span>01</span><div><b>{tr('Live availability')}</b><p>{tr('Only available sizes are shown online.')}</p></div></article>
      <article><span>02</span><div><b>{tr('Clear outlet prices')}</b><p>{tr('See the saving before you choose.')}</p></div></article>
      <article><span>03</span><div><b>{tr('Cash on delivery')}</b><p>{tr('No card details required')}</p></div></article>
      <article><span>04</span><div><b>{tr('Local support')}</b><p>{tr('Try on in Struga or ask us for help.')}</p></div></article>
    </section>

    {collections.length > 0 && <section className="store-section home-category-section">
      <div className="store-container">
        <div className="home-section-head">
          <div><p className="store-eyebrow">{tr('Shop your way')}</p><h2 className="store-title">{tr('Start with your style.')}</h2></div>
          <SiteLink className="text-link" href="/size-guide">{tr('Need help with fit?')} →</SiteLink>
        </div>
        <div className="home-categories">
          {collections.map((collection, index) => <SiteLink key={collection.key} className="home-category" href={collection.href}>
            <div className="category-index">0{index + 1}</div>
            <div className="category-image"><StoreImage src={collection.product.images?.[0]} alt={`${collection.product.brand} ${collection.product.name}`} sizes="(max-width: 720px) 100vw, 33vw" /></div>
            <div className="category-caption"><div><small>{tr('Shop')}</small><h3>{tr(collection.title)}</h3></div><span aria-hidden="true">↗</span></div>
          </SiteLink>)}
        </div>
      </div>
    </section>}

    <section className="store-section home-selection">
      <div className="store-container">
        <div className="home-section-head">
          <div><p className="store-eyebrow">{tr('In stock now')}</p><h2 className="store-title">{tr('Find your next pair.')}</h2><p className="home-section-copy">{tr('Every pair below is currently available to order.')}</p></div>
          <SiteLink className="text-link" href="/products">{tr('Shop all products')} →</SiteLink>
        </div>
        <div className="home-quick-links" aria-label={tr('Shop for')}>
          <SiteLink href="/products" className="active">{tr('All styles')}</SiteLink>
          {['men', 'women', 'kids'].filter((group) => available.some((product) => product.gender.toLowerCase() === group)).map((group) => <SiteLink key={group} href={`/products?gender=${group}`}>{tr(groupLabel(group))}</SiteLink>)}
          <SiteLink href="/products?sort=discount">{tr('Best savings')} ↗</SiteLink>
        </div>
        {featured.length ? <div className="product-grid home-product-grid">{featured.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 3} />)}</div> : <div className="catalogue-empty">
          <h3>{loading ? tr('Loading the collection…') : tr('New stock is on the way')}</h3>
          <p>{tr('Message us to ask about your size or visit the store.')}</p>
          <SiteLink className="text-link" href="/contact">{tr('Contact OutletX')} →</SiteLink>
        </div>}
      </div>
    </section>

    <section className="home-visit">
      <div className="home-visit-wordmark" aria-hidden="true">OUTLET<span>X</span><small>STRUGA</small></div>
      <div className="home-visit-copy">
        <p className="store-eyebrow">{tr('Online, with a real store behind it')}</p>
        <h2>{tr('Come for a look.')}<br />{tr('Leave with your pair.')}</h2>
        <p>{tr('Try on your favourites and get help choosing the right fit. Find us at {address}.', { address: settings.address })}</p>
        <dl className="home-visit-details">
          <div><dt>{tr('Location')}</dt><dd>{settings.address}</dd></div>
          <div><dt>{tr('Mon–Sat')}</dt><dd>{settings.openingHours.weekdays}</dd></div>
          <div><dt>{tr('Sunday')}</dt><dd>{settings.openingHours.sunday}</dd></div>
        </dl>
        <SiteLink className="store-button light" href="/contact">{tr('Plan your visit')} ↗</SiteLink>
      </div>
    </section>

    {brands.length > 0 && <section className="home-brand-list"><p className="store-eyebrow">{tr('Brands currently in stock')}</p><div>{brands.map((brand) => <SiteLink key={brand} href={`/products?brand=${encodeURIComponent(brand.toLowerCase())}`}>{brand} <span>↗</span></SiteLink>)}</div></section>}
  </StoreLayout>;
}
