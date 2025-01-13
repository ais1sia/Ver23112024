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
import NewUserForm from "./features/users/NewUserForm"
import UsersList from "./features/users/UsersList"
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="materials">
                  <Route index element={<MaterialsList />} />
                  <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                    <Route path=":id" element={<EditMaterial />} />
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
