import { useGetMaterialsQuery } from "./materialsApiSlice"
import Material from "./Material"

const MaterialsList = () => {
    const {
        data: materials,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetMaterialsQuery()

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
      const { ids } = materials;
  
      const tableContent = ids?.length
        ? ids.map((materialId) => (
            <Material key={materialId} materialId={materialId} />
          ))
        : null;
  
      content = (
        <table className="table table--materials">
          <thead className="table__thead">
            <tr>
              <th scope="col" className="table__th material__title">
                Title
              </th>
              <th scope="col" className="table__th material__language">
                Language
              </th>
              <th scope="col" className="table__th material__level">
                Level
              </th>
              <th scope="col" className="table__th material__content">
                Content
              </th>
              <th scope="col" className="table__th material__tags">
                Tags
              </th>
              <th scope="col" className="table__th material__edit">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </table>
      );
    }
  
    return content;
}
export default MaterialsList