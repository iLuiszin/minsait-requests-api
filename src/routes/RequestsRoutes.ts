import express from 'express'
import RequestsController from '../controllers/RequestsController'

const router = express.Router()

router.route('/').post(RequestsController.getRequests).get(RequestsController.getAllRequests)
router.route('/:userId').get(RequestsController.getUserByUserId)

export default router