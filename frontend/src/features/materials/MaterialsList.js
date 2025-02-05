import { useState } from "react"
import { useGetMaterialsQuery, useGetRecommendedMaterialsQuery } from "./materialsApiSlice"
import { useGetUserProfileQuery } from "../users/usersApiSlice"
import Material from "./Material"
import PulseLoader from "react-spinners/PulseLoader"
import useAuth from "../../hooks/useAuth"
import SearchBar from "../../config/SearchBar"

const MaterialsList = () => {
    const { userId } = useAuth()
    const [searchTerm, setSearchTerm] = useState("")

    const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useGetUserProfileQuery(userId)

    const {
        data: materials,
        isLoading: isLoadingMaterials,
        isError: isErrorMaterials,
        error: materialsError,
    } = useGetMaterialsQuery()

    const {
        data: recommendations,
        isLoading: isLoadingRecommendations,
        isError: isErrorRecommendations,
        error: recommendationsError,
    } = useGetRecommendedMaterialsQuery(userId)

    const filterMaterials = (items) => {
        if (!items || !user) return [];
        return items.filter(material =>
            material.language === user.language &&
            (material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.short.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    };

    const filteredRecommendations = filterMaterials(recommendations)
    const filteredMaterials = filterMaterials(materials?.entities ? Object.values(materials.entities) : [])

    return (
        <>
            {isLoadingUser && <PulseLoader color={"#FFF"} />}
            {isErrorUser && <p className="errmsg">Error loading user profile.</p>}

            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

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
    )
}

export default MaterialsList
