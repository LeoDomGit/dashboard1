import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import Loader from "../components/Loading.jsx/Loader";
function SingleEdu() {
  const url = "https://api.trungthanhweb.com/api/";
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

  const [show3, setShow3] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const [idEdit, setidEdit] = useState(0);
  const [courseCate, setCourseCate] = useState("");
  const [courseCates, setCate] = useState([]);
  const switchCate = (id) => {
    axios({
      method: "post",
      url: url + "switchCate",
      data: {
        id: id,
      },
    }).then((res) => {
      setCate(res.data.result);
    });
  };
  const setUpEdit = (id, old) => {
    setidEdit(id);
    setCourseCate(old);
    setShow(true);
  };
  const setAdd = () => {
    setCourseCate("");
    setShow(true);
    setidEdit(0);
  };
  const setSideBar1 = () => {
    if (show3 == false) {
      setShow3(true);
    } else {
      setShow3(false);
    }
  };
  const submitCourseCate = () => {
    if (courseCate != "") {
      axios({
        method: "post",
        url: url + "createCate",
        data: {
          name: courseCate,
          idEdu: id,
        },
      }).then((res) => {
        if (res.data.check == true) {
          Toast.fire({
            icon: "success",
            title: "Thêm thành công",
          });
          setCate(res.data.result);
          setCourseCate("");
          setShow(false);
        } else if (res.data.check == false) {
          if (res.data.msg.idEdu) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.idEdu,
            });
          } else if (res.data.msg.name) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.name,
            });
            setCourseCate("");
          }
        }
      });
    }
  };
  const submitEditCourseCate = () => {
    if (courseCate != "") {
      axios({
        method: "post",
        url: url + "editCate",
        data: {
          name: courseCate,
          id: idEdit,
        },
      }).then((res) => {
        if (res.data.check == true) {
          Toast.fire({
            icon: "success",
            title: "Sửa thành công",
          });
          setCate(res.data.result);
          setCourseCate("");
          setShow(false);
        } else if (res.data.check == false) {
          if (res.data.msg.idEdu) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.idEdu,
            });
          } else if (res.data.msg.name) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.name,
            });
            setCourseCate("");
          }
        }
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Thiếu loại hình lớp",
      });
    }
  };
  const deleteCourseCate = (id) => {
    Swal.fire({
      icon: "question",
      text: "Xóa loại hình lớp?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Đúng",
      denyButtonText: `Không`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        axios({
          method: "post",
          url: url + "deleteCate",
          data: {
            id: id,
          },
        }).then((res) => {
          if (res.data.check == true) {
            Toast.fire({
              icon: "success",
              title: "Sửa thành công",
            });
            setCate(res.data.result);
            setCourseCate("");
            setShow(false);
          }
        });
      } else if (result.isDenied) {
      }
    });
  };
  useEffect(() => {
    axios({
      method: "get",
      url: url + "cate?id=" + id,
    }).then((res) => {
      setCate(res.data);
    });
  }, []);
  return (
    <>
      <Sidebar show={show3} />
      <div classname={`content ${show3 ? "" : "open"} mt-3`}>
        {loading && <Loader />}
        <nav
          style={{
            paddingLeft: show3 ? "27%" : "2%",
            transition: "ease-in-out .3s",
          }}
          className="navbar navbar-expand sticky-top pt-3 px-4 py-0"
        >
          <button
            href="#"
            onClick={(e) => setAdd()}
            className=" ms-3 btn btn-primary"
          >
            Thêm
          </button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title
                style={{
                  "font-size": "18px",
                  fontFamily: "'Times New Roman', Times, serif",
                }}
              >
                Loại khóa học
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                type="text"
                className="form-control"
                value={courseCate}
                onChange={(e) => setCourseCate(e.target.value)}
                placeholder="Loại khóa học"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" size="sm" onClick={handleClose}>
                Close
              </Button>
              {idEdit == 0 ? (
                <Button variant="primary" size="sm" onClick={submitCourseCate}>
                  Save
                </Button>
              ) : (
                <Button
                  variant="warning"
                  size="sm"
                  onClick={submitEditCourseCate}
                >
                  Sửa
                </Button>
              )}
            </Modal.Footer>
          </Modal>
        </nav>
        <div className="container-fluid">
          <div className="row mt-3">
            {courseCates && courseCates.length > 0 && (
              <div className="col-md ms-3">
                <div className="table-responsive">
                  <table className="table table-primary">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Loại hình lớp</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Ngày tạo</th>
                        <th scope="col">Tùy chỉnh</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseCates.map((item, index) => (
                        <tr key={index} className="">
                          <td>{++index}</td>
                          <td>
                            <Link
                              style={{ textDecoration: "none" }}
                              to={`/course/${item.id}`}
                            >
                              {item.name}
                            </Link>
                          </td>
                          <td>
                            {item.status == 0 ? (
                              <b onClick={(e) => switchCate(item.id)}>
                                Đang đóng
                              </b>
                            ) : (
                              <b onClick={(e) => switchCate(item.id)}>
                                Đang mở
                              </b>
                            )}
                          </td>
                          <td>{item.created_at}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={(e) => deleteCourseCate(item.id)}
                            >
                              Xóa
                            </button>
                            <button
                              className="ms-3 btn btn-warning btn-sm"
                              onClick={(e) => setUpEdit(item.id, item.name)}
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
      </div>
    </>
  );
}

export default SingleEdu;
