import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/core/styles'
import deepOrange from '@material-ui/core/colors/deepOrange'

const styles = theme => ({
  heroUnit: {
    backgroundColor: deepOrange[500]
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4
  }
})

function WelcomePage(props) {
  const {classes} = props

  return (
    <div className={classes.heroUnit}>
      <div className={classes.heroContent}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Welcome to the Joke Shop
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Come on in and find something that will make you chuckle and forget
          about your troubles for a while.
        </Typography>
        <div className={classes.heroButtons}>
          <Grid container spacing={16} justify="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/products"
              >
                Browse Products
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}

WelcomePage.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(WelcomePage)
