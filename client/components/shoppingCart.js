import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {fetchCart, addToCart} from '../store'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Card from '@material-ui/core/Card'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
// import InboxIcon from '@material-ui/icons/Inbox';
// import DraftsIcon from '@material-ui/icons/Drafts';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
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
  }
})

class ShoppingCart extends Component {
  constructor(props) {
    super(props)
    this.state = {cart: []}
  }
  componentDidMount() {
    const cart = this.props.fetchCart(this.props.user.id)
    this.setState({cart})
  }
  render() {
    // console.log('this.props.cart', this.props.cart)
    const {classes, cart} = this.props
    return (
      <div className={classes.root}>
        <List component="nav">
          {/* <ListItem button>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Inbox" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Drafts" />
                    </ListItem> */}
          {this.state.cart && this.state.cart.length ? (
            cart.map(product =>
              //   <ListItem button key={product.id}>
              //     <Card className={classes.product}>
              //       <CardMedia
              //         className={classes.cardMedia}
              //         image={product.imageUrl}
              //         title={product.name}
              //       />
              //       <CardContent className={classes.cardContent}>
              //         <Typography gutterBottom variant="h5" component="h2">
              //           {product.name}
              //         </Typography>
              //         <Typography>{product.description}</Typography>
              //       </CardContent>
              //       <CardActions>
              //         <Button
              //           size="small"
              //           color="primary"
              //           component={Link}
              //           to={`/products/${product.id}`}
              //         >
              //           View
              //         </Button>
              //         <Button size="small" color="primary">
              //           Purchase
              //         </Button>
              //         <Button size="small" color="primary">
              //           Add to Cart
              //         </Button>
              //       </CardActions>
              //     </Card>
              //   </ListItem>
              // ))}
              console.log('hi')
            )
          ) : (
            <h1>nothing here</h1>
          )}
        </List>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {cart: state.shoppingCart.cart, user: state.user}
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCart: userId => {
      dispatch(fetchCart(userId))
    }
  }
}

ShoppingCart.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ShoppingCart))
)
