import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  cartItems: [],
  currentChefId: null,

  addToCart: (item, chefId) => {
    const { cartItems, currentChefId } = get();

    if (currentChefId && currentChefId !== chefId) {
      return false; 
    }

    const existingItem = cartItems.find((i) => i.id === item.id);
    if (existingItem) {
      set({
        cartItems: cartItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({
        cartItems: [...cartItems, { ...item, quantity: 1 }],
        currentChefId: chefId,
      });
    }
    return true;
  },

  removeFromCart: (itemId) => {
    const { cartItems } = get();
    const updatedItems = cartItems
      .map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
      .filter((i) => i.quantity > 0);

    set({
      cartItems: updatedItems,
      currentChefId: updatedItems.length === 0 ? null : get().currentChefId,
    });
  },

  clearCart: () => set({ cartItems: [], currentChefId: null }),

  getTotalPrice: () => {
    return get().cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));

export default useCartStore;