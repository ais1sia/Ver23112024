import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectMaterialById, useGetMaterialsQuery } from './materialsApiSlice'
import EditMaterialForm from './EditMaterialForm'

const EditMaterial = () => {
    const { id } = useParams()

    const { isLoading, isSuccess } = useGetMaterialsQuery()

    const material = useSelector(state => selectMaterialById(state, id))

    let content

    if (isLoading) {
        content = <p>Loading...</p>
    } else if (!isSuccess) {
        content = <p>Failed to fetch material data</p>
    } else if (!material) {
        content = <p>Material not found!</p>
    } else {
        content = <EditMaterialForm material={material} />
    }

    return content
}

export default EditMaterial
