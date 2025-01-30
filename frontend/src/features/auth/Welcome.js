import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useEffect } from 'react'

const Welcome = () => {

    const { isAdmin } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAdmin) {
          navigate("/dash/materials", { replace: true });
        }
      }, [isAdmin, navigate]);

    const content = (
        <section className="welcome">

            <p><Link to="/dash/materials">View Materials Dashboard</Link></p>

            {(isAdmin) && <p><Link to="/dash/materials/new">Add New Material</Link></p>}

            {(isAdmin) && <p><Link to="/dash/users">View All Users</Link></p>}

        </section>
    )

    return content
}
export default Welcome