import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {addToCart} from '../store'
import PropTypes from 'prop-types'

const mdp = dispatch => ({
  addToCart: (productId, quantity, overwrite, userId) =>
    dispatch(addToCart(productId, quantity, overwrite, userId))
})

class OrderItem extends Component {
  constructor() {
    super()
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

  handleAddToCart(event) {
    // console.log('productid', this.props.product.id)
    // console.log('quantity', event.target.value)
    event.preventDefault()
    this.props.addToCart(
      this.props.product,
      event.target.value,
      true,
      this.props.userId
    )
  }

  render() {
    const {imageUrl, name, currentPrice, OrderItem} = this.props.product
    return (
      <tr>
        <td>
          <img src={imageUrl} width="120" height="120" />
        </td>
        <td>{name}</td>
        <td>{currentPrice}</td>
        <td>
          <select
            defaultValue={OrderItem.quantity}
            onChange={this.handleAddToCart}
          >
            {this.buildOptions(10)}
          </select>
        </td>
        <td>{currentPrice * OrderItem.quantity}</td>
      </tr>
    )
  }
}

OrderItem.propTypes = {
  // classes: PropTypes.object.isRequired
}

export default withRouter(connect(null, mdp)(OrderItem))
