/* global describe beforeEach afterEach it */

import {expect} from 'chai'
import {fetchCart, addToCart} from './shoppingCart'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import history from '../history'

const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)

describe('thunk creators', () => {
  let store
  let mockAxios
  let fakeUser
  let fakeCart
  let fakeProduct
  let expectedCart

  const initialState = {cart: []}

  beforeEach(() => {
    mockAxios = new MockAdapter(axios)
    store = mockStore(initialState)
    fakeUser = {id: 1}
    fakeCart = {
      id: 1,
      isPurchased: false,
      purchaseDate: null,
      userId: 1,
      products: [
        {
          id: 2,
          name: 'Medieval Joke',
          currentPrice: 300,
          description: 'A joke from the middle ages.',
          imageUrl: 'default.jpeg',
          createdAt: '2019-01-09T23:24:57.027Z',
          updatedAt: '2019-01-09T23:24:57.027Z',
          OrderItem: {
            pricePaid: null,
            quantity: 15,
            createdAt: '2019-01-10T02:28:17.143Z',
            updatedAt: '2019-01-10T16:04:34.574Z',
            orderId: 1,
            productId: 2
          }
        },
        {
          id: 3,
          name: 'Post-modern Joke',
          currentPrice: 200,
          description: 'A joke from the least sensical age.',
          imageUrl: 'default.jpeg',
          createdAt: '2019-01-09T23:24:57.028Z',
          updatedAt: '2019-01-09T23:24:57.028Z',
          OrderItem: {
            pricePaid: null,
            quantity: 7,
            createdAt: '2019-01-10T02:30:00.837Z',
            updatedAt: '2019-01-10T07:10:01.792Z',
            orderId: 1,
            productId: 3
          }
        },
        {
          id: 1,
          name: 'Rennaisance Joke',
          currentPrice: 200,
          description: 'A joke from the funniest age.',
          imageUrl: 'default.jpeg',
          createdAt: '2019-01-09T23:24:57.028Z',
          updatedAt: '2019-01-09T23:24:57.028Z',
          OrderItem: {
            pricePaid: null,
            quantity: 7,
            createdAt: '2019-01-10T07:10:55.499Z',
            updatedAt: '2019-01-10T07:11:23.724Z',
            orderId: 1,
            productId: 1
          }
        }
      ]
    }
    fakeProduct = {
      id: 1,
      name: 'Rennaisance Joke',
      currentPrice: 200,
      description: 'A joke from the funniest age.',
      imageUrl: 'default.jpeg',
      createdAt: '2019-01-09T23:24:57.028Z',
      updatedAt: '2019-01-09T23:24:57.028Z'
    }
    expectedCart = {
      id: 1,
      isPurchased: false,
      purchaseDate: null,
      userId: 1,
      products: [
        {
          id: 2,
          name: 'Medieval Joke',
          currentPrice: 300,
          description: 'A joke from the middle ages.',
          imageUrl: 'default.jpeg',
          createdAt: '2019-01-09T23:24:57.027Z',
          updatedAt: '2019-01-09T23:24:57.027Z',
          OrderItem: {
            pricePaid: null,
            quantity: 15,
            createdAt: '2019-01-10T02:28:17.143Z',
            updatedAt: '2019-01-10T16:04:34.574Z',
            orderId: 1,
            productId: 2
          }
        },
        {
          id: 3,
          name: 'Post-modern Joke',
          currentPrice: 200,
          description: 'A joke from the least sensical age.',
          imageUrl: 'default.jpeg',
          createdAt: '2019-01-09T23:24:57.028Z',
          updatedAt: '2019-01-09T23:24:57.028Z',
          OrderItem: {
            pricePaid: null,
            quantity: 7,
            createdAt: '2019-01-10T02:30:00.837Z',
            updatedAt: '2019-01-10T07:10:01.792Z',
            orderId: 1,
            productId: 3
          }
        },
        {
          id: 1,
          name: 'Rennaisance Joke',
          currentPrice: 200,
          description: 'A joke from the funniest age.',
          imageUrl: 'default.jpeg',
          createdAt: '2019-01-09T23:24:57.028Z',
          updatedAt: '2019-01-09T23:24:57.028Z',
          OrderItem: {
            pricePaid: null,
            quantity: 200,
            createdAt: '2019-01-10T07:10:55.499Z',
            updatedAt: '2019-01-10T07:11:23.724Z',
            orderId: 1,
            productId: 1
          }
        }
      ]
    }
  })

  afterEach(() => {
    mockAxios.restore()
    store.clearActions()
  })

  describe('getCart', () => {
    it('eventually dispatches the GET_CART action', async () => {
      mockAxios
        .onGet(`/api/users/${fakeUser.id}/shopping-cart`)
        .replyOnce(200, fakeCart)
      store.dispatch(fetchCart)
      const actions = store.getActions()
      console.log('WHAT ARE THE ACTIONS', actions)
      expect(actions[0].type).to.be.equal('GET_CART')
      expect(actions[0].cart).to.be.deep.equal(fakeCart)
    })
  })

  describe('addToCart', () => {
    it('AddToCart: eventually dispatches the GET_CART action', async () => {
      mockAxios
        .onPut(`/api/users/${fakeUser.id}/shopping-cart`)
        .replyOnce(200, {product: fakeProduct, quantity: 200, overwrite: true})
      await store.dispatch((product, quantity, overwrite, userId) =>
        addToCart(product, quantity, overwrite, userId)
      )
      const actions = store.getActions()
      expect(actions[0].type).to.be.equal('GET_CART')
      expect(actions[0].cart).to.be.deep.equal(expectedCart)
    })
  })
})
