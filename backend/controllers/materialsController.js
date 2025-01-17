const Material = require("../models/Material");
const asyncHandler = require("express-async-handler");

// @desc Get all materials with filters
// @route GET /materials
// @access Public
// const getAllMaterials = asyncHandler(async (req, res) => {
//   const { searchQuery, tags, language, level } = req.query;
//   let filter = {};

//   if (searchQuery) {
//     filter.title = { $regex: searchQuery, $options: 'i' };
//   }
//   if (tags) {
//     filter.tags = { $in: tags.split(',') };
//   }
//   if (language) {
//     filter.language = language;
//   }
//   if (level) {
//     filter.level = level;
//   // }

//   const materials = await Material.find(filter).lean();
//   if (!materials.length) {
//     return res.status(404).json({ message: "No materials found" });
//   }
//   res.json(materials);
// });
const getAllMaterials = asyncHandler(async (req, res) => {
  const materials = await Material.find().lean();
  if (!materials || materials.length === 0) {
    return res.status(404).json({ message: "No materials found" });
  }
  res.json(materials);
});

// @desc Create a new material
// @route POST /materials
// @access Private
const createNewMaterial = asyncHandler(async (req, res) => {
  const { title, language, level, content, tags } = req.body;

  if (!title || !language || !level) {
    return res
      .status(400)
      .json({ message: "Title, language, level, and content are required" });
  }

  const duplicate = await Material.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Title already in use" });
  }

  const material = await Material.create({
    title,
    language,
    level,
    content,
    tags,
  });

  if (material) {
    res.status(201).json({ message: "Material created successfully" });
  } else {
    res.status(400).json({ message: "Invalid material data" });
  }
});

// @desc Update material ratings
// @route PATCH /materials/:id
// @access Private
const updateMaterial = asyncHandler(async (req, res) => {
  const { id, title, language, level, content, tags } = req.body; //rating
  console.log(`PATCH request received for Material ID: ${id}`);

  const material = await Material.findById(id).exec();

  if (!material) {
    return res.status(404).json({ message: "Material not found" });
  }

  const duplicate = await Material.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Title already in use" });
  }

  if (title) material.title = title;
  if (language) material.language = language;
  if (level) material.level = level;
  if (content) material.content = content;
  if (tags) material.tags = tags;

  // if (rating) {
  //     if (rating < 1 || rating > 5) {
  //         return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  //     }

  //     const existingRating = material.usefulness.find((entry) => entry.userId.toString() === userId)

  //     if (existingRating) {
  //         existingRating.rating = rating;
  //     } else {
  //         material.usefulness.push({ userId, rating })
  //     }

  //     material.calculateAverageRating();
  // }

  await material.save();

  const reply = { message: "Material updated successfully", material };
  res.json(reply);
});

// @desc Delete a material
// @route DELETE /materials/:id
// @access Private
const deleteMaterial = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Material ID Required" });
  }

  const material = await Material.findById(id).exec();

  if (!material) {
    return res.status(404).json({ message: "Material not found" });
  }

  const result = await material.deleteOne();

  const reply = `Material deleted`;

  res.json(reply);
});

module.exports = {
  getAllMaterials,
  createNewMaterial,
  updateMaterial,
  deleteMaterial,
};
