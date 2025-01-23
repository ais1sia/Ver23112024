import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from "../hooks/useAuth"

const DashFooter = () => {

    const { userId, status } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClicked = () => {
        if (userId) {
          navigate("/dash/materials");
        } else if (status === "Admin") {
          navigate("/dash");
        } else {
          navigate("/");
        }
      };
    
      // Show the button only if not already on the "home" page
      let goHomeButton = null;
      if (pathname !== "/dash" && pathname !== "/dash/materials") {
        goHomeButton = (
          <button
            className="dash-footer__button icon-button"
            title="Home"
            onClick={onGoHomeClicked}
          >
            <FontAwesomeIcon icon={faHouse} />
          </button>
        );
      }

    const content = (
        <footer className="dash-footer">
            {goHomeButton}
            {/* <p>Current User: {username}</p>
            <p>Status: {status}</p> */}
        </footer>
    )
    return content
}
export default DashFooter