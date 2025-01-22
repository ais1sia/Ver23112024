const express = require('express');
const { getItemRecommendations } = require('../utils/recommendationEngine');
const router = express.Router();

router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const recommendations = await getItemRecommendations(userId);
        res.json(recommendations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating recommendations' });
    }
});

module.exports = router;
