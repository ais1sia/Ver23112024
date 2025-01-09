import DashLayout from "./components/DashLayout";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import Prefetch from "./features/auth/Prefetch";
import Welcome from "./features/auth/Welcome";
import EditMaterial from "./features/materials/EditMaterial";
import MaterialsList from "./features/materials/MaterialsList";
import NewMaterial from "./features/materials/NewMaterial";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import UsersList from "./features/users/UsersList";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} /> {/* localhost:3000/login*/}

        <Route element={<Prefetch />}>
          <Route path="dash" element={<DashLayout />}>
            {/* localhost:3000/dash*/}
            <Route index element={<Welcome />} />

            <Route path="users">
              <Route index element={<UsersList />} />
              {/* localhost:3000/dash/users*/}
              <Route path=":id" element={<EditUser />} />
              <Route path="new" element={<NewUserForm />} />
            </Route>

            <Route path="materials">
              <Route index element={<MaterialsList />} />
              {/* localhost:3000/dash/materials*/}
              <Route path=":id" element={<EditMaterial />} />
              <Route path="new" element={<NewMaterial />} />
            </Route>

          </Route>
        </Route>
      </Route>

      {/* End dash */}
    </Routes>
  );
}

export default App;
