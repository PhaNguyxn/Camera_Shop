var express = require('express')

var router = express.Router()

const Histories = require('../Controller/histories.controller')

router.get('/', Histories.index)

router.get('/all', Histories.history)

router.get('/:id', Histories.detail)

router.post('/', Histories.postHistory)

router.put('/update-status/:id', Histories.updateStatus)

router.put("/update-order/:id", Histories.updateOrder)

module.exports = router