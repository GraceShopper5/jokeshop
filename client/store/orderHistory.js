import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_ORDER_HISTORY = 'GET_ORDER_HISTORY'

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
    } else {
      dispatch(getOrderHistory([]))
    }
  } catch (err) {
    console.error(err)
  }
}

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
