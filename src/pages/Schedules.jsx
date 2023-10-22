import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Swal from "sweetalert2";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Loader from "../components/Loading.jsx/Loader";
import { Link } from "react-router-dom";
function Schedules() {
    const url = "https://api.trungthanhweb.com/api/";
  const [schedules, setSchedule] = useState([]);
  const [studentList, setList] = useState([]);
  const [show, setShow] = useState(false);
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
  const loadDetail = (e) => {
    fetch(url + "getStudentsClass/" + e)
      .then((res) => res.json())
      .then((res) => {
        setList(res);
        handleShow()
      });
  };
  useEffect(() => {
    fetch(url + "getClassList")
      .then((res) => res.json())
      .then((res) => {
        setSchedule(res);
      });
  }, []);
  return (
    <>
    <Sidebar/>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: "Time New Romance" }}>
            Danh sách học viên
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group">
            {studentList.length>0 && studentList.map((item)=>(
            <li className="list-group-item">{item.name}</li>
            ))}

          </ul>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <div className="row mt-3">
      <div className="table-responsive">
                <table className="table table-primary">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Tên lớp</th>
                      <th scope="col">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.length > 0 &&
                      schedules.map((item, index) => (
                        <tr key={index} className="">
                          <td scope="row">{++index}</td>
                          <td>
                            <span>Tên lớp: </span> <b>{item.name}</b>
                            <br />
                            <span>Môn học: </span> <b>{item.courseName}</b>
                            <br />
                            <span>Tên giáo viên: </span> <b>{item.teacher}</b>
                            <br />
                            <span>Thời gian học: </span> <b>{item.schedules}</b>
                            <br />
                            <span>Số buổi học: </span>{" "}
                            <b>{item.duration} buổi</b> <br />
                            <span>Số buổi đã học : </span>{" "}
                            <b>{item.pass} buổi</b>
                            <br />
                          </td>
                          <td>
                            <button
                              className="btn btn-warning align-middle"
                              onClick={(e) => loadDetail(item.id)}
                            >
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
      </div>
    </>
  )
}

export default Schedules