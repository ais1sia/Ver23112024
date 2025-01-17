import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useEffect } from 'react'

const Welcome = () => {

    const { username, isAdmin } = useAuth()
    const navigate = useNavigate()

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    useEffect(() => {
        if (!isAdmin) {
          navigate("/dash/materials", { replace: true });
        }
      }, [isAdmin, navigate]);

    const content = (
        <section className="welcome">

            <p>{today}</p>

            <h1>Welcome back, {username}!</h1>

            <p><Link to="/dash/materials">View All Materials</Link></p>

            {(isAdmin) && <p><Link to="/dash/materials/new">Add New Material</Link></p>}

            {(isAdmin) && <p><Link to="/dash/users">View User Settings</Link></p>}


        </section>
    )

    return content
}
export default Welcome