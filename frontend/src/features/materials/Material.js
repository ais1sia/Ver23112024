import useAuth from "../../hooks/useAuth";
import { useGetMaterialsQuery } from "./materialsApiSlice";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { memo } from 'react'

// TABLE STRUCTURE HERE

const Material = ({ materialId }) => {
  const { isAdmin } = useAuth();

  const { material } = useGetMaterialsQuery("materialsList", {
    selectFromResult: ({ data }) => ({
      material: data?.entities[materialId],
    }),
  })

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
        <h3 className="card__title">{material.title}</h3>
        <p className="card__language">Language: {material.language}</p>
        <p className="card__level">Level: {material.level}</p>
        <p className="card__tags">Tags: {materialTagsString}</p>
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
