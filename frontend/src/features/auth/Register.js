import { useRegisterMutation } from "./authApiSlice";
import { useRef, useState, useEffect } from "react";
import { useNavigate, /*Link*/ } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { GOALS } from "../../config/goals";
import { LEVELS } from "../../config/levels";
import { LANGUAGES } from "../../config/languages";
import CustomSelector from "../../config/CustomSelector";
import DashFooter from "../../components/DashFooter";

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  // Define states for form fields
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [language, setLanguage] = useState("English")
  const [level, setLevel] = useState("A1")
  const [goals, setGoals] = useState(["general"])
  const [errMsg, setErrMsg] = useState("")

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
        language,
        level,
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

  const levelOptions = Object.values(LEVELS).map((level) => (
    <option key={level} value={level}>
      {level}
    </option>
  ))
  const languageOptions = Object.values(LANGUAGES).map((language) => (
    <option key={language} value={language}>
      {language}
    </option>
  ))

  const goalOptions = Object.values(GOALS).map((goal) => goal)

  const errClass = errMsg ? "errmsg" : "offscreen";
  // NEW USER FORM HERE
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
          </div>

          <label className="form__label" htmlFor="username">
            Username: <span className="nowrap">[min. 3 letters]</span>
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
            Password: <span className="nowrap">[must incl. !@#$%]</span>
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

          <label className="form__label" htmlFor="language">
            Choose language to learn:
          </label>
          <select
            id="language"
            name="language"
            className="form__select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
          >
            {languageOptions}
          </select>

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

          <label className="form__label" htmlFor="goals">
            Goals:
            <p><i> Note: You can add more goals anytime.</i></p>
          </label>
          <CustomSelector
            options={goalOptions}
            selectedOptions={goals}
            setOptions={setGoals}
            multiChoice={true}
          />
          <button className="final-submit-btn" title="SIGN IN">
            SIGN IN
          </button>
        </form>

      </main>
      {/* <p><Link to="/">Back to Home</Link></p>
      <p><Link to="/login">Sign up</Link></p> */}
      <DashFooter />
    </section>
  );

  return content;
};

export default Register;
