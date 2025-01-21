const mongoose = require('mongoose')
const Material = require("../models/Material")
const asyncHandler = require("express-async-handler")

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
  const materials = await Material.find().lean()
  if (!materials || materials.length === 0) {
    return res.status(404).json({ message: "No materials found" })
  }
  res.json(materials)
});

// @desc Create a new material
// @route POST /materials
// @access Private
const createNewMaterial = asyncHandler(async (req, res) => {
  const { title, language, short, level, content, imageUrl, sourceUrl, tags } = req.body;

  if (!title || !language || !level) {
    return res
      .status(400)
      .json({ message: "Title, language, and level are required" });
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
    short,
    level,
    content,
    imageUrl,
    sourceUrl,
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
  const { id, title, language, short, level, content, imageUrl, sourceUrl, tags } = req.body; //rating
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
  if (short) material.short = short;
  if (level) material.level = level;
  if (content) material.content = content;
  if (imageUrl) material.imageUrl = imageUrl;
  if (sourceUrl) material.sourceUrl = sourceUrl;
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
})

//21.01.2025
const getRecommendedMaterials = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Fetch user progress data
  const user = await User.findById(userId).populate('progress.materialId').exec();
  if (!user) return res.status(404).json({ message: "User not found" });

  // Fetch all materials
  const allMaterials = await Material.find().exec();

  // Map of material ratings by users
  const materialRatings = {};
  allMaterials.forEach((material) => {
      materialRatings[material._id] = material.usefulness.map((entry) => ({
          userId: entry.userId.toString(),
          rating: entry.rating || 0,
      }))
  })

  // User's rated materials
  const userRatings = user.progress.map((entry) => ({
      materialId: entry.materialId._id.toString(),
      rating: entry.rating || 0,
  }));

  // Calculate similarity
  const similarityScores = {};
  userRatings.forEach((userRating) => {
      const { materialId, rating } = userRating;

      allMaterials.forEach((otherMaterial) => {
          if (materialId !== otherMaterial._id.toString()) {
              const similarity = calculateCosineSimilarity(
                  materialRatings[materialId] || [],
                  materialRatings[otherMaterial._id.toString()] || []
              );

              if (!similarityScores[otherMaterial._id]) similarityScores[otherMaterial._id] = 0;
              similarityScores[otherMaterial._id] += similarity * rating;
          }
      });
  });

  // Sort materials by score
  const sortedMaterials = Object.entries(similarityScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([materialId]) => materialId);

  const recommendedMaterials = await Material.find({ _id: { $in: sortedMaterials } }).exec();

  res.json(recommendedMaterials);
})

// Helper to calculate cosine similarity
function calculateCosineSimilarity(materialA, materialB) {
  const ratingsA = materialA.map((entry) => entry.rating);
  const ratingsB = materialB.map((entry) => entry.rating);

  const dotProduct = ratingsA.reduce((sum, rating, idx) => sum + rating * (ratingsB[idx] || 0), 0);
  const magnitudeA = Math.sqrt(ratingsA.reduce((sum, rating) => sum + rating ** 2, 0));
  const magnitudeB = Math.sqrt(ratingsB.reduce((sum, rating) => sum + rating ** 2, 0));

  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
}

// 21.01.2025
// @desc Rate a material
// @route PATCH /materials/rate/:id
// @access Private
const rateMaterial = asyncHandler(async (req, res) => {
  const { id } = req.params; // Material ID
  const { userId, rating } = req.body; // User ID and rating

  if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
  }

  if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating. Must be between 1 and 5" });
  }

  const material = await Material.findById(id);
  if (!material) {
      return res.status(404).json({ message: "Material not found" });
  }

  const objectIdUserId = new mongoose.Types.ObjectId(userId);

  const existingRating = material.usefulness.find(
      (entry) => entry.userId.toString() === objectIdUserId.toString()
  );

  if (existingRating) {
      existingRating.rating = rating;
  } else {
      material.usefulness.push({ userId: objectIdUserId, rating });
  }

  material.calculateAverageRating();
  await material.save();

  res.json({ message: "Rating updated", averageRating: material.averageRating });
});


module.exports = {
  getAllMaterials,
  createNewMaterial,
  updateMaterial,
  deleteMaterial,
  getRecommendedMaterials,
  rateMaterial,
}
