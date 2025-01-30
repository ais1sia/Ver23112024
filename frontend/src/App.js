import DashLayout from "./components/DashLayout"
import Layout from "./components/Layout"
import Public from "./components/Public"
import { ROLES } from "./config/roles"
import Login from "./features/auth/Login"
import PersistLogin from "./features/auth/PersistLogin"
import Prefetch from "./features/auth/Prefetch"
import RequireAuth from "./features/auth/RequireAuth"
import Welcome from "./features/auth/Welcome"
import EditMaterial from "./features/materials/EditMaterial"
import MaterialsList from "./features/materials/MaterialsList"
import NewMaterial from "./features/materials/NewMaterial"
import EditUser from "./features/users/EditUser"
import Register from "./features/auth/Register"
import UsersList from "./features/users/UsersList"
import { Routes, Route } from "react-router-dom"
import useTitle from "./hooks/useTitle"
import ViewMaterial from "./features/materials/ViewMaterial"
import Account from "./features/users/Account"

function App() {
  useTitle('ReadyAimFluent')
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
            <Route path="/account" element={<Account />} />
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                  </Route>
                </Route>

                <Route path="materials">
                  <Route index element={<MaterialsList />} />
                  <Route path=":id" element={<ViewMaterial />} />
                  <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                    <Route path="edit/:id" element={<EditMaterial />} />
                    <Route path="new" element={<NewMaterial />} />
                  </Route>
                </Route>
              </Route>
              {/* End Dash */}
            </Route>
          </Route>
        </Route>
        {/* end protected routes */}
      </Route>
    </Routes>
  );
}

export default App;
