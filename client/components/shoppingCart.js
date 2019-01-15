import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {purchaseCart} from '../store'
import {addToCart} from '../store'
import Button from '@material-ui/core/Button'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

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
    const {classes, cart} = this.props
    return (
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
                        <img src={product.imageUrl} height="100" width="auto" />
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
            </TableBody>
          </Table>
        </Paper>

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
