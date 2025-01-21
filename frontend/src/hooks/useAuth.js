import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import { jwtDecode } from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isAdmin = false
    let status = "User"
    let userId = null

    if (token) {
        const decoded = jwtDecode(token)
        const { userId, username, roles } = decoded.UserInfo

        isAdmin = roles.includes('Admin')

        if (isAdmin) status = "Admin"

        return { userId, username, roles, status, isAdmin }
    }

    return { userId, username: '', roles: [], isAdmin, status }
}
export default useAuth