import React, {Component} from 'react'
import {fetchSingleProduct} from '../store'
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
  }
})

class SingleProduct extends Component {
  componentDidMount() {
    this.props.fetchSingleProduct(this.props.match.params.productId)
  }

  render() {
    const {classes, product} = this.props
    console.log(product)
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
            <Button size="small" color="primary">
              Add to Cart
            </Button>
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
    }
  }
}

SingleProduct.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(SingleProduct)
)
