import React, {Component} from 'react'
import {connect} from 'react-redux'

class Profile extends Component {
  render() {
    const {firstName, lastName, email} = this.props
    return (
      <div>
        <form>
          <h2>Edit Profile</h2>
          <label htmlFor="firstName">
            <small>First Name:</small>
          </label>
          <input name="firstName" type="text" defaultValue={firstName} />
          <label htmlFor="lastName">
            <small>Last Name:</small>
          </label>
          <input name="lastName" type="text" defaultValue={lastName} />
          <label htmlFor="email">
            <small>Email:</small>
          </label>
          <input name="email" type="text" defaultValue={email} />
        </form>
      </div>
    )
  }
}

const msp = state => ({
  firstName: state.user.firstName,
  lastName: state.user.lastName,
  email: state.user.email
})

const mdp = dispatch => ({})

export default connect(msp, mdp)(Profile)
