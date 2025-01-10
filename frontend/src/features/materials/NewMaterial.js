import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewMaterialForm from './NewMaterialForm'

const NewMaterial = () => {
    const users = useSelector(selectAllUsers)

    if (!users?.length) return <p>Not Currently Available</p>

    const content = <NewMaterialForm users={users} />

    return content
}
export default NewMaterial