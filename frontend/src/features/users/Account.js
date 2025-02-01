import { useGetUserProfileQuery } from './usersApiSlice'
import useAuth from "../../hooks/useAuth"
import DashHeader from '../../components/DashHeader';
import DashFooter from '../../components/DashFooter';
import PulseLoader from 'react-spinners/PulseLoader'
import EditUserForm from './EditUserForm'



const Account = () => {
    const { userId } = useAuth();
    const { data: user, isLoading, error } = useGetUserProfileQuery(userId, {
        skip: !userId,
    });

    if (!userId) return <p className="error-message">Error: No user ID provided</p>
    if (isLoading) return <PulseLoader color={"#FFF"} />
    if (error) return <p className="error-message">Error fetching profile</p>
    if (!user) return <p className="error-message">User not found</p>

    const maxStreak = 30
    const fireEmojis = "🔥".repeat(Math.min(user.streak, 10))
    const streakPercentage = Math.min((user.streak / maxStreak) * 100, 100)

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

                <h2 className="account-title">{user.username}'s Profile</h2>
                
                <EditUserForm user={user} />
                </div>
            </div>
        <DashFooter />
    </>
    );
};

export default Account;