import { useState } from "react";
import { useGetMaterialsQuery, useGetRecommendedMaterialsQuery } from "./materialsApiSlice";
import Material from "./Material";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../../hooks/useAuth";
import SearchBar from "../../config/SearchBar"

const MaterialsList = () => {
    const { userId } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");

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

    // Filter function
    const filterMaterials = (items) => {
        if (!items) return [];
        return items.filter(material =>
            material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.short.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Apply filtering
    const filteredRecommendations = filterMaterials(recommendations);
    const filteredMaterials = filterMaterials(materials?.entities ? Object.values(materials.entities) : []);

    return (
        <>
            {/* Search Bar */}
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            {/* Recommended Materials Section */}
            <div className="recommendations-section">
                <h2>Recommended for You</h2>
                {isLoadingRecommendations ? (
                    <PulseLoader color={"#FFF"} />
                ) : isErrorRecommendations ? (
                    <p className="errmsg">{recommendationsError?.data?.message || "Error loading recommendations."}</p>
                ) : filteredRecommendations.length ? (
                    <div className="recommendations-grid">
                        {filteredRecommendations.map(material => (
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
                ) : filteredMaterials.length ? (
                    <div className="materials-grid">
                        {filteredMaterials.map(material => (
                            <Material key={material._id} materialId={material._id} />
                        ))}
                    </div>
                ) : (
                    <p>No materials found.</p>
                )}
            </div>
        </>
    );
};

export default MaterialsList;
