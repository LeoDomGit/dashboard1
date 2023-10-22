import { BrowserRouter, Route, Routes } from "react-router-dom";
import Users from "./pages/Users";
import UserRoles from "./pages/UserRoles";
import Education from "./pages/Education";
import SingleEdu from "./pages/SingleEdu";

function App() {
  return (
    <div className="container-xxl position-relative d-flex p-0">
      <BrowserRouter>
      <Routes>
        <Route path="/userroles" element={<UserRoles/>}/>
        <Route path="/users" element={<Users/>}/>
        <Route path="/education" element={<Education/>}/>
        <Route path="/education/:id" element={<SingleEdu/>}/>

      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
