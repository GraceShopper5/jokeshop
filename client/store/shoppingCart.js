import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_CART = 'GET_CART'

/**
 * INITIAL STATE
 */
const initialCart = []

/**
 * ACTION CREATORS
 */
const getCart = cart => ({type: GET_CART, cart})

/**
 * THUNK CREATORS
 */
export const fetchCart = userId => async dispatch => {
  try {
    if (userId) {
      const {data: cart} = await axios.get(`/api/users/${userId}/shopping-cart`)
      dispatch(getCart(cart))
    } else {
      const cartFromStorage = JSON.parse(localStorage.getItem('cart'))
      const cart = cartFromStorage || {}
      console.log('got cart from local storage', cart)
      dispatch(getCart(cart))
    }
  } catch (err) {
    console.error(err)
  }
}

export const addToCart = (
  product,
  quantity,
  overwrite,
  userId
) => async dispatch => {
  try {
    if (userId) {
      const {data: cart} = await axios.put(
        `/api/users/${userId}/shopping-cart`,
        {
          productId: product.id,
          quantity,
          overwrite
        }
      )
      dispatch(getCart(cart))
    } else {
      const cartFromStorage = JSON.parse(localStorage.getItem('cart'))
      const cart = cartFromStorage || {products: []}
      const cartItem = cart.products.filter(item => item.id === product.id)
      const restOfCart = cart.products.filter(item => item.id !== product.id)
      if (cartItem.length) {
        if (overwrite) {
          cartItem[0].OrderItem.quantity = Number(quantity)
        } else {
          cartItem[0].OrderItem.quantity += Number(quantity)
        }
        restOfCart.push(cartItem[0])
      } else {
        const newCartItem = {
          ...product,
          OrderItem: {quantity: Number(quantity)}
        }
        restOfCart.push(newCartItem)
      }
      cart.products = restOfCart

      localStorage.setItem('cart', JSON.stringify(cart))
      dispatch(getCart(cart))
    }
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialCart, action) {
  switch (action.type) {
    case GET_CART:
      return action.cart
    default:
      return state
  }
}
