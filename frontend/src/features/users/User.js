import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { memo } from 'react'
import { useGetUsersQuery } from './usersApiSlice'

const User = ({ userId }) => {

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        }),
    })

    const navigate = useNavigate()

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`)

        const userRolesString = user.roles.toString().replaceAll(',', ', ')
        const userGoalsString = user.goals.toString().replaceAll(',', ', ')

        const cellStatus = user.isActive ? '' : 'table__cell--isActive'

        return (
            <tr className="table__row user">
                <td className={`table__cell ${cellStatus}`}>{user.username}</td>
                <td className={`table__cell ${cellStatus}`}>{user.email}</td>
                <td className={`table__cell ${cellStatus}`}>{user.firstname}</td>
                <td className={`table__cell ${cellStatus}`}>{user.lastname}</td>
                <td className={`table__cell ${cellStatus}`}>{user.level}</td>
                <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table__cell ${cellStatus}`}>{userGoalsString}</td>
                <td className={`table__cell ${cellStatus}`}>{user.isActive}</td>
                <td className={`table__cell ${cellStatus}`}>
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}

const memoizedUser = memo(User)

export default memoizedUser
