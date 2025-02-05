import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import useAuth from "../hooks/useAuth"

const DashFooter = () => {

    const { userId, status } = useAuth()

    const navigate = useNavigate()

    const onGoHomeClicked = () => {
        if (status === "Admin") {
          navigate("/dash")
         } else if (userId) {
          navigate("/dash/materials");
        } else {
          navigate("/");
        }
      };
          
        const goHomeButton = (
          <button
            className="dash-footer__button icon-button"
            title="Home"
            onClick={onGoHomeClicked}
          >
            <FontAwesomeIcon icon={faHouse} />
          </button>
        )


    const content = (
        <footer className="dash-footer">
            {goHomeButton}
            <div className="dash-footer__title">An application supporting language learning using recommendation algorithms. Lodz University of Technology, 2025.</div>
        </footer>
    )
    return content
}
export default DashFooter