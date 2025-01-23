import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"
import { GOALS } from "../../config/goals"
import { LEVELS } from "../../config/levels"
import PulseLoader from 'react-spinners/PulseLoader'
import CustomSelector from '../../config/CustomSelector'

const USER_REGEX = /^[A-z0-9!@#$%]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EditUserForm = ({ user }) => {
    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [level, setLevel] = useState(user.level)
    const [roles, setRoles] = useState(user.roles)
    const [goals, setGoals] = useState(user.goals)
    const [isActive, setIsActive] = useState(user.isActive)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email])

    useEffect(() => {
        setValidPassword(password === '' || PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setUsername('')
            setEmail('')
            setFirstname('')
            setLastname('')
            setPassword('')
            setLevel('')
            setRoles([])
            setGoals([])
            navigate('/dash/users')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)
    const onFirstnameChanged = e => setFirstname(e.target.value)
    const onLastnameChanged = e => setLastname(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onLevelChanged = e => setLevel(e.target.value)
    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }
    // const onGoalsChanged = e => {
    //     const values = Array.from(
    //         e.target.selectedOptions,
    //         (option) => option.value
    //     )
    //     setGoals(values)
    // }
    const onIsActiveChanged = (e) => setIsActive(e.target.value)

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        //DEBUG SHIT
        console.log("isActive:", isActive)
        await updateUser({ id: user.id, username, email, firstname, lastname, password, level, roles, goals, isActive })
        console.log("Payload:", { id: user.id, username, email, firstname, lastname, password, level, roles, goals, isActive });
    }

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    //DEBUG SHIT:
    useEffect(() => {
        console.log("isActive updated value:", isActive);
    }, [isActive]);

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}
            > {role}</option >
        )
    })

    const goalOptions = Object.values(GOALS).map((goal) => goal)

    const levelOptions = Object.values(LEVELS).map((level) => (
        <option key={level} value={level}>
          {level}
        </option>
      ))

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validEmailClass = !validEmail ? 'form__input--incomplete' : ''
    const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''
    // const validGoalsClass = !Boolean(goals.length) ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    if (isLoading) {
        return <PulseLoader color={"#FFF"} />
    }

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteUserClicked}
                            type="button"
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
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

                <label className="form__label" htmlFor="email">
                    Email:</label>
                <input
                    className={`form__input ${validEmailClass}`}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
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
                    autoComplete="off"
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
                    autoComplete="off"
                    value={lastname}
                    onChange={onLastnameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

<label className="form__label" htmlFor="level">
            Level:
          </label>
          <select
            id="level"
            name="level"
            className="form__select"
            value={level}
            onChange={onLevelChanged}
            required
          >
            {levelOptions}
          </select>

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
                {/* CUSTOM GOAL SELECTOR */}
                <label className="form__label" htmlFor="goals">
                    GOALS:
                </label>
                <CustomSelector
                    options={goalOptions}
                    selectedOptions={goals}
                    setOptions={setGoals}
                />

                <label className="form__label form__checkbox-container" htmlFor="user-isActive">
                    ACTIVE:
                    <input
                        className="form__checkbox"
                        id="user-isActive"
                        name="user-isActive"
                        type="checkbox"
                        checked={isActive}
                        onChange={onIsActiveChanged}
                    />
                </label>        
            </form>
        </>
    )

    return content
}

export default EditUserForm

