import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {withStyles} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  },
  paper: {
    margin: theme.spacing.unit * 2
  },
  typography: {
    margin: theme.spacing.unit
  }
})

class Profile extends Component {
  getOrderSubtotal(orderItems) {
    return orderItems.reduce(
      (accum, item) =>
        accum + item.OrderItem.pricePaid * item.OrderItem.quantity,
      0
    )
  }

  render() {
    const {orderHistory, classes, firstName, lastName, email} = this.props
    return (
      <div className="order-history">
        <Paper className={classes.paper}>
          <Typography
            variant="h2"
            component="h2"
            className={classes.typography}
          >
            Hi {firstName}!
          </Typography>
        </Paper>
        <Paper className={classes.paper}>
          <Typography
            variant="h4"
            component="h4"
            className={classes.typography}
          >
            Your Info:
          </Typography>
          <Typography className={classes.typography}>
            First Name: {firstName}
          </Typography>
          <Typography className={classes.typography}>
            Last Name: {lastName}
          </Typography>
          <Typography className={classes.typography}>
            Email Address: {email}
          </Typography>
        </Paper>
        <Paper className={classes.paper}>
          <Typography
            variant="h4"
            component="h4"
            className={classes.typography}
          >
            Your Addresses:
          </Typography>
        </Paper>
        <Paper className={classes.paper}>
          <Typography
            variant="h4"
            component="h4"
            className={classes.typography}
          >
            Your Order History:
          </Typography>
          {orderHistory.map(order => (
            <Paper className={classes.root} key={order.id}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>
                        Order Placed:{' '}
                        {new Date(order.purchaseDate).toLocaleString(
                          navigator.language,
                          {
                            month: '2-digit',
                            day: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )}
                      </strong>
                    </TableCell>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell component="th" scope="row">
                        <img src={product.imageUrl} height="100" width="auto" />
                      </TableCell>
                      <TableCell align="right">{product.name}</TableCell>
                      <TableCell align="right">
                        $ {(product.OrderItem.pricePaid / 100).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {product.OrderItem.quantity}
                      </TableCell>
                      <TableCell align="right">
                        ${' '}
                        {(
                          product.OrderItem.pricePaid *
                          product.OrderItem.quantity /
                          100
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell />
                    <TableCell align="right" />
                    <TableCell align="right" />
                    <TableCell align="right" />
                    <TableCell align="right">
                      <strong>
                        Order Total: ${' '}
                        {order
                          ? (
                              this.getOrderSubtotal(order.products) / 100
                            ).toFixed(2)
                          : 0.0}
                      </strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          ))}
        </Paper>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    orderHistory: state.orderHistory,
    userId: state.user.id,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    email: state.user.email
  }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Profile)))
