import { CartProvider } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
      <CartDrawer />
    </CartProvider>
  );
}

export default MyApp;
