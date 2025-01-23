import useAuth from "../../hooks/useAuth"
import { useGetMaterialsQuery, useRateMaterialMutation } from "./materialsApiSlice"
import { faPenToSquare, /*faStar*/ } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom"
import { memo } from 'react'
//import { useState } from "react"
const materialbg = require('../../config/materialbg.png')

// TABLE STRUCTURE HERE

const Material = ({ materialId }) => {
  const { userId, isAdmin } = useAuth()
  const [rateMaterial] = useRateMaterialMutation()

  const { material } = useGetMaterialsQuery("materialsList", {
    selectFromResult: ({ data }) => ({
      material: data?.entities[materialId],
    }),
  })

  //21.01.2025
  //const rating = useState(0)
  const handleRate = async (rating) => {
    try {
      await rateMaterial({ id: materialId, rating, userId: userId }).unwrap()
    } catch (err) {
      console.error("Failed to rate material:", err);
    }
  }

  const navigate = useNavigate();

  //17.01.2025
  if (material) {
    const handleView = () => navigate(`/dash/materials/${materialId}`)
    const handleEdit = (e) => {
      e.stopPropagation()
      navigate(`/dash/materials/edit/${materialId}`)
    }

    const materialTagsString = material.tags.join(", ")

    return (
      <div className="card material" onClick={handleView}>
        {material.imageUrl && ( // Ensure the image URL exists before rendering the image
          <img
            className="card__image"
            src={material.imageUrl}
            alt={`${material.title} thumbnail`}
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
        )}
        {!(material.imageUrl) &&
        <img
        className="card__image"
        src={materialbg}
        alt={`${material.title} thumbnail`}
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
      />
        }
        <h3 className="card__title">{material.title}</h3>
        <p className="card__language">Language: {material.language}</p>
        <p className="card__short">Short description: {material.short}</p>
        <p className="card__level">Level: {material.level}</p>
        <p className="card__tags">Tags: {materialTagsString}</p>
        <p className="avg_rating">Avg rating: {material.averageRating}</p>
        <div className="card__actions">
          {/* <div className="card__rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    onClick={() => handleRate(star)} // Set rating on click
                    className={`star-icon ${star <= rating ? "active" : ""}`} // Apply active class if the star is selected
                />
            ))}
        </div> */}
          <div className="card__rating">
            <button onClick={() => handleRate(1)}>1</button>
            <button onClick={() => handleRate(2)}>2</button>
            <button onClick={() => handleRate(3)}>3</button>
            <button onClick={() => handleRate(4)}>4</button>
            <button onClick={() => handleRate(5)}>5</button>
          </div>
          {isAdmin && (
            <button className="icon-button edit-button" onClick={handleEdit}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          )}
        </div>
      </div>
    )
  } else return null
}

const memoizedMaterial = memo(Material)

export default memoizedMaterial
