import axios from 'axios'
// import history from '../history'

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

const updateLocalCart = (localCart, productId, quantity, overwrite) => {
  const cartItem = localCart.find(item => item.productId === productId)
  const restOfCart = localCart.filter(item => item.productId !== productId)
  if (cartItem) {
    if (overwrite) {
      cartItem.quantity = Number(quantity)
    } else {
      cartItem.quantity += Number(quantity)
    }
    restOfCart.push(cartItem)
  } else {
    const newCartItem = {
      productId,
      quantity: Number(quantity)
    }
    restOfCart.push(newCartItem)
  }
  return restOfCart
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

      const cartProducts = await getCartProducts(cart)

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
      const updatedCart = updateLocalCart(cart, product.id, quantity, overwrite)
      const cartProducts = await getCartProducts(updatedCart)

      const cartForStore = {products: [...cartProducts]}
      const cartForLocal = [...updatedCart]
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
    default:
      return state
  }
}
