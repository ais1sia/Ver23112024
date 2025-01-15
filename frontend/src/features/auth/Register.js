import { useRegisterMutation } from "./authApiSlice";
import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";
import { GOALS } from "../../config/goals";
import { LEVELS } from "../../config/levels";
import CustomGoalSelector from "../../config/CustomGoalSelector";

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  // Define states for form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [level, setLevel] = useState("A1"); // Default value for level
  const [roles, setRoles] = useState(["User"]); // Default role
  const [goals, setGoals] = useState(["general"]); // Default goal
  const [isActive, setIsActive] = useState(true); // Default to active
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register({
        username,
        password,
        email,
        firstname,
        lastname,
        level,
        isActive,
        roles,
        goals,
      }).unwrap();
      console.log("User registered successfully:", response);
      navigate("/login");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Fill all the fields!");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      if (errRef.current) {
        errRef.current.focus();
      }
    }
  };

  const roleOptions = Object.values(ROLES).map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ));

  const levelOptions = Object.values(LEVELS).map((level) => (
    <option key={level} value={level}>
      {level}
    </option>
  ));

  // const goalOptions = Object.values(GOALS).map((goal) => (
  //   <option key={goal} value={goal}>
  //     {goal}
  //   </option>
  // ));

  const goalOptions = Object.values(GOALS).map((goal) => goal)

  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) return <PulseLoader color={"#FFF"} />;
  const content = (
    <section className="public">
      <header>
        <h1>User Registration</h1>
      </header>
      <main className="register">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form__title-row">
            <h2>New User</h2>
            <div className="form__action-buttons">
              <button className="icon-button" title="Register">
                <FontAwesomeIcon icon={faSave} />
              </button>
            </div>
          </div>

          <label className="form__label" htmlFor="username">
            Username: <span className="nowrap">[3-20 letters]</span>
          </label>
          <input
            className="form__input"
            id="username"
            name="username"
            type="text"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            ref={userRef}
            required
          />

          <label className="form__label" htmlFor="password">
            Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
          </label>
          <input
            className="form__input"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="form__label" htmlFor="email">
            Email:
          </label>
          <input
            className="form__input"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="form__label" htmlFor="firstname">
            First Name:
          </label>
          <input
            className="form__input"
            id="firstname"
            name="firstname"
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />

          <label className="form__label" htmlFor="lastname">
            Last Name:
          </label>
          <input
            className="form__input"
            id="lastname"
            name="lastname"
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />

          <label className="form__label" htmlFor="level">
            Level:
          </label>
          <select
            id="level"
            name="level"
            className="form__select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          >
            {levelOptions}
          </select>

          <label
            className="form__label form__checkbox-container"
            htmlFor="user-isActive"
          >
            ACTIVE:
            <input
              className="form__checkbox"
              id="user-isActive"
              name="user-isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </label>

          <label className="form__label" htmlFor="roles">
            ASSIGNED ROLES:
          </label>
          <select
            id="roles"
            name="roles"
            className="form__select"
            multiple={true}
            size="3"
            value={roles}
            onChange={(e) =>
              setRoles(Array.from(e.target.selectedOptions, (option) => option.value))
            }
            required
          >
            {roleOptions}
          </select>
            {/* CUSTOM GOAL SELECTOR */}
          <label className="form__label" htmlFor="goals">
            GOALS:
          </label>
          <CustomGoalSelector
            goalOptions={goalOptions}   // Passing the goal options
            selectedGoals={goals}        // Passing selected goals state
            setGoals={setGoals}          // Passing the state setter function
          />
          {/* <label className="form__label" htmlFor="goals">
            GOALS:
          </label>
          <select
            id="goals"
            name="goals"
            className="form__select"
            multiple={true}
            size="3"
            value={goals}
            onChange={(e) =>
              setGoals(Array.from(e.target.selectedOptions, (option) => option.value))
            }
            required
          >
            {goalOptions}
          </select> */}
        </form>
      </main>
      <footer>
        <Link to="/login">Back to Login</Link>
      </footer>
    </section>
  );

  return content;
};

export default Register;
