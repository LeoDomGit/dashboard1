import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Swal from "sweetalert2";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
function UserRoles() {
  const url = "https://api.trungthanhweb.com/api/";
  const [roleList, setRolesList] = useState([]);
  const [activeRoles, setActiveRoles] = useState([]);
  const [show, setShow] = useState(false);
  const [idEdit, setIdEdit] = useState(0);
  const [rolename, setUserRole] = useState("");
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [show3, setShow3] = useState(false);
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
  const submitUserRole = () => {
    if (rolename == "") {
      Toast.fire({
        icon: "error",
        title: "Thiếu loại tài khoản",
      });
    } else {
      axios({
        method: "post",
        url: url + "role",
        data: {
          name: rolename,
        },
      }).then((res) => {
        if (res.data.check == true) {
          Toast.fire({
            icon: "success",
            title: "Thêm thành công",
          });
          setRolesList(res.data.roles);
          handleClose();
        } else if (res.data.check == false) {
          if (res.data.msg.name) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.name,
            });
          }
        }
      });
    }
  };
  const submitEditUserRole = () => {
    axios({
      method: "post",
      url: url + "editRole",
      data: {
        id: idEdit,
        name: rolename,
      },
    }).then((res) => {
      if (res.data.check == true) {
        Toast.fire({
          icon: "success",
          title: "Thêm thành công",
        });
        setRolesList(res.data.roles);
        handleClose();
      } else if (res.data.check == false) {
        if (res.data.msg.name) {
          Toast.fire({
            icon: "error",
            title: res.data.msg.name,
          });
        }
      }
    });
  };
  const setEditUserRole = (id, old) => {
    setIdEdit(id);
    setUserRole(old);
    handleShow();
  };
  const switchRole = (id) => {
    axios({
      method: "post",
      url: url + "switchrole",
      data: {
        id: id,
      },
    }).then((res) => {
      if (res.data.check == true) {
        Toast.fire({
          icon: "success",
          title: "Thay đổi thành công",
        });
        setRolesList(res.data.roles);
        res.data.roles.forEach((el) => {
          if (el.status == 1) {
            setActiveRoles([...activeRoles, el]);
          }
        });
        console.log(activeRoles);
      } else {
        Toast.fire({
          icon: "error",
          title: res.data.msg,
        });
      }
    });
  };
  const deleteUserRole = (id) => {
    Swal.fire({
      icon: "question",
      text: "Xóa loại tài khoản?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Đúng",
      denyButtonText: `Đóng`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        axios({
          method: "post",
          url: url + "deleteRole",
          data: {
            id: id,
          },
        }).then((res) => {
          if (res.data.check == true) {
            Toast.fire({
              icon: "success",
              title: "Đã xóa thành công",
            });
          }
          setRolesList(res.data.roles);
        });
      } else if (result.isDenied) {
      }
    });
  };
  const setSideBar1 = () => {
    if (show3 == false) {
      setShow3(true);
    } else {
      setShow3(false);
    }
  };
  useEffect(()=>{
    axios({
        method: "get",
        url: url + "role",
      }).then((res) => {
        setRolesList(res.data);
      });
  },[])
  return (
    <>
      <Sidebar show={show3}/>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title
            style={{
              fontSize: "20px",
              fontFamily: '"Times New Roman", Times, serif',
            }}
          >
            Loại tài khoản
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <input
              type="text"
              placeholder="Loại tài khoản"
              onChange={(e) => setUserRole(e.target.value)}
              value={rolename}
              className="form-control"
            />
          </>
        </Modal.Body>
        <Modal.Footer>
          {idEdit == 0 && (
            <Button variant="primary" onClick={submitUserRole}>
              Hoàn thành
            </Button>
          )}
          {idEdit != 0 && (
            <Button variant="warning" onClick={submitEditUserRole}>
              Sửa
            </Button>
          )}
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      <div className={`content ${show3 ? "" : "open"} mt-3`}>
        {/* Navbar Start */}
        <nav style={{'paddingLeft':show3?'27%':'2%','transition':'ease-in-out .3s'}} className="navbar navbar-expand sticky-top px-4 py-0">
        <button className='btn btn-success me-3'  onClick={(e) => setSideBar1()}><i class='bx bx-menu' ></i></button>
          <button className="btn btn-primary" onClick={(e) => setShow(true)}>
            Thêm
          </button>
        </nav>
        <div className="container-fluid pt-4 px-4">
          {roleList.length > 0 && (
              <div className="table-responsive">
                <table className="table table-primary">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Loại tài khoản</th>
                      <th scope="col">Status</th>
                      <th scope="col">Ngày tạo</th>
                      <th scope="col">Tùy chỉnh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleList.map((item, index) => (
                      <tr key={index} className="">
                        <td>{++index}</td>
                        <td>
                          <p style={{"cursor":'pointer'}}
                            onClick={(e) => setEditUserRole(item.id, item.name)}
                          >
                            {item.name}
                          </p>
                        </td>
                        <td>
                          {item.status == 0 && (
                            <b style={{"cursor":'pointer'}} onClick={(e) => switchRole(item.id)}>
                              Đang đóng
                            </b>
                          )}
                          {item.status == 1 && (
                            <b style={{"cursor":'pointer'}} onClick={(e) => switchRole(item.id)}>
                              Đang hoạt động
                            </b>
                          )}
                        </td>
                        <td>{item.created_at}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={(e) => deleteUserRole(item.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

          )}
      </div>
      </div>

    </>
  );
}

export default UserRoles;
