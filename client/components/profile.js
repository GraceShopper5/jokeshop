import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

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
        <strong>
          {firstName} {lastName}'s Orders
        </strong>{' '}
        {email}
        {orderHistory.map(order => (
          <Paper className={classes.root} key={order.id}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>
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
                      ${(product.currentPrice / 100).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {product.OrderItem.quantity}
                    </TableCell>
                    <TableCell align="right">
                      ${(
                        product.currentPrice *
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
                      ${order
                        ? (this.getOrderSubtotal(order.products) / 100).toFixed(
                            2
                          )
                        : 0.0}
                    </strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        ))}
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
