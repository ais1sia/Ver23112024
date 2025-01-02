const express = require('express')
const router = express.Router()
const materialsController = require('../controllers/materialsController')

router.route('/')
    .get(materialsController.getAllMaterials)
    .post(materialsController.createNewMaterial)
    .patch(materialsController.updateMaterial)
    .delete(materialsController.deleteMaterial)

module.exports = router 