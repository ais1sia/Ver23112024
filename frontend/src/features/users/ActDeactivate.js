import { useGetUserProfileQuery } from "./usersApiSlice"
import { useUpdateUserMutation } from "./usersApiSlice";


const ActDeactivate = async ({ userId }) => {
 
    const { data: user, error } = useGetUserProfileQuery(userId, {
        skip: !userId,
    })
    const [updateUser] = useUpdateUserMutation()

        if (!user) {
            alert(`User "${userId}" not found.`);
            return;
        }
        if (error) {
            alert("Error fetching profile")
            return;
        }

        const updatedFields = {
            id: user.id,
            isActive: !user.isActive,
        };

        const result = await updateUser(updatedFields).unwrap();

    if (result) { alert(`User "${userId}" has been deactivated.`)
    } else {
        alert("Failed to deactivate the user. Please try again.");
    }
};

export default ActDeactivate;