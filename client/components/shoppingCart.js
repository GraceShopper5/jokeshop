import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {purchaseCart} from '../store'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

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
  render() {
    // console.log('this.props.cart', this.props.cart)
    const {classes, cart, userId, purchaseCart: pc} = this.props
    return (
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
        <Button onClick={() => pc(userId)}>Buy Items</Button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {cart: state.shoppingCart.products, userId: state.user.id}
}

const mapDispatchToProps = dispatch => {
  return {
    purchaseCart: userId => {
      dispatch(purchaseCart(userId))
    }
  }
}

ShoppingCart.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ShoppingCart))
)
