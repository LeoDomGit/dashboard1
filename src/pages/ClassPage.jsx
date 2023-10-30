import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loading.jsx/Loader";
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import axios from "axios";

function ClassPage() {
    const url = "https://api.trungthanhweb.com/api/";
    const [show3, setShow3] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [schedules, setSchedule]= useState([]);
    const [pagination1, setPagination1] = useState([]);
    const [lastPage, setLastPage]= useState(0);
    const [show, setShow] = useState(false);
    const [studentList,setStudent] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    const handleClose1=()=>{
      setStudent([]);
      setShow(false)
    }
    const loadStudentList = (id)=>{ 
      fetch(url+'getStudentsClass/'+id).then(res=>res.json()).then((res)=>{
        var arr =[];
        res.forEach(el => {
          arr.push(el.name)
        });
        setStudent(arr);
        handleShow();
      })
    }
    const deleteClass =(id)=>{
      Swal.fire({
        icon:'question',
        text: 'Xoá lớp học?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Đúng',
        denyButtonText: `Không`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          axios({
            method: 'post',
            url: url+'deleteProccess',
            data: {
              id: id,
            }
          })
          .then(function (res) {
            if(res.data.check==true){
              Toast.fire({
                icon: 'success',
                title: 'Đã xoá thành công'
              }).then(()=>{
                window.location.reload();
              })
            }else if(res.data.check==false){
              if(res.data.msg.id){
                Toast.fire({
                  icon: 'error',
                  title: res.data.msg.id
                })
              }else if(res.data.msg){
                Toast.fire({
                  icon: 'error',
                  title: res.data.msg
                })
              }
            }
          })
        } else if (result.isDenied) {
        }
      })
    }
    useEffect(()=>{
        fetch(url+'getRunningClass?page='+page).then(res=>res.json()).then((res)=>{
            setLastPage(res.last_page);
            setSchedule(res.data)
            var i = 1;
            var arr=[];
            while (i<=res.last_page) {
                arr.push(i);
                i++;
            }
            setPagination1(arr);
        })
    },[page])
  return (
    <>
      <Sidebar />
      <Modal show={show} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>Danh sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <ul className="list-group">
          {studentList.length>0 && studentList.map((item,index)=>(
          <li key={index} className="list-group-item" >{item}</li>
          ))}
        </ul>

        </Modal.Body>
      </Modal>
      <div className={`content ${show3 ? "" : "open"} mt-5`}>
        {loading && <Loader />}
        <div className="table-responsive mt-5">
        <table className="table table-primary mt-5">
          <thead>
            <tr>
              <th scope="col">Khoá học</th>
              <th scope="col">Lịch giảng</th>
              <th scope="col">Giáo viên</th>
              <th scope="col">Số lượng học viên</th>
              <th scope="col">Xoá </th>

            </tr>
          </thead>
          <tbody>
            {
              schedules.map((ỉtem, index) => (
                <tr className="" key={index}>
                  <td>
                    <b style={{'cursor':'pointer'}} onClick={(e)=>loadStudentList(ỉtem.id)}>{ỉtem.name}</b>
                  </td>
                  <td>{ỉtem.schedules}</td>
                  <td>{ỉtem.teacher}</td>
                  <td className="">{ỉtem.count}
                  </td>
                  <td><button className="btn btn-danger" onClick={(e)=>deleteClass(ỉtem.id)}>Xoá</button></td>
                </tr>
              ))}
          </tbody>
        </table>
        {pagination1.length > 1 && (
          <div className="row w-100 mt-3">
            <div className="col-md">
              <ul className="pagination">
                <li style={{ listStyle: "none" }} className={`page-item`}>
                  <a className="page-link" onClick={(e) => {
                    if(page>1){
                    setPage(page - 1);
                    }
                  }}>
                    Previous
                  </a>
                </li>
                {pagination1.map((item, index) => (
                  <li key={index} className="page-item">
                    {item == page ? (
                      <a
                        className="page-link active"
                        onClick={(e) => setPage(item)}
                        href="#"
                      >
                        {item}
                      </a>
                    ) : (
                      <a
                        className="page-link"
                        onClick={(e) => setPage(item)}
                        href="#"
                      >
                        {item}
                      </a>
                    )}
                  </li>
                ))}

                <li className="page-item">
                  <a
                    className="page-link"
                    onClick={(e) => {
                        if(page<lastPage){
                            setPage(page+1)
                        }
                    }}
                    href="#"
                  >
                    Next
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      </div>

    </>
  );
}

export default ClassPage;
