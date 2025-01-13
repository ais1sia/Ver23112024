import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";
import {
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const DASH_REGEX = /^\/dash(\/)?$/;
const MATERIALS_REGEX = /^\/dash\/materials(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  const { isAdmin } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [
    sendLogout,
    {
      isLoading,
      isSuccess,
      isError,
      error,
    },
  ] = useSendLogoutMutation();

    useEffect(() => {
      // console.log("Logout success state:", isSuccess);
      if (isSuccess) {
          // console.log("Attempting navigation to '/'");
        navigate("/");
      }
    }, [isSuccess, navigate]);

  // const handleLogout = async () => {
  //   try {
  //     await sendLogout().unwrap() // Waits for success
  //     //console.log("Logout successful, navigating...");
  //     navigate("/");
  //   } catch (err) {
  //     console.error("Error during logout:", err);
  //   }
  // };

  const onNewMaterialClicked = () => navigate("/dash/materials/new");
  const onNewUserClicked = () => navigate("/dash/users/new");
  const onMaterialsClicked = () => navigate("/dash/materials");
  const onUsersClicked = () => navigate("/dash/users");

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !MATERIALS_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  let newMaterialButton = null;
  if (isAdmin) {
    if (MATERIALS_REGEX.test(pathname)) {
      newMaterialButton = (
        <button
          className="icon-button"
          title="New Material"
          onClick={onNewMaterialClicked}
        >
          <FontAwesomeIcon icon={faFileCirclePlus} />
        </button>
      );
    }
  }
  
  let newUserButton = null;
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button
        className="icon-button"
        title="New User"
        onClick={onNewUserClicked}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    );
  }

  let userButton = null;
  if (isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      userButton = (
        <button className="icon-button" title="Users" onClick={onUsersClicked}>
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      );
    }
  }

  let materialsButton = null;
  if (!MATERIALS_REGEX.test(pathname) && pathname.includes("/dash")) {
    materialsButton = (
      <button
        className="icon-button"
        title="Materials"
        onClick={onMaterialsClicked}
      >
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    );
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const errClass = isError ? "errmsg" : "offscreen";

  let buttonContent;
  if (isLoading) {
    buttonContent = <p>Logging Out...</p>;
  } else {
    buttonContent = (
      <>
        {newMaterialButton}
        {newUserButton}
        {materialsButton}
        {userButton}
        {logoutButton}
      </>
    );
  }

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <header className="dash-header">
        <div className={`dash-header__container ${dashClass}`}>
          <Link to="/dash">
            <h1 className="dash-header__title">ReadyAimFluent</h1>
          </Link>
          <nav className="dash-header__nav">{buttonContent}</nav>
        </div>
      </header>
    </>
  );

  return content;
};

export default DashHeader;
