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

    //21.01.2025
    router.route('/recommend/:userId').get(materialsController.getRecommendedMaterials)
    router.route('/rate/:id').patch(materialsController.rateMaterial)

module.exports = router 