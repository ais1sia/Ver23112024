import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectMaterialById } from './materialsApiSlice'
import { selectAllUsers } from '../users/usersApiSlice'
import EditMaterialForm from './EditMaterialForm'

const EditMaterial = () => {
    const { id } = useParams()

    const material = useSelector(state => selectMaterialById(state, id))
    const users = useSelector(selectAllUsers)

    const content = material && users ? <EditMaterialForm material={material} users={users} /> : <p>Loading...</p>

    return content
}
export default EditMaterial