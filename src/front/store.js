export const initialStore = () => {
  return {
    message: null,
    products: [],
    cart: [],

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
      return {
        ...store,
        token: action.payload.token,
        user_id: action.payload.user_id,
      };

    case "logout":
      localStorage.removeItem("token");
      return { ...store, token: null, user_id: null, cart: [] };

    case "set_cart":
      return { ...store, cart: action.payload };

    case "add_to_cart":

    case "remove_from_cart":
      const newCart = store.cart.filter((item) => item.id !== action.payload);
      return { ...store, cart: newCart };

    default:
      throw Error("Unknown action.");
  }
}
