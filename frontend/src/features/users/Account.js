// import { useGetUserProfileQuery } from './usersApiSlice'
// import useAuth from "../../hooks/useAuth";


// const Account = () => {
//     const { userId } = useAuth()
//     const { data: user, isLoading, error } = useGetUserProfileQuery(userId, {
//         skip: !userId,
//     })

//     if (!userId) return <p>Error: No user ID provided</p>
//     if (isLoading) return <p>Loading...</p>
//     if (error) return <p>Error fetching profile</p>
//     if (!user) return <p>User not found</p>

//     return (
//         <div className="account-container">
//             <h2>{user.username}'s Profile</h2>
//             <p>Email: {user.email}</p>
//             <p>Level: {user.level}</p>
//             <p>🔥 Login Streak: {user.streak} days 🔥</p>
//         </div>
//     )
// }

// export default Account

import { useGetUserProfileQuery } from './usersApiSlice'
import useAuth from "../../hooks/useAuth"
import DashHeader from '../../components/DashHeader';
import DashFooter from '../../components/DashFooter';

const Account = () => {
    const { userId } = useAuth();
    const { data: user, isLoading, error } = useGetUserProfileQuery(userId, {
        skip: !userId,
    });

    if (!userId) return <p className="error-message">❌ Error: No user ID provided</p>;
    if (isLoading) return <p className="loading-message">⏳ Loading...</p>;
    if (error) return <p className="error-message">❌ Error fetching profile</p>;
    if (!user) return <p className="error-message">❌ User not found</p>;

    // Generate fire emoji streak display
    const maxStreak = 30; // Assume 30 days as a full streak goal
    const fireEmojis = "🔥".repeat(Math.min(user.streak, 10)); // Cap at 10 flames for readability
    const streakPercentage = Math.min((user.streak / maxStreak) * 100, 100); // Progress bar

    return (
        <>
        <DashHeader />
        <div className="account-container">
            <h2 className="account-title">{user.username}'s Profile</h2>
            <div className="account-info">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Level:</strong> {user.level}</p>
                
                {/* Login Streak Display */}
                <div className="streak-container">
                    <p className="streak-text">
                        <strong>Login Streak:</strong> {user.streak} days {fireEmojis}
                    </p>
                    <div className="streak-progress">
                        <div className="streak-bar" style={{ width: `${streakPercentage}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
        <DashFooter />
    </>
    );
};

export default Account;