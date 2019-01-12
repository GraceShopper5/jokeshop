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
    const {data: cart} = await axios.get(`/api/users/${userId}/shopping-cart`)
    dispatch(getCart(cart))
  } catch (err) {
    console.error(err)
  }
}

export const addToCart = (
  productId,
  quantity,
  overwrite,
  userId
) => async dispatch => {
  try {
    const {data: cart} = await axios.put(`/api/users/${userId}/shopping-cart`, {
      productId,
      quantity,
      overwrite
    })
    dispatch(getCart(cart))
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
