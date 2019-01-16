import React, {Component} from 'react'
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
  Badge,
  Fab,
  Menu,
  MenuItem
} from '@material-ui/core'

import {withStyles} from '@material-ui/core/styles'
import InsertEmoticon from '@material-ui/icons/InsertEmoticon'
import ShoppingCart from '@material-ui/icons/ShoppingCart'
import AccountCircle from '@material-ui/icons/AccountCircle'

const styles = theme => ({
  appBar: {
    position: 'relative'
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  button: {
    margin: theme.spacing.unit,
    color: '#fff',
    backgroundColor: 'black'
  },
  badge: {
    top: 1,
    right: -15
  },
  grow: {
    margin: theme.spacing.unit,
    flexGrow: 1
  },
  typography: {
    margin: theme.spacing.unit
  },
  fab: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
})

const getUserCartItemSum = cartItems => {
  return cartItems.reduce((accum, item) => accum + item.OrderItem.quantity, 0)
}

class Navbar extends Component {
  state = {
    anchorEl: null
  }

  handleMenu = event => {
    this.setState({anchorEl: event.currentTarget})
  }

  handleClose = () => {
    this.setState({anchorEl: null})
  }

  render() {
    const {handleClick, isLoggedIn, classes, firstName, cartItems} = this.props
    const {anchorEl} = this.state
    const open = Boolean(anchorEl)
    return (
      <div>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <InsertEmoticon className={classes.icon} />
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              component={Link}
              to="/"
              className={classes.typography}
            >
              The Joke Shop
            </Typography>
            <Button className={classes.button} component={Link} to="/products">
              Products
            </Button>
            <Typography className={classes.grow} />
            {isLoggedIn ? (
              <div>
                {/* The navbar will show these links after you log in */}
                <Fab
                  variant="extended"
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  className={classes.fab}
                >
                  <AccountCircle className={classes.extendedIcon} />
                  {firstName}
                </Fab>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={this.handleClose}
                  >
                    My Account
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClick()
                      this.handleClose()
                    }}
                  >
                    Sign Out
                  </MenuItem>
                </Menu>
                {/* <Button
                  className={classes.button}
                  component={Link}
                  to="/profile"
                >
                  {firstName}
                </Button>
                <Button onClick={handleClick} className={classes.button}>
                  Logout
                </Button> */}
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
      </div>
    )
  }
}

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
