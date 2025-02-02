import { useState } from 'react';
import { useGetUserProfileQuery } from './usersApiSlice';
import useAuth from "../../hooks/useAuth";
import DashHeader from '../../components/DashHeader';
import DashFooter from '../../components/DashFooter';
import PulseLoader from 'react-spinners/PulseLoader';
import EditUserForm from './EditUserForm';
import { useGetViewedMaterialsQuery } from '../materials/materialsApiSlice';
import Material from "../materials/Material"



const Account = () => {
    const { userId } = useAuth();
    const { data: user, isLoading, error } = useGetUserProfileQuery(userId, {
        skip: !userId,
    });

    const { 
        data: viewedMaterials = [], 
        isLoading: isLoadingViewed, 
        isError: isErrorViewed, 
        error: viewedError,
    } = useGetViewedMaterialsQuery(userId);

    const [isEditing, setIsEditing] = useState(false);

    if (!userId) return <p className="error-message">Error: No user ID provided</p>;
    if (isLoading) return <PulseLoader color={"#FFF"} />;
    if (error) return <p className="error-message">Error fetching profile</p>;
    if (!user) return <p className="error-message">User not found</p>;

    // const maxStreak = 30;
    const fireEmojis = "🔥".repeat(Math.min(user.streak, 10));
    // const streakPercentage = Math.min((user.streak / maxStreak) * 100, 100);

    return (
        <>
            <DashHeader />
            <div className="account-container">
                <h2 className="account-title">Hello, {user.username}! How are you today?</h2>
                <div className="account-info">
                    <p><strong>Your language level:</strong> {user.level}</p>

                    <div className="streak-container">
                        <p className="streak-text">
                             You have a <strong>{user.streak}-day {fireEmojis} </strong> learning streak! <br /> Keep going! 
                        </p>
                        {/* <div className="streak-progress">
                            <div className="streak-bar" style={{ width: `${streakPercentage}%` }}></div>
                        </div> */}
                    </div>
                </div>

                <button 
                    className="form__submit-button" 
                    onClick={() => setIsEditing((prev) => !prev)}
                >
                    {isEditing ? "Hide Edit" : "Edit Personal Data"}
                </button>

                {isEditing && <EditUserForm user={user} />}

                {/* Recently Viewed Materials Section */}
                <div className="viewed-section">
                <h2>Recently Viewed</h2>
                {isLoadingViewed ? (
                    <PulseLoader color={"#FFF"} />
                ) : isErrorViewed ? (
                    <p className="errmsg">{viewedError?.data?.message || "No viewed materials yet."}</p>
                ) : viewedMaterials.length > 0 ? (
                    <div className="viewed-grid">
                        {viewedMaterials.map(material => (
                            <Material key={material.materialId} materialId={material.materialId} />
                        ))}

                    </div>
                ) : (
                    <p>No viewed materials.</p>
                )}
            </div>
            </div>
            <DashFooter />
        </>
    );
};

export default Account;
