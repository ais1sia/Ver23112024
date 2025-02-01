import { useGetMaterialsQuery, useGetRecommendedMaterialsQuery } from "./materialsApiSlice";
import Material from "./Material";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../../hooks/useAuth";
import { useGetViewedMaterialsQuery } from '../materials/materialsApiSlice';

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

    const { 
        data: viewedMaterials = [], 
        isLoading: isLoadingViewed, 
        isError: isErrorViewed, 
        error: viewedError,
    } = useGetViewedMaterialsQuery(userId);

    return (
        <>
            {/* Recommended Materials Section */}
            <div className="recommendations-section">
                <h2>Recommended for You</h2>
                {isLoadingRecommendations ? (
                    <PulseLoader color={"#FFF"} />
                ) : isErrorRecommendations ? (
                    <p className="errmsg">{recommendationsError?.data?.message || "Error loading recommendations."}</p>
                ) : recommendations?.length ? (
                    <div className="recommendations-grid">
                        {recommendations.map(material => (
                            <Material key={material._id} materialId={material._id} />
                        ))}
                    </div>
                ) : (
                    <p>No recommendations found.</p>
                )}
            </div>

            {/* All Materials Section */}
            <div className="materials-section">
                <h2>All Materials</h2>
                {isLoadingMaterials ? (
                    <PulseLoader color={"#FFF"} />
                ) : isErrorMaterials ? (
                    <p className="errmsg">{materialsError?.data?.message || "Error loading materials."}</p>
                ) : materials?.ids?.length ? (
                    <div className="materials-grid">
                        {materials.ids.map(materialId => (
                            <Material key={materialId} materialId={materialId} />
                        ))}
                    </div>
                ) : (
                    <p>No materials found.</p>
                )}
            </div>

            {/* Recently Viewed Materials Section */}
            <div className="viewed-section">
                <h2>Recently Viewed</h2>
                {isLoadingViewed ? (
                    <PulseLoader color={"#FFF"} />
                ) : isErrorViewed ? (
                    <p className="errmsg">{viewedError?.data?.message || "Error loading viewed materials."}</p>
                ) : viewedMaterials.length > 0 ? (
                    <div className="viewed-grid">
                        {viewedMaterials.map(material => (
                            <Material key={material._id} materialId={material._id} />
                        ))}
                    </div>
                ) : (
                    <p>No viewed materials yet.</p>
                )}
            </div>
        </>
    );
};

export default MaterialsList;
