import { useState } from 'react';
import { useGetUserProfileQuery } from './usersApiSlice';
import useAuth from "../../hooks/useAuth";
import DashHeader from '../../components/DashHeader';
import DashFooter from '../../components/DashFooter';
import PulseLoader from 'react-spinners/PulseLoader';
import EditUserForm from './EditUserForm';

const Account = () => {
    const { userId } = useAuth();
    const { data: user, isLoading, error } = useGetUserProfileQuery(userId, {
        skip: !userId,
    });

    const [isEditing, setIsEditing] = useState(false);

    if (!userId) return <p className="error-message">Error: No user ID provided</p>;
    if (isLoading) return <PulseLoader color={"#FFF"} />;
    if (error) return <p className="error-message">Error fetching profile</p>;
    if (!user) return <p className="error-message">User not found</p>;

    const maxStreak = 30;
    const fireEmojis = "🔥".repeat(Math.min(user.streak, 10));
    const streakPercentage = Math.min((user.streak / maxStreak) * 100, 100);

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
                        <div className="streak-progress">
                            <div className="streak-bar" style={{ width: `${streakPercentage}%` }}></div>
                        </div>
                    </div>
                </div>

                <button 
                    className="form__submit-button" 
                    onClick={() => setIsEditing((prev) => !prev)}
                >
                    {isEditing ? "Hide Edit" : "Edit Personal Data"}
                </button>

                {isEditing && <EditUserForm user={user} />}
            </div>
            <DashFooter />
        </>
    );
};

export default Account;
