import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Sidebar(props) {
  const logout=()=>{
    if(localStorage.getItem('email')){
      localStorage.removeItem('email');

    }
    window.location.replace('/')
  }
  const [email,setEmail]= useState('');
  useEffect(()=>{
    if(!localStorage.getItem('email')||localStorage.getItem('email')==undefined){
      window.location.replace('/');
    }else{

    }
  },[])
  return (
    <>
   <div className={`sidebar pe-4 pb-3 ${props.show==true?'open':''}`}>
  <nav className="navbar bg-light navbar-light">
    <a href="#" className="navbar-brand mx-4 mb-3">
      <h3 className="text-primary">
        <i className="fa fa-hashtag me-2" />
        DASHBOARD
      </h3>
    </a>
    <div className="d-flex align-items-center ms-4 mb-4">
      <div className="position-relative">
        <img
          className="rounded-circle"
          src="https://cdn-icons-png.flaticon.com/512/2304/2304226.png"
          alt=""
          style={{ width: 40, height: 40 }}
        />
        <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1" />
      </div>
      <div className="ms-3">
        <span>Admin</span>
      </div>
    </div>
    <div className="navbar-nav w-100">
      <Link to={"/userroles"} className="nav-item nav-link">
      <i className='bx bxs-user-circle'></i>
        Loại Tài khoản
      </Link>
      <Link to={"/users"} className="nav-item nav-link">
      <i className='bx bxs-user-circle'></i>
        Tài khoản
      </Link>
      <Link to={"/education"} style={{'fontSize':'17px'}} className="nav-item nav-link">
      <i className='bx bxl-meta me-2'></i>
        Loại hình giáo dục
      </Link>
      <Link to={"/calendar"} style={{'fontSize':'17px'}} className="nav-item nav-link">
      <i className='bx bxs-calendar'></i>
        Lịch giảng dạy
      </Link>
      <Link to={"/runningclass"} style={{'fontSize':'17px'}} className="nav-item nav-link">
      <i className='bx bx-cylinder'></i>
        Danh sách lớp
      </Link>
      <Link to={"/bills"} style={{'fontSize':'17px'}} className="nav-item nav-link">
      <i className='bx bx-cylinder'></i>
        Hoá đơn
      </Link>

      <a href="#" onClick={(e)=>logout()} className="nav-item nav-link">
        <i className='bx bx-log-out me-2'></i>
        Log out
      </a>
      
    </div>
  </nav>
</div>

    </>
  )
}

export default Sidebar