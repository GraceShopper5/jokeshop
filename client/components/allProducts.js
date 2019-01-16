import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {fetchProducts, addToCart} from '../store'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Popover from '@material-ui/core/Popover'
import {AddQuantityToCart} from '../components'
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  appBar: {
    position: 'relative'
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    paddingTop: '56.25%' // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  typography: {
    margin: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 3
  }
})

class AllProducts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null
    }
    this.handlePopoverOpen = this.handlePopoverOpen.bind(this)
    this.handlePopoverClose = this.handlePopoverClose.bind(this)
  }
  componentDidMount() {
    this.props.fetchProducts()
  }

  handlePopoverOpen(event, popoverId) {
    this.setState({
      openedPopoverId: popoverId,
      anchorEl: event.target
    })
  }

  handlePopoverClose = () => {
    this.setState({
      openedPopoverId: null,
      anchorEl: null
    })
  }
  render() {
    const {classes, userId, addToCart: atc} = this.props
    const {anchorEl, openedPopoverId} = this.state
    return (
      <div>
        <Typography
          className={classes.typography}
          variant="h1"
          component="h1"
          align="center"
        >
          Products
        </Typography>
        <div className={classNames(classes.layout, classes.cardGrid)}>
          <Grid container spacing={40}>
            {this.props.products.map(product => (
              <Grid item key={product.id} sm={6} md={4} lg={3}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={product.imageUrl}
                    title={product.name}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      className={classes.typography}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h5"
                      className={classes.typography}
                    >{`$ ${(product.currentPrice / 100.0).toFixed(
                      2
                    )}`}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      component={Link}
                      to={`/products/${product.id}`}
                    >
                      View
                    </Button>
                    <Button
                      aria-owns={
                        open ? `quick-shop-popper-${product.id}` : undefined
                      }
                      aria-haspopup="true"
                      variant="contained"
                      onClick={e => this.handlePopoverOpen(e, product.id)}
                    >
                      Quick Shop
                    </Button>
                    <Popover
                      id={`quick-shop-popper-${product.id}`}
                      open={openedPopoverId === product.id}
                      anchorEl={anchorEl}
                      onClose={this.handlePopoverClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                      }}
                    >
                      <Typography className={classes.typography}>
                        Quick Shop
                      </Typography>
                      <AddQuantityToCart
                        userId={userId}
                        addToCart={atc}
                        product={product}
                        closePopover={this.handlePopoverClose}
                      />
                    </Popover>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {userId: state.user.id, products: state.product.products}
}

const mapDispatchToProps = dispatch => {
  return {
    fetchProducts: () => {
      dispatch(fetchProducts())
    },
    addToCart: (productId, quantity, overwrite, userId) =>
      dispatch(addToCart(productId, quantity, overwrite, userId))
  }
}
AllProducts.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AllProducts))
)
