export const initialStore = () => {
  return {
    message: null,
    products: [],
    cart: [],
    favorites: [], 
    token: localStorage.getItem("token") || null,
    user_id: localStorage.getItem("user_id") || null,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_products":
      return { ...store, products: action.payload };
      
    case "login":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user_id", action.payload.user_id); 
      return {
        ...store,
        token: action.payload.token,
        user_id: action.payload.user_id,
      };
      
    case "logout":
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      return { ...store, token: null, user_id: null, cart: [], favorites: [] };
      
    case "set_cart":
      return { ...store, cart: action.payload };
      
    case "add_to_cart":
    
      return { ...store, cart: [...store.cart, action.payload] };

    case "remove_from_cart":
      const newCart = store.cart.filter((item) => item.id !== action.payload);
      return { ...store, cart: newCart };

    
    case "set_favorites":
      return { ...store, favorites: action.payload };

    case "add_favorite":
      return { ...store, favorites: [...store.favorites, action.payload] };

    case "remove_favorite":
      return { ...store, favorites: store.favorites.filter(fav => fav.id !== action.payload) };
    

    default:
      throw Error("Unknown action.");
  }
}