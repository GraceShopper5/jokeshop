const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

// Add back in for admin ...
// router.get('/', async (req, res, next) => {
//   try {
//     const users = await User.findAll({
//       // explicitly select only the id and email fields - even though
//       // users' passwords are encrypted, it won't help if we just
//       // send everything to anyone who asks!
//       attributes: ['id', 'email']
//     })
//     res.json(users)
//   } catch (err) {
//     next(err)
//   }
// })

// find a single users info
// (if req.user && req.user.id === req.params.id || req.user.isAdmin)
