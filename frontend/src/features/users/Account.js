import { useGetUserProfileQuery } from './usersApiSlice'

const Account = ({ userId }) => {
    const { data: user, isLoading, error } = useGetUserProfileQuery(userId)

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error fetching profile</p>
    if (!user) return <p>User not found</p>

    return (
        <div className="account-container">
            <h2>{user.username}'s Profile</h2>
            <p>Email: {user.email}</p>
            <p>Level: {user.level}</p>
            <p>🔥 Login Streak: {user.streak} days 🔥</p>
        </div>
    );
};

export default Account;
