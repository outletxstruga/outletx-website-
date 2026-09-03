import Head from 'next/head';
export const SITE_URL = 'https://outletx-website.vercel.app';
export default function Seo({ title, description, path = '/', noindex = false, schema }) {
  return <Head>
    <title>{title}</title>
    <meta name="description" content={description || 'Discover branded footwear at OutletX. Shop online or visit Dua Mall, Struga.'} />
    <link rel="canonical" href={SITE_URL + path} />
    <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />
    <meta property="og:type" content="website" /><meta property="og:site_name" content="OutletX" />
    <meta property="og:title" content={title} /><meta property="og:description" content={description || 'Branded footwear. Outlet prices. Dua Mall, Struga.'} />
    <meta property="og:url" content={SITE_URL + path} />
    <meta name="twitter:card" content="summary" /><meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description || 'Branded footwear. Outlet prices. Dua Mall, Struga.'} />
    <link rel="icon" href="/icon.svg" type="image/svg+xml" />
    <meta name="theme-color" content="#111111" />
    {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema).replace(/</g,'\\u003c')}} />}
  </Head>;
}
