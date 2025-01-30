// import { useGetMaterialsQuery } from "./materialsApiSlice";
// import Material from "./Material";
// //import useAuth from "../../hooks/useAuth";
// import PulseLoader from "react-spinners/PulseLoader";

// const MaterialsList = () => {
//   //const { isAdmin } = useAuth();

//   const {
//     data: materials,
//     isLoading,
//     isSuccess,
//     isError,
//     error,
//   } = useGetMaterialsQuery();

//   let content;

//   // Show a loading spinner while materials are loading
//   if (isLoading) content = <PulseLoader color={"#FFF"} />;

//   // Show an error message if the query failed
//   if (isError) {
//     content = <p className="errmsg">{error?.data?.message}</p>;
//   }

//   // Render materials as cards if the query was successful
//   if (isSuccess) {
//     const { ids } = materials;

//     // Map through material IDs to generate MaterialCard components
//     const cardContent = ids?.length
//       ? ids.map((materialId) => (
//           <Material key={materialId} materialId={materialId} />
//         ))
//       : <p>No materials found.</p>;

//     content = <div className="materials-grid">{cardContent}</div>;
//   }

//   return content;
// };

// export default MaterialsList;

import { useGetMaterialsQuery, useGetRecommendedMaterialsQuery } from "./materialsApiSlice";
import Material from "./Material";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../../hooks/useAuth";

const MaterialsList = () => {
    const { userId } = useAuth();

    const {
        data: materials,
        isLoading: isLoadingMaterials,
        isError: isErrorMaterials,
        error: materialsError,
    } = useGetMaterialsQuery();

    const {
        data: recommendations,
        isLoading: isLoadingRecommendations,
        isError: isErrorRecommendations,
        error: recommendationsError,
    } = useGetRecommendedMaterialsQuery(userId);

    let content;

    if (isLoadingMaterials || isLoadingRecommendations) {
        content = <PulseLoader color={"#FFF"} />;
    } else if (isErrorMaterials || isErrorRecommendations) {
        content = (
            <p className="errmsg">
                {materialsError?.data?.message || recommendationsError?.data?.message}
            </p>
        );
    } else {
        const { ids: materialIds } = materials || { ids: [] };
        const recommendedContent = recommendations?.length
            ? recommendations.map(material => (
                  <Material key={material._id} materialId={material._id} />
              ))
            : <p>No recommendations found.</p>;

        const materialContent = materialIds?.length
            ? materialIds.map(materialId => (
                  <Material key={materialId} materialId={materialId} />
              ))
            : <p>No materials found.</p>;

        content = (
            <>
                <div className="recommendations-section">
                    <h2>Recommended for You</h2>
                    <div className="recommendations-grid">{recommendedContent}</div>
                </div>
                <div className="materials-section">
                    <h2>All Materials</h2>
                    <div className="materials-grid">{materialContent}</div>
                </div>
            </>
        );
    }

    return content;
};

export default MaterialsList;

