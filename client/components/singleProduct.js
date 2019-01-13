import React, {Component} from 'react'
import {fetchSingleProduct, addToCart} from '../store'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import OutlinedInput from '@material-ui/core/OutlinedInput'

import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  card: {
    height: '50%',
    maxWidth: '50%',
    display: 'flex',
    flexDirection: 'column',
    justify: 'center'
  },
  cardMedia: {
    paddingTop: '56.25%' // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  }
})

class SingleProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {quantity: 1, showReviewForm: false}

    this.handleAddToCart = this.handleAddToCart.bind(this)
    this.wasItemPurchased = this.wasItemPurchased.bind(this)
    this.toggleReviewForm = this.toggleReviewForm.bind(this)
  }
  componentDidMount() {
    this.props.fetchSingleProduct(this.props.match.params.productId)
  }

  handleChange = name => event => {
    this.setState({[name]: event.target.value})
  }
  handleAddToCart() {
    const {userId, product, addToCart: atc} = this.props
    if (userId) {
      atc(product.id, this.state.quantity, false, userId)
    } else {
      const cartFromStorage = JSON.parse(localStorage.getItem('cart'))
      const cart = cartFromStorage || {products: []}
      const cartItem = cart.products.filter(item => item.id === product.id)
      const restOfCart = cart.products.filter(item => item.id !== product.id)
      if (cartItem.length) {
        cartItem[0].OrderItem.quantity += Number(this.state.quantity)
        restOfCart.push(cartItem[0])
      } else {
        const newCartItem = {
          ...product,
          OrderItem: {quantity: Number(this.state.quantity)}
        }
        restOfCart.push(newCartItem)
      }
      cart.products = restOfCart

      localStorage.setItem('cart', JSON.stringify(cart))
      atc(product.id, this.state.quantity, false, userId)
    }
  }

  wasItemPurchased() {
    let itemPurchased = false
    this.props.orderHistory.forEach(order => {
      order.products.forEach(product => {
        if (product.id === this.props.product.id) {
          itemPurchased = true
        }
      })
    })
    return itemPurchased
  }
  toggleReviewForm() {
    this.setState(prevState => {
      return {
        showReviewForm: !prevState.showReviewForm
      }
    })
  }

  render() {
    const {classes, product} = this.props
    return (
      <div>
        <Grid container justify="center">
          <Card className={classes.card}>
            <CardMedia
              className={classes.cardMedia}
              image={`../../${product.imageUrl}`}
              title={product.name}
            />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                {product.name}
              </Typography>
              <Typography>{product.description}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                Purchase
              </Button>
              <Button
                size="small"
                color="primary"
                onClick={this.handleAddToCart}
              >
                Add to Cart
              </Button>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-quantity">Quantity</InputLabel>
                <Select
                  native
                  value={this.state.quantity}
                  onChange={this.handleChange('quantity')}
                  input={
                    <OutlinedInput
                      name="quantity"
                      labelWidth={5}
                      id="outlined-quantity"
                    />
                  }
                >
                  <option value="" />
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </Select>
              </FormControl>
            </CardActions>
          </Card>
        </Grid>

        {this.props.orderHistory && this.props.userId ? (
          <Button
            disabled={!this.wasItemPurchased() || this.state.showReviewForm}
            onClick={this.toggleReviewForm}
          >
            Write a Review
          </Button>
        ) : null}
        {this.state.showReviewForm ? (
          <div>
            <h1>hi</h1>
            <Button onClick={this.toggleReviewForm}>Cancel</Button>
          </div>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    product: state.product.selectedProduct,
    userId: state.user.id,
    orderHistory: state.orderHistory
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchSingleProduct: productId => dispatch(fetchSingleProduct(productId)),
    addToCart: (product, quantity, overwrite, userId) =>
      dispatch(addToCart(product, quantity, overwrite, userId))
  }
}

SingleProduct.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(SingleProduct)
  )
)
