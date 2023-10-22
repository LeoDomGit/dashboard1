import React, { useEffect, useState } from 'react'
import Sidebar from "../components/Sidebar";
import Swal from "sweetalert2";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Loader from "../components/Loading.jsx/Loader";
import { Link } from 'react-router-dom';
function Education() {
    const url = "https://api.trungthanhweb.com/api/";
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [edit, setEdit1] = useState(false);
    const [edu, setEdu] = useState("");
    const [education, setEucation] = useState([]);
    const [idEdit, setIdEdit] = useState(0);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState([]);
    const [lastpage,setLast]=useState(0);
    const [lastpage1,setLast1]=useState(0);
    const [pageSc, setPageSc] = useState(1);
    const submitEditEdu = () => {
        if (edu == "" || idEdit == 0) {
          Toast.fire({
            icon: "error",
            title: "Thiếu ngành giáo dục",
          });
        } else {
          axios({
            method: "post",
            url: url + "editEdu",
            data: {
              id: idEdit,
              name: edu,
            },
          }).then((res) => {
            if (res.data.check == true) {
              Toast.fire({
                icon: "success",
                title: "Sửa thành công",
              });
              setEucation(res.data.edu);
              setEdu("");
              handleClose();
            } else if (res.data.check == false) {
              if (res.data.msg.name) {
                Toast.fire({
                  icon: "error",
                  title: res.data.msg.name,
                });
              } else if (res.data.msg.id) {
                Toast.fire({
                  icon: "error",
                  title: res.data.msg.id,
                });
              }
            }
          });
        }
      };
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
      const setEdit = (id, name) => {
        setEdu(name);
        setEdit1(true);
        setIdEdit(id);
        handleShow();
      };
      const switchEdu = (id) => {
        Swal.fire({
          icon: "question",
          text: "Chuyển trạng thái của lĩnh vực ?",
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: "Đúng",
          denyButtonText: `Không`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            axios({
              method: "post",
              url: url + "switchEdu",
              data: {
                id: id,
              },
            }).then((res) => {
              setEucation(res.data.edu);
              console.log(res);
            });
          } else if (result.isDenied) {
          }
        });
      };
      const submitEdu = () => {
        if (edu == "") {
          Toast.fire({
            icon: "error",
            title: "Thiếu ngành giáo dục",
          });
        } else {
          axios({
            method: "post",
            url: url + "createEdu",
            data: {
              name: edu,
            },
          }).then((res) => {
            if (res.data.check == true) {
              Toast.fire({
                icon: "success",
                title: "Thêm thành công",
              })
              console.log(res.data);
              setEucation(res.data.edu);
              setEdu("");
              handleClose(); 
            } else if (res.data.check == false) {
              if (res.data.msg.edu) {
                Toast.fire({
                  icon: "error",
                  title: res.data.msg.edu,
                });
              }
            }
          });
        }
      };
      useEffect(() => {
        axios({
          method: "get",
          url: url + "edu?page=" + page,
        }).then((res) => {
          setEucation(res.data.data);
          var arr=[];
          for (let i = 1; i < res.data.last_page + 1; i++) {
            arr.push(i);
            // setPagination((pagination) => [...pagination, i]);
          }
          setPagination(arr);
          setLast(res.data.last_page);
        });
      }, [page]);
      const deleteEdu = (id) => {
        Swal.fire({
          icon: "question",
          text: "Xóa chương trình giáo dục?",
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: "Đúng",
          denyButtonText: `Không`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            axios({
              method: "post",
              url: url + "deleteEdu",
              data: {
                id: id,
              },
            }).then((res) => {
              if (res.data.check == true) {
                Toast.fire({
                  icon: "success",
                  title: "Xóa thành công",
                });
                setEucation(res.data.edu);
                setEdu("");
                handleClose();
              } else if (res.data.check == false) {
                if (res.data.msg.name) {
                  Toast.fire({
                    icon: "error",
                    title: res.data.msg.name,
                  });
                } else if (res.data.msg.id) {
                  Toast.fire({
                    icon: "error",
                    title: res.data.msg.id,
                  });
                }
              }
            });
          } else if (result.isDenied) {
          }
        });
      };
      const setPageF= (i)=>{
        if(i<1){
          setPage(1);
        }else if(i>lastpage){
          setPage(lastpage);
        }else{
          setPage(i);
        }
      }
        const setPageF1= (i)=>{
        if(i<1){
          setPageSc(1);
        }else if(i>lastpage1){
          setPageSc(lastpage1);
        }else{
          setPageSc(i);
        }
      }
  return (
    <>
    <Sidebar />
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Loại hình giáo dục</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            placeholder="Loại hình giáo dục"
            onChange={(e) => setEdu(e.target.value)}
            className="form-control"
            value={edu}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          {!edit && (
            <Button variant="primary" onClick={submitEdu}>
              Lưu
            </Button>
          )}
          {edit && (
            <Button variant="warning" onClick={submitEditEdu}>
              Lưu
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <div classname="content">
        {loading && <Loader />}
        <nav className="navbar navbar-expand sticky-top px-4 py-0 mt-3">
          <button className="btn btn-primary" onClick={(e) => setShow(true)}>
            Thêm
          </button>
        </nav>
        <div className="row mt-3">
          {education && education.length > 0 && (
            <div className="col-md-10 ms-3">
              <div className="table-responsive">
                <table className="table table-primary">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Giáo Dục</th>
                      <th scope="col">Tình trạng</th>
                      <th scope="col">Khởi tạo</th>
                      <th scope="col">Tùy chỉnh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {education.map((item, index) => (
                      <tr key={index} className="">
                        <td>{++index}</td>
                        <td>
                          <Link
                            style={{ textDecoration: "none" }}
                            to={`/cate/${item.id}`}
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td>
                          {item.status == 0 ? (
                            <b onClick={(e) => switchEdu(item.id)}>Đang khóa</b>
                          ) : (
                            <b onClick={(e) => switchEdu(item.id)}>Đang mở</b>
                          )}
                        </td>
                        <td>{item.created_at}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={(e) => setEdit(item.id, item.name)}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn btn-danger ms-3 btn-sm"
                            onClick={(e) => deleteEdu(item.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {pagination.length > 1 && (
                  <div className="row w-100">
                    <div className="col-md">
                      <nav aria-label="...">
                        <ul className="pagination">
                          <li className={`page-item`}>
                            <a className="page-link" onClick={(e)=>setPageF(page-1)}>Previous</a>
                          </li>
                          {pagination.map((item,index) => (
                            <li key={index} className="page-item">
                              {item==page ?
                              <a className="page-link active" onClick={(e)=>setPage(item)} href="#">
                              {item}
                            </a>
                              :
                              <a className="page-link" onClick={(e)=>setPage(item)} href="#">
                              {item}
                            </a>
                              }
                              
                            </li>
                          ))}

                          <li className="page-item">
                            <a className="page-link" onClick={(e)=>setPageF(page+1)} href="#">
                              Next
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
    </div>
    </>
  )
}

export default Education