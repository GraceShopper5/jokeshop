import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {purchaseCart} from '../store'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import CheckoutForm from './checkoutForm'

import axios from 'axios'

import {OrderItem} from './index'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    paddingTop: '56.25%' // 16:9
  },
  cardContent: {
    flexGrow: 1
  }
})

class ShoppingCart extends Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(event) {
    event.preventDefault()
    const {streetAddress, city, state, zipCode} = event.target
    if (this.props.userId) {
      const {data: address} = await axios.post(
        `api/users/${this.props.userId}/addresses`,
        {
          streetAddress: streetAddress.value,
          city: city.value,
          state: state.value,
          zipCode: zipCode.value
        }
      )
      this.props.purchaseCart(this.props.userId, address.id)
    } else {
      const {data: guestAddress} = await axios.post('api/addresses', {
        streetAddress: streetAddress.value,
        city: city.value,
        state: state.value,
        zipCode: zipCode.value
      })
      this.props.purchaseCart(null, guestAddress.id, this.props.cart)
    }
  }

  render() {
    const {classes, cart, userId, purchaseCart: pc} = this.props
    return (
      <div>
        <div className={classes.root} id="shopping-cart">
          <table>
            <tbody>
              <tr>
                <td>Image</td>
                <td>Name</td>
                <td>Price</td>
                <td>Quantity</td>
                <td>Total Price</td>
              </tr>
              {cart
                ? cart.map(product => (
                    <OrderItem
                      userId={userId}
                      key={product.id}
                      product={product}
                      isPurchased={false}
                    />
                  ))
                : null}
            </tbody>
          </table>
          {/* <Button onClick={() => pc(userId)}>Buy Items</Button> */}
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <h2>Checkout</h2>
            <label>Street Address</label>
            <input name="streetAddress" type="text" />
            <label>City</label>
            <input name="city" type="text" />
            <label>State</label>
            <input name="state" type="text" />
            <label>ZIP Code</label>
            <input name="zipCode" type="text" />
            <button type="submit">Buy Items</button>
          </form>
        </div>

        <CheckoutForm
          name="Checkout"
          description="Please enter your credit card information"
          amount={1}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {cart: state.shoppingCart.products, userId: state.user.id}
}

const mapDispatchToProps = dispatch => {
  return {
    purchaseCart: (userId, addressId, cart) => {
      dispatch(purchaseCart(userId, addressId, cart))
    }
  }
}

ShoppingCart.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ShoppingCart))
)
