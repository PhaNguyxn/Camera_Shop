var express = require('express')

var router = express.Router()

const Users = require('../Controller/users.controller')

router.get('/', Users.index)

router.delete('/:id', Users.delete)

router.get('/:id', Users.detail)

router.post('/signup', Users.signup)

router.put('/:id', Users.update)

router.delete('/:id', Users.delete)

router.post('/login', Users.login)

module.exports = router