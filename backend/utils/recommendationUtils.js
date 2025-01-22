const Material = require('../models/Material');
const User = require('../models/User');

async function buildUserItemMatrix() {
    const users = await User.find();
    const materials = await Material.find();

    const matrix = {};

    users.forEach(user => {
        matrix[user._id] = {}
        user.progress.forEach(progress => {
            matrix[user._id][progress.materialId] = progress.rating
        })
    })

    return { users, materials, matrix }
}

module.exports = { buildUserItemMatrix }
