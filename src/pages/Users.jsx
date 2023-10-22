import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Swal from "sweetalert2";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Loader from "../components/Loading.jsx/Loader";
function Users() {
  const url = "https://api.trungthanhweb.com/api/";
  const [activeRoles, setActiveRoles] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show2, setShow2] = useState(false);
  //=================================
  const [username, setUsername] = useState("");
  const [idUsEdit, setIdUsEdit] = useState(0);
  const [email, setUseremail] = useState("");
  const [idRole, setidRole] = useState(0);
  const [users, setUsers] = useState([]);
  const [usernameedit, setUsernameedit] = useState("");
  const [emailedit, setUseremailedit] = useState("");
  const handleClose2 = () => setShow2(false);
  const [idRoleedit, setidRoleedit] = useState(0);
  //==================================
  const checkEmail = (e) => {
    if (e.match(/(.+)@(gmail+)\.(com)/i) || e.match(/(.+)@(.+)\.(edu.vn)/i)) {
      setUseremail(e);
    }
  };

  const checkEmailEdit = (e) => {
    if (e.match(/(.+)@(gmail+)\.(com)/i) || e.match(/(.+)@(.+)\.(edu.vn)/i)) {
      setUseremailedit(e);
    }
  };

  //==================================
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  // =========================================
  const submitNewUser = () => {
    if (username == "" || email == "" || idRole == 0) {
      Toast.fire({
        icon: "error",
        title: "Thiếu thông tin tài khoản",
      });
    } else {
      handleClose();
      setLoading(true);
      axios({
        method: "post",
        url: url + "users",
        data: {
          username: username,
          email: email,
          idRole: idRole,
        },
      }).then((res) => {
        if (res.data.check == true) {
          Toast.fire({
            icon: "success",
            title: "Đã thêm tài khoản",
          });
          setUsers(res.data.users);
          setLoading(false);
          setUseremail("");
          setUsername("");
          setidRole(0);
          console.log(users);
          console.log(res.data.users);
        } else if (res.data.check == false) {
          setLoading(false);
          if (res.data.msg.username) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.username,
            });
          } else if (res.data.msg.email) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.email,
            });
          } else if (res.data.msg.idRole) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.idRole,
            });
          }
        }
      });
    }
  };
  //   =========================================
  const deleteUser = (id) => {
    Swal.fire({
        icon:'question',
        text: "Bạn muốn xoá tài khoản này ?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Đúng",
        denyButtonText: `Không`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        fetch(url+'deleteUser?id='+id).then(res=>res.json()).then((res)=>{
            if(res.check==true){
                Toast.fire({
                    icon: 'success',
                    title: 'Đã xoá tài khoản'
                  })
                  setUsers(res.users);
            }else if(res.check==false){
                if(res.msg.id){
                    Toast.fire({
                        icon: 'error',
                        title: res.msg.id
                      })
                }else if(res.msg){
                    Toast.fire({
                        icon: 'error',
                        title: res.msg
                      })   
                }
            }
        })
      } else if (result.isDenied) {
      }
    });
  };
  // =========================================
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
  const editUser = (id, name, email, idRole) => {
    setIdUsEdit(id);
    setUsernameedit(name);
    setUseremailedit(email);
    setidRoleedit(idRole);
    setShow2(true);
  };
  const switchUser = (id) => {
    axios({
      method: "post",
      url: url + "switchUser",
      data: {
        id: id,
      },
    }).then((res) => {
      setUsers(res.data);
    });
  };
  const submitEditUser = () => {
    if (
      usernameedit == "" ||
      emailedit == "" ||
      idRoleedit == 0 ||
      idUsEdit == 0
    ) {
      Toast.fire({
        icon: "error",
        title: "Thiếu thông tin tài khoản",
      });
    } else {
      handleClose2();
      setLoading(true);
      axios({
        method: "post",
        url: url + "editUser",
        data: {
          id: idUsEdit,
          username: usernameedit,
          email: emailedit,
          idRole: idRoleedit,
        },
      }).then((res) => {
        if (res.data.check == true) {
          Toast.fire({
            icon: "success",
            title: "Đã sửa tài khoản",
          });
          setIdUsEdit(0);
          setUsernameedit("");
          setUseremailedit("");
          setidRoleedit(0);
          setShow2(false);
          setLoading(false);
          setUsers(res.data.users);
          //   console.log(res.data.users);
        } else if (res.data.check == false) {
          setLoading(false);
          if (res.data.msg.username) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.username,
            });
          } else if (res.data.msg.email) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.email,
            });
          } else if (res.data.msg.idRole) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.idRole,
            });
          }
        }
      });
    }
  };
  useEffect(() => {
    axios({
      method: "get",
      url: url + "role",
    }).then((res) => {
      var arr = [];
      res.data.forEach((el) => {
        if (el.status == 1) {
          arr.push(el);
        }
      });
      setActiveRoles(arr);
    });
    axios({
      method: "get",
      url: url + "users",
    }).then((res) => {
      setUsers(res.data);
    });
  }, []);
  return (
    <>
      <Sidebar />
      <div classname="content">
        {loading && <Loader />}
        <nav className="navbar navbar-expand sticky-top px-4 py-0 mt-3">
          <button className="btn btn-primary" onClick={(e) => setShow(true)}>
            Thêm
          </button>
        </nav>
        {/* ==========================Modal Tài khoản================================= */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>Tài khoản Modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md">
                <input
                  type="text"
                  placeholder="Tên tài khoản"
                  onChange={(e) => setUsername(e.target.value)}
                  className={`form-control ${
                    username == "" ? "border border-danger" : ""
                  }`}
                />
                <input
                  type="text"
                  placeholder="Email"
                  onChange={(e) => checkEmail(e.target.value)}
                  className={`form-control mt-3 ${
                    email == "" ? "border border-danger" : ""
                  }`}
                />
                <select
                  name=""
                  className="form-control mt-3"
                  onChange={(e) => setidRole(e.target.value)}
                  value={idRole}
                >
                  <option value="0" selected disabled>
                    Chọn loại tài khoản
                  </option>
                  {activeRoles &&
                    activeRoles.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={submitNewUser}>
              Lưu
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={show2} onHide={handleClose2}>
          <Modal.Header closeButton>
            <Modal.Title>Modal Chỉnh sửa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md">
                <input
                  type="text"
                  placeholder="Tên tài khoản"
                  value={usernameedit}
                  onChange={(e) => setUsernameedit(e.target.value)}
                  className={`form-control ${
                    usernameedit == "" ? "border border-danger" : ""
                  }`}
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={emailedit}
                  onChange={(e) => checkEmailEdit(e.target.value)}
                  className={`form-control mt-3 ${
                    emailedit == "" ? "border border-danger" : ""
                  }`}
                />
                <select
                  name=""
                  className="form-control mt-3"
                  onChange={(e) => setidRoleedit(e.target.value)}
                  value={idRoleedit}
                >
                  <option value="0" selected disabled>
                    Chọn loại tài khoản
                  </option>
                  {activeRoles &&
                    activeRoles.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose2}>
              Đóng
            </Button>
            <Button variant="primary" onClick={submitEditUser}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="row mt-3">
          {users && users.length > 0 && (
            <div className="col-md">
              <div className="table-responsive">
                <table className="table table-primary">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Loại tài khoản</th>
                      <th>Trạng thái</th>
                      <th>Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, index) => (
                      <tr key={item.id} className="">
                        <td>
                          <span className="edit">{++index}</span>
                        </td>
                        <td>
                          <span className="edit">{item.name}</span>
                        </td>
                        <td>
                          <span className="edit">{item.email}</span>
                        </td>
                        <td>
                          <span className="edit">{item.rolename}</span>
                        </td>
                        <td>
                          {item.status == 0 ? (
                            <b
                              style={{ cursor: "pointer" }}
                              className="edit"
                              onClick={() => switchUser(item.id)}
                            >
                              Đang đóng
                            </b>
                          ) : (
                            <b
                              style={{ cursor: "pointer" }}
                              className="edit"
                              onClick={() => switchUser(item.id)}
                            >
                              Đang mở
                            </b>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={(e) => deleteUser(item.id)}
                          >
                            Xóa
                          </button>
                          <button
                            className="ms-3 btn btn-warning btn-sm"
                            onClick={(e) =>
                              editUser(
                                item.id,
                                item.name,
                                item.email,
                                item.idRole
                              )
                            }
                          >
                            Sửa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Users;
