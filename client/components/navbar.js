import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {AppBar, Typography, Button, Toolbar} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'
import {InsertEmoticon} from '@material-ui/icons'

const styles = theme => ({
  appBar: {
    position: 'relative'
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  button: {
    margin: theme.spacing.unit
  }
})

const Navbar = ({handleClick, isLoggedIn, classes}) => (
  <div>
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <InsertEmoticon className={classes.icon} />
        <Typography variant="h6" color="inherit" noWrap>
          Ye Olde Joke Shop
        </Typography>
        {isLoggedIn ? (
          <div>
            {/* The navbar will show these links after you log in */}
            <Button onClick={handleClick} className={classes.button}>
              Logout
            </Button>
          </div>
        ) : (
          <div>
            {/* The navbar will show these links before you log in */}
            <Button className={classes.button}>Login</Button>
            <Button className={classes.button}>Sign Up </Button>
          </div>
        )}
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
    isLoggedIn: !!state.user.id
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

export default withStyles(styles)(connect(mapState, mapDispatch)(Navbar))
