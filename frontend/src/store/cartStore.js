import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Add item to cart
      addItem: (product, quantity = 1, selectedColor, selectedStorage) => {
        const state = get();
        const existingItem = state.items.find(
          item => item._id === product._id && 
                  item.selectedColor === selectedColor && 
                  item.selectedStorage === selectedStorage
        );
        
        if (existingItem) {
          set({
            items: state.items.map(item =>
              item._id === existingItem._id && 
              item.selectedColor === existingItem.selectedColor &&
              item.selectedStorage === existingItem.selectedStorage
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({
            items: [
              ...state.items,
              {
                ...product,
                quantity,
                selectedColor: selectedColor || product.colors?.[0] || null,
                selectedStorage: selectedStorage || product.storage?.[0] || null,
              }
            ]
          });
        }
      },
      
      // Remove item from cart
      removeItem: (id, color, storage) => {
        const state = get();
        set({
          items: state.items.filter(
            item => !(item._id === id && 
                     item.selectedColor === color && 
                     item.selectedStorage === storage)
          )
        });
      },
      
      // Update item quantity
      updateQuantity: (id, color, storage, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, color, storage);
          return;
        }
        
        const state = get();
        set({
          items: state.items.map(item =>
            item._id === id && 
            item.selectedColor === color &&
            item.selectedStorage === storage
              ? { ...item, quantity }
              : item
          )
        });
      },
      
      // Clear entire cart
      clearCart: () => {
        set({ items: [] });
      },
      
      // Get total items count (for badge)
      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
      
      // Get total price
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'royalcellspot-cart', // localStorage key
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.log('An error occurred during hydration:', error);
          return;
        }
        if (state) {
          // Filter out items that don't have a valid string _id.
          // This will remove items that were stored with the old numeric `id`.
          const validItems = state.items.filter(
            item => typeof item._id === 'string' && item._id.length === 24
          );
          state.items = validItems;
        }
      },
    }
  )
);

export default useCartStore;
