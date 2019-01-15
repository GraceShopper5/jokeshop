import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  }
})

class addQuantityToCart extends Component {
  constructor(props) {
    super(props)
    this.state = {quantity: 1}
    this.handleChange = this.handleChange.bind(this)
    this.handleAddToCart = this.handleAddToCart.bind(this)
  }
  handleChange(event) {
    this.setState({quantity: event.target.value})
  }
  handleAddToCart() {
    const {userId, product, addToCart} = this.props
    addToCart(product, this.state.quantity, false, userId)
  }
  render() {
    const {classes} = this.props
    return (
      <div>
        <Button size="small" color="primary" onClick={this.handleAddToCart}>
          Add to Cart
        </Button>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel htmlFor="outlined-quantity">Quantity</InputLabel>
          <Select
            native
            value={this.state.quantity}
            onChange={this.handleChange}
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
      </div>
    )
  }
}

addQuantityToCart.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(addQuantityToCart)
