import { useGetMaterialsQuery } from "./materialsApiSlice";
import Material from "./Material";
//import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";

const MaterialsList = () => {
  //const { isAdmin } = useAuth();

  const {
    data: materials,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetMaterialsQuery();

  let content;

  // Show a loading spinner while materials are loading
  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  // Show an error message if the query failed
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  // Render materials as cards if the query was successful
  if (isSuccess) {
    const { ids } = materials;

    // Map through material IDs to generate MaterialCard components
    const cardContent = ids?.length
      ? ids.map((materialId) => (
          <Material key={materialId} materialId={materialId} />
        ))
      : <p>No materials found.</p>;

    content = <div className="materials-grid">{cardContent}</div>;
  }

  return content;
};

export default MaterialsList;
