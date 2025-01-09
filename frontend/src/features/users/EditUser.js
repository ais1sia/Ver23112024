import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserById } from './usersApiSlice'
import EditUserForm from './EditUserForm'
import { useGetUsersQuery } from './usersApiSlice'

const EditUser = () => {
    const { id } = useParams()

    const { isLoading, isSuccess } = useGetUsersQuery()

    const user = useSelector(state => selectUserById(state, id))

    let content

    if (isLoading) {
        content = <p>Loading...</p>
    } else if (!isSuccess) {
        content = <p>Failed to fetch user data</p>
    } else if (!user) {
        content = <p>User not found!</p>
    } else {
        content = <EditUserForm user={user} />
    }

    return content
}

export default EditUser

