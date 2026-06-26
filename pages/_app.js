import { CartProvider } from '../context/CartContext';
import { LanguageProvider } from '../context/LanguageContext';
import CartDrawer from '../components/CartDrawer';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <CartProvider>
        <Component {...pageProps} />
        <CartDrawer />
      </CartProvider>
    </LanguageProvider>
  );
}

export default MyApp;