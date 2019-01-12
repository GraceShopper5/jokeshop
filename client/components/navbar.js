import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import {logout} from '../store'
import {
  AppBar,
  Typography,
  Button,
  Toolbar,
  IconButton,
  Badge
} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'
import {InsertEmoticon, ShoppingCart} from '@material-ui/icons'

const styles = theme => ({
  appBar: {
    position: 'relative'
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  button: {
    margin: theme.spacing.unit
  },
  badge: {
    top: 1,
    right: -15
    // The border color match the background color.
    // border: `2px solid ${
    //   theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]
    // }`,
  }
})

const getUserCartItemSum = cartItems => {
  return cartItems.reduce((accum, item) => accum + item.OrderItem.quantity, 0)
}
// const getGuestCartItemSum = () => {
//   const cartFromStorage = JSON.parse(localStorage.getItem('cart'))
//   const cart = cartFromStorage || {}
//   let total = 0
//   for (let productId in cart) {
//     if (cart.hasOwnProperty(productId)) {
//       total += cart[productId].quantity
//     }
//   }
//   return total
// }

const Navbar = ({handleClick, isLoggedIn, classes, firstName, cartItems}) => (
  <div>
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Button
          className={classes.button}
          component={Link}
          to="/"
          color="secondary"
        >
          <InsertEmoticon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Ye Olde Joke Shop
          </Typography>
        </Button>
        {isLoggedIn ? (
          <div>
            {/* The navbar will show these links after you log in */}
            <Button className={classes.button} component={Link} to="/profile">
              {firstName}
            </Button>
            <Button onClick={handleClick} className={classes.button}>
              Logout
            </Button>
          </div>
        ) : (
          <div>
            {/* The navbar will show these links before you log in */}
            <Button className={classes.button} component={Link} to="/login">
              Login
            </Button>
            <Button className={classes.button} component={Link} to="signup">
              Sign Up{' '}
            </Button>
            {/* <Badge
              color="secondary"
              badgeContent={getGuestCartItemSum()}
              invisible={false}
              classes={{badge: classes.badge}}
            >
              <IconButton color="inherit" component={Link} to="/shopping-cart">
                <ShoppingCart />
              </IconButton>
            </Badge> */}
          </div>
        )}
        <Badge
          color="secondary"
          badgeContent={cartItems ? getUserCartItemSum(cartItems) : 0}
          invisible={false}
          classes={{badge: classes.badge}}
        >
          <IconButton color="inherit" component={Link} to="/shopping-cart">
            <ShoppingCart />
          </IconButton>
        </Badge>
      </Toolbar>
    </AppBar>

    <nav />
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    firstName: state.user.firstName,
    cartItems: state.shoppingCart.products
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}
/**
 * PROP TYPES
 */

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}

export default withRouter(
  connect(mapState, mapDispatch)(withStyles(styles)(Navbar))
)
