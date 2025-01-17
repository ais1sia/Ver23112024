import { useParams } from 'react-router-dom'
import EditMaterialForm from './EditMaterialForm'
import { useGetMaterialsQuery } from './materialsApiSlice'
import {useGetUsersQuery} from '../users/usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'

const EditMaterial = () => {
    useTitle('Edit Material')

    const { id } = useParams()

    const { isAdmin } = useAuth()

    const { material } = useGetMaterialsQuery("materialsList", {
        selectFromResult: ({ data }) => ({
            material: data?.entities[id]
        }),
    })

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    if (!material || !users?.length) return <PulseLoader color={"#FFF"} />


    if (!isAdmin) {
         return <p className="errmsg">No access</p>
    }

    const content = <EditMaterialForm material={material} users={users} />

    return content
}
export default EditMaterial