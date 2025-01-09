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

    // State variables for existing and new fields
    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [isActive, setIsActive] = useState(true)  // assuming true by default
    const [roles, setRoles] = useState(["User"])

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
            setFirstName('')
            setLastName('')
            setRoles(["User"])
            setIsActive(true)
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)
    const onFirstNameChanged = e => setFirstName(e.target.value)
    const onLastNameChanged = e => setLastName(e.target.value)
    const onIsActiveChanged = e => setIsActive(e.target.checked)

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }

    const canSave = [
        roles.length, validUsername, validPassword, validEmail, firstName, lastName
    ].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({ username, password, email, firstName, lastName, isActive, roles })
        }
    }

    const options = Object.values(ROLES).map(role => (
        <option key={role} value={role}> {role}</option>
    ))

    const errClass = isError ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
    const validEmailClass = !validEmail ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

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

                <label className="form__label" htmlFor="firstName">
                    First Name:</label>
                <input
                    className="form__input"
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={onFirstNameChanged}
                />

                <label className="form__label" htmlFor="lastName">
                    Last Name:</label>
                <input
                    className="form__input"
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={onLastNameChanged}
                />

                <label className="form__label" htmlFor="isActive">
                    Active User:</label>
                <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={isActive}
                    onChange={onIsActiveChanged}
                />

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
                    {options}
                </select>
            </form>
        </>
    )
}

export default NewUserForm