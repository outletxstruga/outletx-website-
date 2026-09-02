import { CartProvider } from '../context/CartContext';
import { StoreProvider } from '../context/StoreContext';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import CartDrawer from '../components/CartDrawer';
import '../styles/globals.css';
import '../styles/admin.css';
import '../styles/store.css';
import '../styles/cart.css';
import '../styles/home.css';
import '../styles/catalogue.css';
import '../styles/product.css';
import '../styles/checkout.css';
import '../styles/info.css';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <StoreProvider><CartProvider>
          <Component {...pageProps} />
          <CartDrawer />
        </CartProvider></StoreProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default MyApp;
