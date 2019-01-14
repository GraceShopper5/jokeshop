import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { purchaseCart } from '../store'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Card from '@material-ui/core/Card'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { Elements, StripeProvider } from 'react-stripe-elements'
import CheckoutForm from './CheckoutForm'

// import InboxIcon from '@material-ui/icons/Inbox';
// import DraftsIcon from '@material-ui/icons/Drafts';
import { OrderItem } from './index'
import { isNullOrUndefined } from 'util'

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
    const { classes, cart, userId, purchaseCart: pc } = this.props
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
                />
              ))
              : null}
          </tbody>
        </table>
        {/* <Button onClick={() => pc(userId)}>Buy Items</Button> */}
        <StripeProvider apiKey="pk_test_TYooMQauvdEDq54NiTphI7jx">
          {/* <StripeProvider apiKey="pk_test_sgAizXIzyMiJy3bIT2C5N5D6"> */}
          <div className="example">
            <h1>Billing</h1>
            <Elements>
              <CheckoutForm />
            </Elements>
          </div>
        </StripeProvider>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { cart: state.shoppingCart.products, userId: state.user.id }
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
