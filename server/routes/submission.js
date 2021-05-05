const express = require('express')
const router = express.Router()
const { requireLogin } = require('../middlewares/requireLogin')
const { submissionController } = require('../controllers/submissionController')
const { permit } = require('../middlewares/permit')
const { permission } = require('../constants/user')

const { ADMIN, COLLABORATOR, SELLER, DISPATCHER, GUESS } = permission

//customers
router.get('/submission', requireLogin, submissionController.getAll)
router.get(
	'/customer/:idCustomer/submission',
	[requireLogin, permit(ADMIN, COLLABORATOR, SELLER, DISPATCHER)],
	submissionController.getAllFromCustomer
)
router.get('/submission/:idSubmission', requireLogin, submissionController.getOne)

router.post('/submission', [requireLogin, permit(ADMIN, COLLABORATOR, SELLER, DISPATCHER)], submissionController.create)
router.put(
	'/submission/:idSubmission',
	[requireLogin, permit(ADMIN, COLLABORATOR, SELLER, DISPATCHER)],
	submissionController.update
)
router.delete('/submission/:idSubmission', [requireLogin, permit(ADMIN, COLLABORATOR)], submissionController.delete)

// router.patch('/submission/:idCustomer', [requireLogin, permit(ADMIN, COLLABORATOR)], submissionController.status)

// router.post('/import/customers', requireLogin, customerController.exportCustomer)
module.exports = router
