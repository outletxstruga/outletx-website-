import { useRouter } from 'next/router';
import { AdminSessionProvider } from '../context/AdminSessionContext';
import { CartProvider } from '../context/CartContext';
import { StoreProvider } from '../context/StoreContext';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import CartDrawer from '../components/CartDrawer';
import ConsentBanner from '../components/ConsentBanner';
import '../styles/globals.css';
import '../styles/admin.css';
import '../styles/store.css';
import '../styles/cart.css';
import '../styles/home.css';
import '../styles/catalogue.css';
import '../styles/product.css';
import '../styles/checkout.css';
import '../styles/info.css';
import '../styles/polish.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AdminSessionProvider><StoreProvider initialStore={pageProps.initialStore}><CartProvider>
          <Component key={router.asPath.split('#')[0]} {...pageProps} />
          <CartDrawer />
          <ConsentBanner />
        </CartProvider></StoreProvider></AdminSessionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default MyApp;
