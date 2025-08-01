import { createContext, useReducer } from 'react';

export const Store = createContext();

const getInitialCartItems = () => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  if (userInfo?.email) {
    const cart = localStorage.getItem(`cartItems_${userInfo.email}`);
    try {
      const parsed = JSON.parse(cart);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const initialState = {
  fullBox: false,
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {
          fullName: '',
          phone: '',
          address: '',
          landmark: '',
          city: '',
          state: '',
          pin: '',
          country: '',
        },
    paymentMethod: localStorage.getItem('paymentMethod') || '',
    cartItems: getInitialCartItems(),
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FULLBOX_ON':
      return { ...state, fullBox: true };
    case 'SET_FULLBOX_OFF':
      return { ...state, fullBox: false };
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const userInfo = state.userInfo;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.slug === newItem.slug
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.cart.cartItems, { ...newItem, quantity: 1 }];

      if (userInfo?.email) {
        localStorage.setItem(
          `cartItems_${userInfo.email}`,
          JSON.stringify(cartItems)
        );
        window.dispatchEvent(new Event('storage'));
      }
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'SAVE_SHIPPING_ADDRESS': {
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    }
    case 'SAVE_PAYMENT_METHOD': {
      localStorage.setItem('paymentMethod', action.payload);
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    }
    case 'USER_SIGNIN':
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT': {
      const userInfo = state.userInfo;
      if (userInfo?.email) {
        localStorage.removeItem(`cartItems_${userInfo.email}`);
      }
      localStorage.removeItem('userInfo');
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {}, paymentMethod: '' },
      };
    }
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
