import React, {Component} from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 1000
  }
})

class ReviewForm extends Component {
  constructor(props) {
    super(props)
    this.state = {reviewContent: ''}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }
  handleSubmit(evt) {
    evt.preventDefault()
    this.props.handleReviewSubmission(this.state.reviewContent)
    this.props.toggleReviewForm()
  }
  render() {
    const {classes, toggleReviewForm} = this.props
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <TextField
            label="Review Content"
            name="reviewContent"
            placeholder="Enter your review here"
            multiline
            className={classes.textField}
            margin="normal"
            onChange={this.handleChange}
            value={this.state.reviewContent}
          />
          <div>
            <Button type="submit">Submit</Button>
            <Button onClick={toggleReviewForm}>Cancel</Button>
          </div>
        </form>
      </div>
    )
  }
}

ReviewForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ReviewForm)
