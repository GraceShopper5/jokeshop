import axios from 'axios'
// import history from '../history'

/**
 * ACTION TYPES
 */
const GET_CART = 'GET_CART'
const CLEAR_CART = 'CLEAR_CART'

/**
 * INITIAL STATE
 */
const initialCart = []

/**
 * ACTION CREATORS
 */
const getCart = cart => ({type: GET_CART, cart})
const clearCart = () => ({type: CLEAR_CART})

// helper functions for thunk creators
const getProductFromDB = async item => {
  const {data: dbProduct} = await axios.get(`/api/products/${item.productId}`)
  dbProduct.OrderItem = {pricePaid: null, quantity: item.quantity}
  return dbProduct
}
const getCartProducts = async cart => {
  const promisesForProducts = cart.map(getProductFromDB)
  const cartProducts = await Promise.all(promisesForProducts)
  return cartProducts
}

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
      const cart = cartFromStorage || []
      console.log('got cart from local storage', cart)

      const cartProducts = await getCartProducts(cart)
      console.log(cartProducts)

      const cartForStore = {products: [...cartProducts]}
      dispatch(getCart(cartForStore))
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
      const cart = cartFromStorage || []
      const cartItem = cart.filter(item => item.productId === product.id)
      const restOfCart = cart.filter(item => item.productId !== product.id)
      if (cartItem.length) {
        if (overwrite) {
          cartItem[0].quantity = Number(quantity)
        } else {
          cartItem[0].quantity += Number(quantity)
        }
        restOfCart.push(cartItem[0])
      } else {
        const newCartItem = {
          productId: product.id,
          quantity: Number(quantity)
        }
        restOfCart.push(newCartItem)
      }

      // const getProductFromDB = async item => {
      //   const {data: dbProduct} = await axios.get(
      //     `/api/products/${item.productId}`
      //   )
      //   dbProduct.OrderItem = {pricePaid: null, quantity: item.quantity}
      //   return dbProduct
      // }
      // const promisesForProducts = restOfCart.map(getProductFromDB)
      // const cartProducts = await Promise.all(promisesForProducts)
      const cartProducts = await getCartProducts(restOfCart)
      console.log(cartProducts)

      const cartForStore = {products: [...cartProducts]}
      const cartForLocal = [...restOfCart]
      localStorage.setItem('cart', JSON.stringify(cartForLocal))
      dispatch(getCart(cartForStore))
    }
  } catch (err) {
    console.error(err)
  }
}

export const purchaseCart = userId => async dispatch => {
  if (userId) {
    const newEmptyCart = await axios.put(`/api/users/${userId}/shopping-cart`, {
      purchase: true
    })
    dispatch(getCart(newEmptyCart))
  }
}

/**
 * REDUCER
 */
export default function(state = initialCart, action) {
  switch (action.type) {
    case GET_CART:
      return action.cart
    case CLEAR_CART:
      return []
    default:
      return state
  }
}
