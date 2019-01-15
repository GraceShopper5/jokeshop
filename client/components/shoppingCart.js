import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {purchaseCart} from '../store'
import {addToCart} from '../store'
import history from '../history'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import axios from 'axios'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
})

class ShoppingCart extends Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleAddToCart = this.handleAddToCart.bind(this)
  }

  getUserCartItemSum(cartItems) {
    return cartItems.reduce(
      (accum, item) => accum + item.currentPrice * item.OrderItem.quantity,
      0
    )
  }

  buildOptions(n) {
    const arr = []
    for (let i = 1; i <= n; i++) {
      arr.push(
        <option key={i} value={i}>
          {i}
        </option>
      )
    }
    return arr
  }

  handleAddToCart(event, product) {
    event.preventDefault()
    this.props.addToCart(product, event.target.value, true, this.props.userId)
  }

  async handleSubmit(event) {
    event.preventDefault()
    if (this.props.cart.length === 0) {
      alert('You have no items in your shopping cart!')
      return
    }
    const {streetAddress, city, state, zipCode} = event.target
    if (!streetAddress.value || !city.value || !state.value || !zipCode.value) {
      alert('Please fill in all fields!')
      return
    }
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
    history.push('/confirmation')
  }

  render() {
    const {classes, cart} = this.props
    return (
      <div>
        {cart && cart.length ? (
          <div className="order-history">
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Shopping Cart</TableCell>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart
                    ? cart.map(product => (
                        <TableRow key={product.id}>
                          <TableCell component="th" scope="row">
                            <img
                              src={product.imageUrl}
                              height="100"
                              width="auto"
                            />
                          </TableCell>
                          <TableCell align="right">{product.name}</TableCell>
                          <TableCell align="right">
                            ${(product.currentPrice / 100).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            <select
                              defaultValue={product.OrderItem.quantity}
                              onChange={event => {
                                this.handleAddToCart(event, product)
                              }}
                            >
                              {product.OrderItem.quantity > 10
                                ? this.buildOptions(product.OrderItem.quantity)
                                : this.buildOptions(10)}
                            </select>
                          </TableCell>
                          <TableCell align="right">
                            ${(
                              product.currentPrice *
                              product.OrderItem.quantity /
                              100
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                  <TableRow>
                    <TableCell />
                    <TableCell align="right" />
                    <TableCell align="right" />
                    <TableCell align="right" />
                    <TableCell align="right">
                      <strong>
                        ${this.props.cart
                          ? (
                              this.getUserCartItemSum(this.props.cart) / 100
                            ).toFixed(2)
                          : 0.0}
                      </strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>

            <div className="flex">
              <form onSubmit={this.handleSubmit} id="checkout">
                <h3>Checkout</h3>
                <label>Street Address</label>
                <input
                  name="streetAddress"
                  type="text"
                  placeholder="5 Hanover Square"
                />
                <label>City</label>
                <input name="city" type="text" placeholder="New York" />
                <label>State</label>
                <input name="state" type="text" placeholder="NY" />
                <label>ZIP Code</label>
                <input name="zipCode" type="text" placeholder="10004" />
                <br />
                <center>
                  <button type="submit">Buy Items</button>
                </center>
              </form>
            </div>
          </div>
        ) : (
          <Typography>Your Cart Is Empty. Go Pick Out Some Jokes!</Typography>
        )}
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
    },
    addToCart: (productId, quantity, overwrite, userId) =>
      dispatch(addToCart(productId, quantity, overwrite, userId))
  }
}

ShoppingCart.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ShoppingCart))
)
