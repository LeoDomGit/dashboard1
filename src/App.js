import { BrowserRouter, Route, Routes } from "react-router-dom";
import Users from "./pages/Users";
import UserRoles from "./pages/UserRoles";
import Education from "./pages/Education";
import SingleEdu from "./pages/SingleEdu";
import SingleCateCourse from "./pages/SingleCateCourse";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import EditCourse from "./pages/EditCourse";
import BillPage from "./pages/BillPage";
import Schedules from "./pages/Schedules";
import SingleCourse from "./pages/SingleCourse";
import Login from "./pages/Login";
function App() {
  return (
    <div className="container-xxl position-relative p-0">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/userroles" element={<UserRoles />} />
          <Route path="/users" element={<Users />} />
          <Route path="/education" element={<Education />} />
          <Route path="/education/:id" element={<SingleEdu />} />
          <Route path="/course/:id" element={<SingleCateCourse />} />
          <Route path="/edit/:id" element={<EditCourse />} />
          <Route path="/single/:id" element={<SingleCourse/>}/>
          {/*  */}
          <Route path="/bills" element={<BillPage />} />
          {/*  */}
          <Route path="/schedules" element={<Schedules />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
