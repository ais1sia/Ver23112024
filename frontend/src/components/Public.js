import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../features/auth/authApiSlice"
import { setCredentials } from "../features/auth/authSlice";
import usePersist from "../hooks/usePersist";


const Public = (props) => {
  const {
    title = "Welcome to",
    subtitle = "ReadyAimFluent!"
  } = props;

  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();


  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dash/materials");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message || "Login Failed");
      }
      errRef.current?.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleJoinNow = () => navigate("/register");
  const handleToggle = () => setPersist((prev) => !prev);


  return (
    <div className="login-container">
      <div className="login-form">
        <h1>{title}</h1>
        <h1>{subtitle}</h1>

        {errMsg && (
          <p ref={errRef} className="errmsg" aria-live="assertive">
            {errMsg}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={handleUserInput}
              ref={userRef}
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="************"
              value={password}
              onChange={handlePwdInput}
              required
            />
          </div>
          <div>
          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
            Trust This Device
          </label>
          </div>

          <button className="sign-up-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Signing In..." : "SIGN UP"}
          </button>
        </form>

        <div className="divider">or</div>

        <button className="final-submit-btn" onClick={handleJoinNow}>
          JOIN NOW
        </button>
      </div>
    </div>
  );
};

export default Public;
