import React, {Component} from 'react'
import {fetchSingleProduct, addToCart} from '../store'
import {connect} from 'react-redux'
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
    this.state = {quantity: ''}
    this.handleAddToCart = this.handleAddToCart.bind(this)
  }
  componentDidMount() {
    this.props.fetchSingleProduct(this.props.match.params.productId)
  }
  handleChange = name => event => {
    this.setState({[name]: event.target.value})
  }
  handleAddToCart() {
    this.props.addToCart(this.props.product, this.state.quantity)
  }
  render() {
    const {classes, product} = this.props
    // console.log(product)
    return (
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
            <Button size="small" color="primary" onClick={this.handleAddToCart}>
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
    )
  }
}

const mapStateToProps = state => {
  return {product: state.product.selectedProduct}
}

const mapDispatchToProps = dispatch => {
  return {
    fetchSingleProduct: productId => {
      dispatch(fetchSingleProduct(productId))
    },
    addToCart: (product, quantity) => addToCart(product, quantity)
  }
}

SingleProduct.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(SingleProduct)
)
