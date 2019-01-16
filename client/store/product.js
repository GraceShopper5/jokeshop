import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_PRODUCTS = 'GET_PRODUCTS'
const GET_SINGLE_PRODUCT = 'GET_SINGLE_PRODUCT'
const GET_PRODUCT_REVIEWS = 'GET_PRODUCT_REVIEWS'
const ADD_REVIEW = 'ADD_REVIEW'

/**
 * INITIAL STATE
 */
const initialState = {products: [], selectedProduct: {}, reviews: []}

/**
 * ACTION CREATORS
 */
const getProducts = products => ({type: GET_PRODUCTS, products})
const getSingleProduct = product => ({type: GET_SINGLE_PRODUCT, product})
const getProductReviews = reviews => ({type: GET_PRODUCT_REVIEWS, reviews})
const addReview = review => ({type: ADD_REVIEW, review})
/**
 * THUNK CREATORS
 */
export const fetchProducts = () => async dispatch => {
  try {
    const {data: products} = await axios.get('/api/products')
    dispatch(getProducts(products))
  } catch (err) {
    console.error(err)
  }
}

export const fetchSingleProduct = productId => async dispatch => {
  try {
    const {data: product} = await axios.get(`/api/products/${productId}`)
    dispatch(getSingleProduct(product))
  } catch (err) {
    console.error(err)
  }
}

export const fetchProductReviews = productId => async dispatch => {
  try {
    const {data: reviews} = await axios.get(
      `/api/products/${productId}/reviews`
    )
    dispatch(getProductReviews(reviews))
  } catch (err) {
    console.error(err)
  }
}

export const submitReview = (productId, content) => async dispatch => {
  try {
    const {data: review} = await axios.post(
      `/api/products/${productId}/reviews`,
      {content}
    )
    dispatch(addReview(review))
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
    case GET_PRODUCT_REVIEWS: {
      const reviews = action.reviews
      return {...state, reviews}
    }
    case ADD_REVIEW: {
      const newReview = action.review
      const existingReviews = state.reviews || []
      return {
        ...state,
        reviews: [...existingReviews, newReview]
      }
    }
    default:
      return state
  }
}
