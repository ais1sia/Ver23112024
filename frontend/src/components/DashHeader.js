import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";
import {
  faRightFromBracket,
  faCrosshairs,
  faCircleUser,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const DASH_REGEX = /^\/dash(\/)?$/;
const MATERIALS_REGEX = /^\/dash\/materials(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  const { username, isAdmin } = useAuth()

  const navigate = useNavigate()
  const { pathname } = useLocation()

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
      if (isSuccess) {
        navigate("/");
      }
    }, [isSuccess, navigate]);

  const handleLogout = async () => {
    try {
      await sendLogout().unwrap()
      navigate("/");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  }

  const onAccountClicked = () => {
    if (pathname === "/account") {
      navigate(isAdmin ? "/dash" : "/dash/materials");
    } else {
      navigate("/account");
    }
  }

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !MATERIALS_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container";
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={handleLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  )

  const accountButton = (
    <button className="icon-button" title={pathname === "/account" ? "Home" : "Account"} onClick={onAccountClicked}>
      <FontAwesomeIcon icon={pathname === "/account" ? faHouse : faCircleUser} />
    </button>
  )

  const errClass = isError ? "errmsg" : "offscreen";

  let buttonContent;
  if (isLoading) {
    buttonContent = <p>Logging Out...</p>;
  } else {
    buttonContent = (
      <>
        {accountButton}
        {logoutButton}
      </>
    );
  }

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <header className="dash-header">
        <div className={`dash-header__container ${dashClass}`}>
          {(!isAdmin) && <Link to="/dash/materials">
            <h1 className="dash-header__title"> <FontAwesomeIcon icon={faCrosshairs} /> ReadyAimFluent </h1>
          </Link>}
          {(isAdmin) && <Link to="/dash">
            <h1 className="dash-header__title"> <FontAwesomeIcon icon={faCrosshairs} /> ReadyAimFluent</h1>
          </Link>}
          <div className="dash-header__welcome">Welcome back, {username}!</div>
          <nav className="dash-header__nav">{buttonContent}</nav>
        </div>
      </header>
    </>
  );

  return content;
};

export default DashHeader;
