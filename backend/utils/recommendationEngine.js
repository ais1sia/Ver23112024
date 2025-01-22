const { buildUserItemMatrix } = require('./recommendationUtils')

function cosineSimilarity(vectorA, vectorB) {
    const dotProduct = Object.keys(vectorA).reduce((sum, key) => sum + (vectorA[key] * (vectorB[key] || 0)), 0)
    const magnitudeA = Math.sqrt(Object.values(vectorA).reduce((sum, val) => sum + (val ** 2), 0))
    const magnitudeB = Math.sqrt(Object.values(vectorB).reduce((sum, val) => sum + ((vectorB[val] || 0) ** 2), 0))

    if (magnitudeA === 0 || magnitudeB === 0) return 0
    return dotProduct / (magnitudeA * magnitudeB)
}


async function getItemRecommendations(userId, topN = 5) {
    const { users, materials, matrix } = await buildUserItemMatrix()

    // Build item-item similarity matrix
    const itemSimilarities = {}
    materials.forEach(itemA => {
        itemSimilarities[itemA._id] = {}
        materials.forEach(itemB => {
            if (itemA._id !== itemB._id) {
                itemSimilarities[itemA._id][itemB._id] = cosineSimilarity(
                    getUserRatingsForItem(matrix, itemA._id),
                    getUserRatingsForItem(matrix, itemB._id)
                )
            }
        })
    })

    // Predict ratings for the user
    const userRatings = matrix[userId] || {};
    const recommendations = materials
        .filter(material => !userRatings[material._id])
        .map(material => {
            const weightedSum = Object.entries(itemSimilarities[material._id] || {})
                .reduce((sum, [itemId, sim]) => sum + (sim * (userRatings[itemId] || 0)), 0)
            const sumOfSimilarities = Object.values(itemSimilarities[material._id] || {}).reduce((sum, sim) => sum + sim, 0)
            const predictedRating = sumOfSimilarities > 0 ? weightedSum / sumOfSimilarities : 0

            return { material, predictedRating }
        })
        .sort((a, b) => b.predictedRating - a.predictedRating)
        .slice(0, topN)

    return recommendations.map(r => r.material)
}

function getUserRatingsForItem(matrix, itemId) {
    return Object.fromEntries(Object.entries(matrix).map(([userId, items]) => [userId, items[itemId] || 0]))
}

module.exports = { cosineSimilarity, getItemRecommendations }