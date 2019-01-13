import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_ORDER_HISTORY = 'GET_ORDER_HISTORY'
const CREATE_NEW_ORDER_FROM_CART = 'CREATE_NEW_ORDER_FROM_CART'

/**
 * INITIAL STATE
 */
const initialOrderHistory = []

/**
 * ACTION CREATORS
 */
const getOrderHistory = orderHistory => ({
  type: GET_ORDER_HISTORY,
  orderHistory
})
const createNewOrderFromCart = cart => ({
  type: CREATE_NEW_ORDER_FROM_CART,
  cart
})

/**
 * THUNK CREATORS
 */
export const fetchOrderHistory = userId => async dispatch => {
  try {
    if (userId) {
      const {data: orderHistory} = await axios.get(
        `/api/users/${userId}/order-history`
      )
      dispatch(getOrderHistory(orderHistory))
    }
  } catch (err) {
    console.error(err)
  }
}

// export const createNewOrderFromCart = (
//   productId,
//   quantity,
//   userId
// ) => async dispatch => {
//   try {
//     if (userId) {
//       const {data: cart} = await axios.put(
//         `/api/users/${userId}/order-history`,
//         {
//           productId,
//           quantity,
//         }
//       )
//       dispatch(getCart(cart))
//     } else {
//       const cartFromStorage = JSON.parse(localStorage.getItem('cart'))
//       const cart = cartFromStorage || {}
//       console.log('got cart from local storage', cart)
//       dispatch(getCart(cart))
//     }
//   } catch (err) {
//     console.error(err)
//   }
// }

/**
 * REDUCER
 */
export default function(state = initialOrderHistory, action) {
  switch (action.type) {
    case GET_ORDER_HISTORY:
      return action.orderHistory
    default:
      return state
  }
}
