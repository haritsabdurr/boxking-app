const initialState = {
  loading: false,
  cartItems: [],
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'addToCart':
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };

    case 'updateCart':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.product_id === action.payload.product_id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'deleteFromCart':
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item.product_id !== action.payload.product_id
        ),
      };

    case 'showLoading':
      return {
        ...state,
        loading: true,
      };

    case 'hideLoading':
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};
