const express = require('express')
const router = express.Router()
const materialsController = require('../controllers/materialsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(materialsController.getAllMaterials)
    .post(materialsController.createNewMaterial)
    .patch(materialsController.updateMaterial)
    .delete(materialsController.deleteMaterial)

module.exports = router 