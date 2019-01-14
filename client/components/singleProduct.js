import React, {Component} from 'react'
import {
  fetchSingleProduct,
  addToCart,
  fetchProductReviews,
  submitReview
} from '../store'
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
import ReviewForm from './reviewForm'

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
    this.handleReviewSubmission = this.handleReviewSubmission.bind(this)
    this.wasReviewWritten = this.wasReviewWritten.bind(this)
  }
  componentDidMount() {
    this.props.fetchSingleProduct(this.props.match.params.productId)
    this.props.fetchProductReviews(this.props.match.params.productId)
  }

  handleChange = name => event => {
    this.setState({[name]: event.target.value})
  }
  handleAddToCart() {
    const {userId, product, addToCart: atc} = this.props
    atc(product, this.state.quantity, false, userId)
  }

  wasItemPurchased() {
    // using nested loop rather than nested forEach in order to be able to break out early if found
    for (let order of this.props.orderHistory) {
      for (let product of order.products) {
        if (product.id === this.props.product.id) {
          return true
        }
      }
    }
    return false
  }

  wasReviewWritten() {
    const {product, userId} = this.props
    if (product && product.reviews) {
      for (let review of product.reviews) {
        if (review.Review.userId === userId) {
          return true
        }
      }
      return false
    }
  }

  toggleReviewForm() {
    this.setState(prevState => {
      return {
        showReviewForm: !prevState.showReviewForm
      }
    })
  }
  handleReviewSubmission(reviewContent) {
    this.props.submitReview(this.props.product.id, reviewContent)
  }

  render() {
    const {classes, product, userId, orderHistory} = this.props
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

        {orderHistory && userId ? (
          <Button
            disabled={
              !this.wasItemPurchased() ||
              this.wasReviewWritten() ||
              this.state.showReviewForm
            }
            onClick={this.toggleReviewForm}
          >
            Write a Review
          </Button>
        ) : null}
        {this.state.showReviewForm ? (
          <ReviewForm
            toggleReviewForm={this.toggleReviewForm}
            handleReviewSubmission={this.handleReviewSubmission}
          />
        ) : null}
        <Typography>Reviews</Typography>
        {product.reviews && product.reviews.length ? (
          product.reviews.map(review => (
            <li key={`${review.Review.userId}-${review.Review.productId}`}>
              {review.Review.content} by {review.firstName}
            </li>
          ))
        ) : (
          <Typography>No reviews yet!</Typography>
        )}
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
    fetchProductReviews: productId => dispatch(fetchProductReviews(productId)),
    addToCart: (product, quantity, overwrite, userId) =>
      dispatch(addToCart(product, quantity, overwrite, userId)),
    submitReview: (productId, content) =>
      dispatch(submitReview(productId, content))
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
