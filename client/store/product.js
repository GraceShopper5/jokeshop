import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_PRODUCTS = 'GET_PRODUCTS'
const GET_SINGLE_PRODUCT = 'GET_SINGLE_PRODUCT'
// const REMOVE_USER = 'REMOVE_USER'

/**
 * INITIAL STATE
 */
const initialState = {products: [], selectedProduct: {}}

/**
 * ACTION CREATORS
 */
const getProducts = products => ({type: GET_PRODUCTS, products})
const getSingleProduct = product => ({type: GET_SINGLE_PRODUCT, product})
/**
 * THUNK CREATORS
 */
export const fetchProducts = () => async dispatch => {
  try {
    console.log('hiiii')
    const {data: jokes} = await axios.get('/api/jokes')
    dispatch(getProducts(jokes))
  } catch (err) {
    console.error(err)
  }
}

export const fetchSingleProduct = jokeId => async dispatch => {
  try {
    const {data: joke} = await axios.get(`/api/jokes/${jokeId}`)
    dispatch(getSingleProduct(joke))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCTS:
      return {...state, products: action.products}
    case GET_SINGLE_PRODUCT:
      return {...state, selectedProduct: action.product}
    default:
      return state
  }
}
