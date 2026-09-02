import { createContext, useContext, useState, useEffect } from 'react';

import { useStore } from './StoreContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [savedCart, setCart] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const {products}=useStore();
  const cart=savedCart.map(item=>({...item,...(products.find(p=>p.id===item.id)||{}),size:item.size,quantity:item.quantity}));
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('outletx_cart') || '[]');
      if (Array.isArray(saved)) setCart(saved.filter((item) =>
        item && Number.isSafeInteger(item.id) && typeof item.size === 'string' &&
        Number.isInteger(item.quantity) && item.quantity > 0
      ));
    } catch {
      // Invalid or disabled browser storage must not break the bag.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if(hydrated)try{localStorage.setItem('outletx_cart', JSON.stringify(savedCart));}catch{}
  }, [savedCart, hydrated]);

  const addToCart = (product, size) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.size === size 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
  };

  const removeFromCart = (productId, size) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.size === size)));
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === productId && item.size === size ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.newPrice * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, cartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
