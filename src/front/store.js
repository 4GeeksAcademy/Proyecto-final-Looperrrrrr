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

    case "add_to_cart":
      return { ...store, cart: [...store.cart, action.payload] };

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

      return { ...store, token: null, user_id: null };

    default:
      throw Error("Unknown action.");
  }
}
