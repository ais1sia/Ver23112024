import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { memo } from 'react'
import { useGetUsersQuery } from './usersApiSlice'
import { useDeleteUserMutation } from "./usersApiSlice";

const User = ({ userId }) => {

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        }),
    })

    const [deleteUser] = useDeleteUserMutation()
    
    if (user) {
        const handleDelete = async () => {
            await deleteUser({ id: user.id })
        }

        const userRolesString = user.roles.toString().replaceAll(',', ', ')
        const userGoalsString = user.goals.toString().replaceAll(',', ', ')

        const cellStatus = user.isActive ? '' : 'table__cell--isActive'

        return (
            <tr className="table__row user">
                <td className={`table__cell ${cellStatus}`}>{user.username}</td>
                <td className={`table__cell ${cellStatus}`}>{user.email}</td>
                <td className={`table__cell ${cellStatus}`}>{user.firstname}</td>
                <td className={`table__cell ${cellStatus}`}>{user.lastname}</td>
                <td className={`table__cell ${cellStatus}`}>{user.language}</td>
                <td className={`table__cell ${cellStatus}`}>{user.level}</td>
                <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table__cell ${cellStatus}`}>{userGoalsString}</td>
                <td className={`table__cell ${cellStatus}`}>{user.lastLogin}</td>
                <td className={`table__cell ${cellStatus}`}>{user.streak}</td>
                <td className={`table__cell ${cellStatus}`}>
                    <button
                        className="icon-button table__button"
                        onClick={handleDelete}
                    >
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}

const memoizedUser = memo(User)

export default memoizedUser
