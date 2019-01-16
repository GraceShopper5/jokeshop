import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 10,
    marginBottom: theme.spacing.unit
  }
})

function Footer(props) {
  const {classes} = props

  return (
    <footer className={classes.footer}>
      <Typography variant="h6" align="center" gutterBottom>
        Built by Alex Kramer, Michael Leung, Mitchell Sam, and Zach Rachlin
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        Check out the project on{' '}
        <a href="https://github.com/GraceShopper5/jokeshop">Github</a>
      </Typography>
    </footer>
  )
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Footer)
