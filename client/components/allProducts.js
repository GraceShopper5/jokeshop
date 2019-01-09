import React, {Component} from 'react'
import {fetchProducts} from '../store'
import {connect} from 'react-redux'

class AllProducts extends Component {
  componentDidMount() {
    this.props.fetchProducts()
  }

  render() {
    return (
      <div>
        <ul>
          {this.props.products.map(product => (
            <li key={product.id}>
              <div>
                {product.name}
                <img src={product.imageUrl} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {products: state.product.products}
}

const mapDispatchToProps = dispatch => {
  return {
    fetchProducts: () => {
      dispatch(fetchProducts())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllProducts)
