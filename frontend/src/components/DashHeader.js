import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link, useLocation } from "react-router-dom";

const DASH_REGEX = /^\/dash(\/)?$/;
const MATERIALS_REGEX = /^\/dash\/materials(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout] =
    useSendLogoutMutation();

//   useEffect(() => {
//     console.log("Logout success state:", isSuccess);
//     if (isSuccess) {
//         console.log("Attempting navigation to '/'");
//       navigate("/");
//     }
//   }, [isSuccess, navigate]);

const handleLogout = async () => {
    try {
        await sendLogout().unwrap(); // Waits for success
        //console.log("Logout successful, navigating...");
        navigate('/');
    } catch (err) {
        console.error("Error during logout:", err);
    }
};

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !MATERIALS_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={handleLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const content = (
    <header className="dash-header">
      <div className={`dash-header__container ${dashClass}`}>
        <Link to="/dash">
          <h1 className="dash-header__title">ReadyAimFluent</h1>
        </Link>
        <nav className="dash-header__nav">
          {/* add more buttons later */}
          {logoutButton}
        </nav>
      </div>
    </header>
  );

  return content;
};
export default DashHeader;
