const Material = require('../models/Material');
const asyncHandler = require('express-async-handler');

// @desc Get all materials
// @route GET /materials
// @access Public
const getAllMaterials = asyncHandler(async (req, res) => {
    const materials = await Material.find().lean();
    if (!materials || materials.length === 0) {
        return res.status(404).json({ message: 'No materials found' })
    }
    res.json(materials);
});

// @desc Create a new material
// @route POST /materials
// @access Private
const createNewMaterial = asyncHandler(async (req, res) => {
    const { title, content, level, tags } = req.body;

    if (!title || !content || !level) {
        return res.status(400).json({ message: 'Title, content, and level are required' })
    }

    const material = await Material.create({
        title,
        content,
        level,
        tags
    });

    if (material) {
        res.status(201).json({ message: 'Material created successfully', material })
    } else {
        res.status(400).json({ message: 'Invalid material data' });
    }
});

// @desc Update material ratings
// @route PATCH /materials/:id/rating
// @access Private
const updateMaterial = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content, level, tags, userId, rating } = req.body;

    const material = await Material.findById(id);
    if (!material) {
        return res.status(404).json({ message: 'Material not found' })
    }

    if (title) material.title = title;
    if (content) material.content = content;
    if (level) material.level = level;
    if (tags) material.tags = tags;

    if (userId && rating) {
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const existingRating = material.usefulness.find((entry) => entry.userId.toString() === userId)

        if (existingRating) {
            existingRating.rating = rating;
        } else {
            material.usefulness.push({ userId, rating })
        }

        material.calculateAverageRating();
    }

    await material.save();
    
    const reply = ({ message: 'Material updated successfully', material })
    res.json(reply)

});

// @desc Delete a material
// @route DELETE /materials/:id
// @access Private
const deleteMaterial = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const material = await Material.findById(id);
    if (!material) {
        return res.status(404).json({ message: 'Material not found' })
    }

    await material.deleteOne();

    const reply = ({ message: `Material with ID ${id} deleted successfully` })

    res.json(reply)
});

module.exports = {
    getAllMaterials,
    createNewMaterial,
    updateMaterial,
    deleteMaterial
};
