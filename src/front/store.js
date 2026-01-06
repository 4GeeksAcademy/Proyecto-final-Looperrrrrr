export const initialStore = () => {
  return {
    message: null,
    products: [],
    cart: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_products":
      return {
        ...store,
        products: action.payload,
      };

    case "add_to_cart":
      return {
        ...store,
        cart: [...store.cart, action.payload],
      };

    default:
      throw Error("Unknown action.");
  }
}
