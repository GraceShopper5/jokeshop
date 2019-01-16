import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import red from '@material-ui/core/colors/red'
import deepOrange from '@material-ui/core/colors/deepOrange'
import yellow from '@material-ui/core/colors/yellow'
import green from '@material-ui/core/colors/green'
import blue from '@material-ui/core/colors/blue'
import deepPurple from '@material-ui/core/colors/deepPurple'
// import ImageIcon from '@material-ui/icons/Image';
// import WorkIcon from '@material-ui/icons/Work';
// import BeachAccessIcon from '@material-ui/icons/BeachAccess';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: theme.palette.background.paper
  },
  avatar: {
    margin: 10
  },
  redAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: red[500]
  },
  orangeAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepOrange[500]
  },
  yellowAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: yellow[500]
  },
  greenAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: green[500]
  },
  blueAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: blue[500]
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepPurple[500]
  }
})

function ReviewList(props) {
  const {classes, reviews} = props
  return (
    <List className={classes.root}>
      {reviews
        .sort((a, b) => {
          return new Date(b.Review.createdAt) - new Date(a.Review.createdAt)
        })
        .map(review => (
          <ListItem key={review.Review.userId}>
            <Avatar
              className={
                classes[
                  `${
                    colors[
                      (review.firstName.charCodeAt(0) +
                        review.lastName.charCodeAt(0)) %
                        (colors.length - 1)
                    ]
                  }Avatar`
                ]
              }
            >
              {review.firstName.slice(0, 1)}
              {review.lastName.slice(0, 1)}
            </Avatar>
            <ListItemText
              primary={review.Review.content}
              secondary={`By ${review.firstName} at ${new Date(
                review.Review.createdAt
              ).toLocaleString()}`}
            />
          </ListItem>
        ))}
    </List>
  )
}

ReviewList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ReviewList)
