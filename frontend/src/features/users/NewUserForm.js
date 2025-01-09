import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

const NewUserForm = () => {
    const [addNewUser, { isLoading, isSuccess, isError, error }] = useAddNewUserMutation()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [level, setLevel] = useState('beginner')
    const [roles, setRoles] = useState(["User"])
    const [goals, setGoals] = useState(["general"])
    const [isActive, setIsActive] = useState(true)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email])

    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            setEmail('')
            setFirstname('')
            setLastname('')
            setLevel('beginner')
            setRoles(["User"])
            setGoals(["general"])
            setIsActive(true)
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)
    const onFirstnameChanged = e => setFirstname(e.target.value)
    const onLastnameChanged = e => setLastname(e.target.value)
    const onLevelChanged = e => setLevel(e.target.value)
    const onIsActiveChanged = e => setIsActive(e.target.checked)

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }

    const onGoalsChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setGoals(values)
    }

    const canSave = [
        roles.length, goals.length, validUsername, validPassword, validEmail, firstname, lastname
    ].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        console.log("Saving user...", { username, password, email, firstname, lastname, level, isActive, roles, goals });
        if (canSave) {
            try {
                const response = await addNewUser({ username, password, email, firstname, lastname, level, isActive, roles, goals });
                console.log("User created successfully:", response);
            } catch (err) {
                console.error("Failed to create user:", err);
            }
        } else {
            console.warn("Cannot save user. Check validation or state.");
        }
    }

    const roleOptions = Object.values(ROLES).map(role => (
        <option key={role} value={role}>{role}</option>
    ))

    const goalOptions = ["general", "business", "technical", "vacation", "military", "exam"].map(goal => (
        <option key={goal} value={goal}>{goal}</option>
    ))

    const errClass = isError ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
    const validEmailClass = !validEmail ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''
    const validGoalsClass = !Boolean(goals.length) ? 'form__input--incomplete' : ''

    return (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>New User</h2>
                    <div className="form__action-buttons">
                        <button className="icon-button" title="Save" disabled={!canSave}>
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>

                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label" htmlFor="email">
                    Email:</label>
                <input
                    className={`form__input ${validEmailClass}`}
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={onEmailChanged}
                />

                <label className="form__label" htmlFor="firstname">
                    First Name:</label>
                <input
                    className="form__input"
                    id="firstname"
                    name="firstname"
                    type="text"
                    value={firstname}
                    onChange={onFirstnameChanged}
                />

                <label className="form__label" htmlFor="lastname">
                    Last Name:</label>
                <input
                    className="form__input"
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={lastname}
                    onChange={onLastnameChanged}
                />

                <label className="form__label" htmlFor="level">
                    Level:</label>
                <select
                    id="level"
                    name="level"
                    className="form__select"
                    value={level}
                    onChange={onLevelChanged}
                >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                </select>

                <label className="form__label form__checkbox-container" htmlFor="user-active">
                    ACTIVE:
                    <input
                        className="form__checkbox"
                        id="user-active"
                        name="user-active"
                        type="checkbox"
                        checked={isActive}
                        onChange={onIsActiveChanged}
                    />
                </label>

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:</label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple={true}
                    size="3"
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {roleOptions}
                </select>

                <label className="form__label" htmlFor="goals">
                    GOALS:</label>
                <select
                    id="goals"
                    name="goals"
                    className={`form__select ${validGoalsClass}`}
                    multiple={true}
                    size="3"
                    value={goals}
                    onChange={onGoalsChanged}
                >
                    {goalOptions}
                </select>
            </form>
        </>
    )
}

export default NewUserForm

