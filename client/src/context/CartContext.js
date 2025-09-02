import React, { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartCtx = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });

  const persist = (nextOrFn) => {
    const next = typeof nextOrFn === 'function' ? nextOrFn(items) : nextOrFn;
    setItems(next);
    localStorage.setItem('cart', JSON.stringify(next));
  };

  const add = async (product, qty = 1) => {
    try {
      // Check latest availability from backend
      const res = await api.get(`/products/${product._id}`);
      const fresh = res.data;
      if (fresh.isSold) return; // silently ignore
      // Prevent seller from adding their own product
      const sellerId = typeof fresh.sellerId === 'string' ? fresh.sellerId : fresh.sellerId?._id;
      const currentUserId = user?._id;
      if (sellerId && currentUserId && String(sellerId) === String(currentUserId)) {
        toast.error("You can't add your own product");
        return;
      }
      // If already in cart, do nothing (1 product per user)
      const exists = items.some((i) => i._id === product._id);
      if (exists) return;
      persist([...items, { ...fresh, quantity: 1 }]);
      toast.success('Product added to cart succesfully');
    } catch (_) {
      // ignore add if product not found/unavailable
    }
  };

  const remove = (id) => persist(items.filter((i) => i._id !== id));
  const clear = () => persist([]);
  // Lock quantity to 1 for each product
  const setQuantity = (id, _qty) => persist(items.map((i) => (i._id === id ? { ...i, quantity: 1 } : i)));

  const totals = useMemo(() => {
    const toNum = (s) => {
      const n = Number(String(s).replace(/[^0-9.]/g, ''));
      return isNaN(n) ? 0 : n;
    };
    const subtotal = items.reduce((sum, it) => sum + toNum(it.amount) * (it.quantity || 1), 0);
    return { subtotal };
  }, [items]);

  const value = { items, add, remove, clear, setQuantity, totals };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => useContext(CartCtx);
