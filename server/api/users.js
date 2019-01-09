const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    if (req.session.userIsAdmin) {
      const users = await User.findAll({
        attributes: ['id', 'email', 'firstName', 'lastName']
      })
      res.json(users)
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    if (
      (req.session.userId && req.session.userId == req.params.id) ||
      req.session.userIsAdmin
    ) {
      const user = await User.findById(req.params.id, {
        attributes: ['id', 'email', 'firstName', 'lastName']
      })
      res.json(user)
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    next(err)
  }
})
