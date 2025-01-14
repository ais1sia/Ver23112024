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

  if (material) {
    const handleEdit = () => navigate(`/dash/materials/${materialId}`)

    const materialTagsString = material.tags.join(", ")

    return (
      <tr className="table__row material">
        <td className="table__cell">{material.title}</td>
        <td className="table__cell">{material.language}</td>
        <td className="table__cell">{material.level}</td>
        <td className="table__cell">{material.content}</td>
        <td className="table__cell">{materialTagsString}</td>
        {isAdmin && (
          <td className="table__cell">
            <button className="icon-button table__button" onClick={handleEdit}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          </td>
        )}
      </tr>
    );
  } else return null;
};

const memoizedMaterial = memo(Material)

export default memoizedMaterial
