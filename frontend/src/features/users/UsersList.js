import { useGetUsersQuery } from "./usersApiSlice"
import User from './User'
import PulseLoader from 'react-spinners/PulseLoader'

const UsersList = () => {

    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery(undefined, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <PulseLoader color={"#FFF"} />

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {

        const { ids } = users

        const tableContent = ids?.length
            ? ids.map(userId => <User key={userId} userId={userId} />)
            : null

        content = (
            <table className="table table--users">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th user__username">Username</th>
                        <th scope="col" className="table__th user__email">E-mail</th>
                        <th scope="col" className="table__th user__firstname">First name</th>
                        <th scope="col" className="table__th user__lastname">Last name</th>
                        <th scope="col" className="table__th user__language">Language</th>
                        <th scope="col" className="table__th user__level">Level</th>
                        <th scope="col" className="table__th user__roles">Roles</th>
                        <th scope="col" className="table__th user__goals">Goals</th>
                        <th scope="col" className="table__th user__lastLogin">Last login</th>
                        <th scope="col" className="table__th user__streak">Streak</th>
                        <th scope="col" className="table__th user__delete">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}

export default UsersList
