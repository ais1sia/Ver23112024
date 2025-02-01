import { useState } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
//import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"
import { GOALS } from "../../config/goals"
import { LEVELS } from "../../config/levels"
import PulseLoader from 'react-spinners/PulseLoader'
import CustomSelector from '../../config/CustomSelector'
import useAuth from "../../hooks/useAuth"

const EditUserForm = ({ user }) => {
    const { userId, roles: userRoles } = useAuth();
    const isAdmin = userRoles.includes("Admin");

    //const [updateUser, { isLoading, isSuccess }] = useUpdateUserMutation();
    //const [deleteUser, { isSuccess: isDelSuccess }] = useDeleteUserMutation();
    const [updateUser, { isLoading}] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

   // const navigate = useNavigate();

    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [firstname, setFirstname] = useState(user.firstname)
    const [lastname, setLastname] = useState(user.lastname)
    const [password, setPassword] = useState('')
    const [level, setLevel] = useState(user.level)
    const [roles, setRoles] = useState(user.roles)
    const [goals, setGoals] = useState(user.goals)
    const [isActive, setIsActive] = useState(user.isActive)

    const goalOptions = Object.values(GOALS).map((goal) => goal)

        const levelOptions = Object.values(LEVELS).map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))

    const onSaveUserClicked = async (e) => {
        e.preventDefault()

        const updatedFields = {}
        
        updatedFields.id = userId;

        if (username !== user.username) updatedFields.username = username;
        if (email !== user.email) updatedFields.email = email;
        if (firstname !== user.firstname) updatedFields.firstname = firstname;
        if (lastname !== user.lastname) updatedFields.lastname = lastname;
        if (password) updatedFields.password = password;
        if (level !== user.level) updatedFields.level = level;
        if (JSON.stringify(goals) !== JSON.stringify(user.goals)) updatedFields.goals = goals;

        if (isAdmin) {
            if (JSON.stringify(roles) !== JSON.stringify(user.roles)) updatedFields.roles = roles;
            if (isActive !== user.isActive) updatedFields.isActive = isActive;
        }

        if (Object.keys(updatedFields).length === 0) {
            console.log("No changes detected.")
            return
        }

        await updateUser(updatedFields)
    }

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id });
    }

    if (isLoading) {
        return <PulseLoader color={"#FFF"} />
    }

    return (
        <form className="form" onSubmit={onSaveUserClicked}>
            <div className="form__title-row">
                <h2>Edit Personal Data</h2>
            </div>

            <label className="form__label">Username:</label>
            <input className="form__input" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            />

            <label className="form__label">Email:</label>
            <input className="form__input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            />

            <label className="form__label">First Name:</label>
            <input className="form__input" 
            value={firstname} 
            onChange={(e) => setFirstname(e.target.value)} 
            />

            <label className="form__label">Last Name:</label>
            <input className="form__input" 
            value={lastname} 
            onChange={(e) => setLastname(e.target.value)} 
            />

            <label className="form__label">Password:</label>
            <input className="form__input" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
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
          >
            {levelOptions}
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

            {isAdmin && (
                <>
                    <label className="form__label">Roles:</label>
                    <select className="form__select" multiple value={roles} onChange={(e) => setRoles([...e.target.selectedOptions].map(o => o.value))}>
                        {Object.values(ROLES).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>

                    <label className="form__checkbox-container">Active:
                        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                    </label>
                </>
            )}
            <div className="form__action-buttons">
                    <button className="form__submit-button" title="Save">Save changes
                    </button>
                    {isAdmin && (
                        <button className="icon-button" title="Delete" onClick={onDeleteUserClicked} type="button">
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    )}
                </div>
        </form>
    );
};

export default EditUserForm;
