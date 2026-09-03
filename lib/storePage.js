// Only imported by Next.js server data functions. No credentials enter page props.
import { getContent, getProducts, localPreviewOnly } from './store';
export async function getStorePageProps() {
  // A local build can validate without production secrets. Deployment needs both values.
  if (process.env.NODE_ENV === 'production' && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { props: { initialStore: null }, revalidate: 10 };
  }
  const [products, content] = await Promise.all([getProducts(), getContent()]);
  return { props: { initialStore: { products, content, checkoutReady: !localPreviewOnly() } }, revalidate: 60 };
}
