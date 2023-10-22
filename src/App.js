import { BrowserRouter, Route, Routes } from "react-router-dom";
import Users from "./pages/Users";
import UserRoles from "./pages/UserRoles";

function App() {
  return (
    <div className="container-xxl p-0">
      <BrowserRouter>
      <Routes>
        <Route path="/userroles" element={<UserRoles/>}/>
        <Route path="/users" element={<Users/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
