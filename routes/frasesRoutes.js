const express = require('express')
const router = express.Router()
const FraseController = require('../controllers/FraseController')


//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/add', checkAuth, FraseController.createFrase)
router.post('/add', checkAuth, FraseController.createFraseSave)
router.get('/edit/:id', checkAuth, FraseController.updateFrase)
router.post('/edit', checkAuth, FraseController.updateFraseSave)
router.get('/dashboard', checkAuth, FraseController.dashboard)
router.post('/remove', checkAuth, FraseController.removeFrase)
router.get('/', FraseController.showFrases)

module.exports = router