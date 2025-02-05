const mongoose = require('mongoose')
const Material = require("../models/Material")
const asyncHandler = require("express-async-handler")
const User = require('../models/User')


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

const getRecommendedMaterials = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).exec();
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.progress.length > 0) {
      const allMaterials = await Material.find().exec();

      const materialRatings = {};
      allMaterials.forEach(material => {
          materialRatings[material._id] = material.usefulness.map(entry => ({
              userId: entry.userId.toString(),
              rating: entry.rating || 0,
          }));
      });

      const userRatings = user.progress.map(entry => ({
          materialId: entry.materialId.toString(),
          rating: entry.rating || 0,
      }));

      const similarityScores = {};
      userRatings.forEach(userRating => {
          const { materialId, rating } = userRating;

          allMaterials.forEach(otherMaterial => {
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

      const sortedMaterials = Object.entries(similarityScores)
          .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
          .map(([materialId]) => materialId);

      const recommendedMaterials = await Material.find({ _id: { $in: sortedMaterials } }).exec();

      return res.json(recommendedMaterials);
  }

  if (user.goals.length > 0) {
      const recommendedMaterials = await Material.find({
          tags: { $in: user.goals },
      }).exec();

      if (recommendedMaterials.length > 0) {
          return res.json(recommendedMaterials);
      }
  }

  res.status(404).json({ message: "No recommendations available" });
});

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
// const rateMaterial = asyncHandler(async (req, res) => {
//   const { id } = req.params; // Material ID
//   const { userId, rating } = req.body; // User ID and rating

//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid user ID" });
//   }

//   if (!rating || rating < 1 || rating > 5) {
//       return res.status(400).json({ message: "Invalid rating. Must be between 1 and 5" });
//   }

//   const material = await Material.findById(id);
//   if (!material) {
//       return res.status(404).json({ message: "Material not found" });
//   }

//   const objectIdUserId = new mongoose.Types.ObjectId(userId);

//   const existingRating = material.usefulness.find(
//       (entry) => entry.userId.toString() === objectIdUserId.toString()
//   );

//   if (existingRating) {
//       existingRating.rating = rating;
//   } else {
//       material.usefulness.push({ userId: objectIdUserId, rating });
//   }

//   material.calculateAverageRating();
//   await material.save();

//   res.json({ message: "Rating updated", averageRating: material.averageRating });
// });

const rateMaterial = asyncHandler(async (req, res) => {
  const { id } = req.params; // Material ID
  const { userId, rating } = req.body; // User ID and rating

  // Validate the user ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
  }

  // Validate the rating
  if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating. Must be between 1 and 5" });
  }

  // Find the material
  const material = await Material.findById(id);
  if (!material) {
      return res.status(404).json({ message: "Material not found" });
  }

  // Find the user
  const user = await User.findById(userId);
  if (!user) {
      return res.status(404).json({ message: "User not found" });
  }

  // Handle the usefulness array in material
  const objectIdUserId = new mongoose.Types.ObjectId(userId);

  const existingRatingInMaterial = material.usefulness.find(
      (entry) => entry.userId.toString() === objectIdUserId.toString()
  );

  if (existingRatingInMaterial) {
      // Update existing rating if the user has already rated this material
      existingRatingInMaterial.rating = rating;
  } else {
      // Push a new rating if it's the user's first time rating this material
      material.usefulness.push({ userId: objectIdUserId, rating });
  }

  // Recalculate the material's average rating
  material.calculateAverageRating();
  await material.save();

  // Handle the progress array in the user
  const existingProgress = user.progress.find(
      (progress) => progress.materialId.toString() === id
  );

  if (existingProgress) {
      // Update the rating and completed date if the user has already rated this material
      existingProgress.rating = rating;
      existingProgress.completedAt = new Date();
  } else {
      // Add a new progress entry if it's the user's first time completing this material
      user.progress.push({
          materialId: id,
          rating,
          completedAt: new Date() // Set the completion date when the material is rated
      });
  }

  // Save the user progress
  await user.save();

  // Send response with the updated average rating
  res.json({ message: "Rating updated", averageRating: material.averageRating });
});


const markMaterialAsViewed = asyncHandler(async (req, res) => {
  const { materialId } = req.params;
  const { userId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    const existingView = user.viewedMaterials.find(view => view.materialId.toString() === materialId);

    if (existingView) {
      existingView.viewedAt = new Date();
    } else {
      user.viewedMaterials.push({ materialId, viewedAt: new Date() });
    }

    await user.save({ session });

    await session.commitTransaction();
    res.status(200).json({ message: "Material marked as viewed" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
});




module.exports = {
  getAllMaterials,
  createNewMaterial,
  updateMaterial,
  deleteMaterial,
  getRecommendedMaterials,
  rateMaterial,
  markMaterialAsViewed,
}
