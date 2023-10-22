import React, { useEffect, useState } from 'react'
import "../css/login.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Swal from "sweetalert2";
function Login() {
    const [user, setUser] = useState([]);
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1700,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const url = "https://api.trungthanhweb.com/api/";
  const checkEmail = (e) => {
    if (e.match(/(.+)@(gmail+)\.(com)/i)) {
      setEmail(e);
    }
  };
  const submitLogin = () => {
    if (email != "" && password != "") {
      axios({
        method: "post",
        url: url + "checkLogin",
        data: {
          email: email,
          password: password,
        },
      }).then((res) => {
        if (res.data.check == true) {
          Toast.fire({
            icon: "success",
            title: "Đăng nhập thành công",
          }).then(() => {
            localStorage.setItem("token", res.data.token);
            window.location.replace("/edu");
          });
        } else if (res.data.check == false) {
          if (res.data.msg.email) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.email,
            });
          } else if (res.data.msg.password) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.password,
            });
          } else if (res.data.msg) {
            Toast.fire({
              icon: "error",
              title: res.data.msg,
            });
          }
        }
      });
    } else {
      console.log(email, password);
      Toast.fire({
        icon: "error",
        title: "Chưa nhập đủ thông tin tài khoản",
      });
    }
  };
  useEffect(() => {
    localStorage.removeItem("email");
  });
  useEffect(() => {
    if (user && user.length!=0) {
      axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          })
          .then((res) => {
              var email = res.data.email;
              console.log(email);
              axios.post(url + "checkAdmin", {
                  email: email,
                })
                .then((res) => {
                  if(res.data.check==true){
                    localStorage.setItem('email',email);
                    window.location.replace('/education');
                  }else{
                    Toast.fire({
                      icon: "error",
                      title: "Vui lòng đăng nhập bằng tài khoản admin",
                    });
                  }
                 
                });
          })
          .catch((err) => console.log(err));
  }
},
[ user ]);
  return (
    <>
    <section className="ftco-section">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-md-6 text-center mb-5"></div>
    </div>
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-5">
        <div className="login-wrap p-4 p-md-5">
          <div className="icon d-flex align-items-center justify-content-center">
            <i className='bx bx-user-circle text-light' ></i>
          </div>
          <h3 className="text-center mb-4">Sign In</h3>
          <div className="login-form">
            <div className="form-group">
              <input
                type="text"
                className="form-control rounded-left"
                placeholder="Email"
                onChange={(e) => checkEmail(e.target.value)}
                required=""
              />
            </div>
            <div className="form-group d-flex">
              <input
                type="password"
                className="form-control rounded-left"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required=""
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="form-control btn btn-primary rounded submit px-3"
                onClick={() => submitLogin()}
              >
                Login
              </button>
            </div>
          </div>
          <div className="row w-100">
                <div className="col-md text-center">
            <button className="ms-4 btn btn-warning rounded"  onClick={() => login()}> <i className='bx bxl-gmail' ></i> Gmail</button>

                </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    </>
  )
}

export default Login