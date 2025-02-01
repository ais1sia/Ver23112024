import useAuth from "../../hooks/useAuth"
import { useGetMaterialsQuery } from "./materialsApiSlice"
import { useGetUserProfileQuery } from "../users/usersApiSlice"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom"
import { memo } from 'react'
const materialbg = require('../../config/materialbg.png')

// TABLE STRUCTURE HERE

const Material = ({ materialId }) => {
  const { userId, isAdmin } = useAuth()
  
  const { material } = useGetMaterialsQuery("materialsList", {
    selectFromResult: ({ data }) => ({
      material: data?.entities[materialId],
    }),
  })

  const { data: user } = useGetUserProfileQuery(userId, {
    skip: !userId,
})

const viewedEntry = user?.viewedMaterials?.find(
  (view) => view.materialId.toString() === material?._id.toString()
)

const lastViewedDate = viewedEntry
  ? new Date(viewedEntry.viewedAt).toLocaleString()
  : "Not viewed yet"

  const navigate = useNavigate();

  if (material) {
    const handleView = () => navigate(`/dash/materials/${materialId}`)
    const handleEdit = (e) => {
      e.stopPropagation()
      navigate(`/dash/materials/edit/${materialId}`)
    }

    const materialTagsString = material.tags.join(", ")

    return (
      <div className="card material" onClick={handleView}>
        {material.imageUrl && ( 
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
        <p className="card__viewed">Last viewed: {lastViewedDate}</p>
        <p className="card__short">Short description: {material.short}</p>
        <p className="card__level">Level: {material.level}</p>
        <p className="card__tags">Tags: {materialTagsString}</p>
        <p className="avg_rating">Avg rating: {material.averageRating}</p>
        <div className="card__actions">
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
