import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <>
   <div className="sidebar pe-4 pb-3">
  <nav className="navbar bg-light navbar-light">
    <a href="index-2.html" className="navbar-brand mx-4 mb-3">
      <h3 className="text-primary">
        <i className="fa fa-hashtag me-2" />
        DASHBOARD
      </h3>
    </a>
    <div className="d-flex align-items-center ms-4 mb-4">
      <div className="position-relative">
        <img
          className="rounded-circle"
          src="img/user.jpg"
          alt=""
          style={{ width: 40, height: 40 }}
        />
        <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1" />
      </div>
      <div className="ms-3">
        <h6 className="mb-0">Jhon Doe</h6>
        <span>Admin</span>
      </div>
    </div>
    <div className="navbar-nav w-100">
      <Link to={"/userroles"} className="nav-item nav-link">
      <i class='bx bxs-user-circle'></i>
        Loại Tài khoản
      </Link>
      <Link to={"/users"} className="nav-item nav-link">
      <i class='bx bxs-user-circle'></i>
        Tài khoản
      </Link>
      <Link to={"/education"} className="nav-item nav-link">
        <i className="fa fa-keyboard me-2" />
        Loại hình giáo dục
      </Link>
      <a href="table.html" className="nav-item nav-link">
        <i className="fa fa-table me-2" />
        Tables
      </a>
      <a href="chart.html" className="nav-item nav-link">
        <i className="fa fa-chart-bar me-2" />
        Charts
      </a>
      <div className="nav-item dropdown">
        <a
          href="#"
          className="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
        >
          <i className="far fa-file-alt me-2" />
          Pages
        </a>
        <div className="dropdown-menu bg-transparent border-0">
          <a href="signin.html" className="dropdown-item">
            Sign In
          </a>
          <a href="signup.html" className="dropdown-item">
            Sign Up
          </a>
          <a href="404.html" className="dropdown-item">
            404 Error
          </a>
          <a href="blank.html" className="dropdown-item">
            Blank Page
          </a>
        </div>
      </div>
    </div>
  </nav>
</div>

    </>
  )
}

export default Sidebar