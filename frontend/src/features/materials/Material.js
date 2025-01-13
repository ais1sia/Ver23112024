import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectMaterialById } from './materialsApiSlice'
import useAuth from "../../hooks/useAuth"

// TABLE STRUCTURE HERE

const Material = ({ materialId }) => {
    const { isAdmin } = useAuth()


    const material = useSelector(state => selectMaterialById(state, materialId))

    const navigate = useNavigate()

    if (material) {

        const handleEdit = () => navigate(`/dash/materials/${materialId}`)

        const materialTagsString = material.tags.join(', ');

    return (
      <tr className="table__row material">
        <td className="table__cell">{material.title}</td>
        <td className="table__cell">{material.language}</td>
        <td className="table__cell">{material.level}</td>
        <td className="table__cell">{material.content}</td>
        <td className="table__cell">{materialTagsString}</td>
        {(isAdmin) && <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>}
      </tr>
    )} else return null
}
export default Material