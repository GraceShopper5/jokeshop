import axios from 'axios'
import history from '../history'
import {fetchCart} from './shoppingCart'
import {fetchOrderHistory} from './orderHistory'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    const user = res.data || defaultUser
    dispatch(getUser(user))
    dispatch(fetchCart(user.id))
    dispatch(fetchOrderHistory(user.id))
  } catch (err) {
    console.error(err)
  }
}

// export const auth = (email, password, method) => async dispatch => {
export const auth = data => async dispatch => {
  let res
  const {firstName, lastName, email, password, formName: method} = data
  try {
    res = await axios.post(`/auth/${method}`, {
      firstName,
      lastName,
      email,
      password
    })
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }

  try {
    dispatch(getUser(res.data))
    dispatch(fetchCart(res.data.id))
    history.push('/')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    //clear the cart in local storage when you log out:
    localStorage.setItem('cart', JSON.stringify({products: []}))
    dispatch(fetchCart(null))
    history.push('/')
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
