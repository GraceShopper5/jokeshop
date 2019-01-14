import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import {OrderItem} from './index'

class OrderHistory extends Component {
  render() {
    const {orderHistory, userId} = this.props
    return (
      <div>
        {orderHistory.map(order => (
          <div key={order.id}>
            <div>Order Placed: {new Date(order.purchaseDate).toLocaleString(navigator.language, {month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'})}</div>
            <table>
              <tbody>
                <tr>
                  <th />
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                </tr>
                {order.products.map(product => (
                  <OrderItem
                    userId={userId}
                    key={product.id}
                    product={product}
                    isPurchased={true}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {orderHistory: state.orderHistory, userId: state.user.id}
}

export default withRouter(connect(mapStateToProps)(OrderHistory))
