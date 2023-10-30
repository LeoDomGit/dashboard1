import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Swal from "sweetalert2";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Loader from "../components/Loading.jsx/Loader";
import { Link } from "react-router-dom";
function Calendar() {
  const url = "https://api.trungthanhweb.com/api/";
  const [loading, setLoading] = useState(false);
  const [show3, setShow3] = useState(false);
  const [courses, setCourses] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const [teachID, setTeachID] = useState(0);
  const [courseID, setCourseID] = useState(0);
  const [teacher, setTeacher] = useState([]);
  const [times, setTTime] = useState([{ time: "" }]);
  const [pageSc, setPageSc] = useState(1);
  const [pagination1, setPagination1] = useState([]);
  const [lastpage1, setLast1] = useState(0);
  const [schedules, setSchedule] = useState([]);
  const [page, setPage] = useState(1);
  const [lastpage, setLast] = useState(0);
  //   ======================================
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const [idScheduleEdit, setScheduleEdit] = useState(0);
  const [editSchedule, setEditschedule] = useState("");
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
  const setEditschedule1 = (id, old) => {
    setScheduleEdit(id);
    setEditschedule(old);
    handleShow1();
  };
  const addSchedule = (value, index) => {
    const list = [...times];
    list[index].time = value;
    setTTime(list);
  };
  const handleServiceAdd = () => {
    setTTime([...times, { time: "" }]);
  };
  const deleteTime = (index) => {
    const list = [...times];
    list.splice(index, 1);
    setTTime(list);
  };
  useEffect(() => {
    axios({
      method: "get",
      url: url + "getTeacher",
    }).then((res) => {
      setTeacher(res.data);
    });
  }, []);
  const submitSchedule = () => {
    if (
      teachID == 0 ||
      courseID == 0 ||
      times.length == 0 ||
      times[0].time == ""
    ) {
      Toast.fire({
        icon: "error",
        title: "Thiếu thông tin lịch học",
      });
      console.log(teachID, courseID);
    } else {
      axios({
        method: "post",
        url: url + "addSchedule",
        data: {
          teacher: Number(teachID),
          course: Number(courseID),
          times: JSON.stringify(times),
        },
      }).then((res) => {
        if (res.data.check == true) {
          Toast.fire({
            icon: "success",
            title: "Đã thêm thành công",
          }).then(() => {
            window.location.reload();
          });
        }
      });
    }
  };
  const deleteSchedule = (id) => {
    Swal.fire({
      icon: "question",
      text: "Xoá lịch dạy?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Đúng",
      denyButtonText: `Không`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        fetch(url + "deleteSchedule?id=" + id)
          .then((res) => res.json())
          .then((res) => {
            if (res.check == true) {
              Toast.fire({
                icon: "success",
                title: "Đã huỷ lịch dạy",
              }).then(()=>{
                window.location.reload()
              })
            } else if (res.check == false) {
              if (res.msg.id) {
                Toast.fire({
                  icon: "error",
                  title: res.msg.id,
                });
              }
            }
          });
      } else if (result.isDenied) {
      }
    });
  };
  const submiteditSchedule = () => {
    if (idScheduleEdit == 0 || editSchedule == "") {
      Toast.fire({
        icon: "error",
        title: "Thiếu thông tin lịch học",
      });
    }else{
        const edit =[{ time: editSchedule }];
        axios.post(url+'updateSchedule', {
            id: idScheduleEdit,
            schedule: JSON.stringify(edit)
          })
          .then(function (res) {
            if(res.data.check==true){
                Toast.fire({
                    icon: "success",
                    title: "Thay đổi thành công",
                  })
                  var arr = [];
                  res.data.result.data.forEach((el) => {
                    var item = new Object();
                    item.id = el.id;
                    item.coursename = el.coursename;
                    item.username = el.username;
                    item.duration = el.duration;
                    item.created_at = el.created_at;
                    var schedule = JSON.parse(el.schedule);
                    var str = ``;
                    str += ``;
                    schedule.forEach((el1) => {
                      str += el1.time;
                    });
                    item.schedule = str;
                    arr.push(item);
                  });
                  var arr1 = [];
                  for (let i = 1; i < res.data.last_page + 1; i++) {
                    arr1.push(i);
                    // setPagination((pagination) => [...pagination, i]);
                  }
                  setPagination1(arr1);
                  setLast1(res.data.last_page);
                  setSchedule(arr);
                  setScheduleEdit(0);
                  setEditschedule('');
                  handleClose1();
            }else if(res.data.check==false){
                if(res.data.msg.id){
                    Toast.fire({
                        icon: "success",
                        title: res.data.msg.id,
                      })
                }else if(res.data.msg.schedule){
                    Toast.fire({
                        icon: "success",
                        title:res.data.msg.schedule,
                      })
                }
            }
          })
    }
  };
  useEffect(() => {
    axios({
      method: "get",
      url: url + "allcourses?page=" + pageSc,
    }).then((res) => {
      setCourses(res.data);
    });
  }, [pageSc]);
  useEffect(() => {
    axios({
      method: "get",
      url: url + "getSchedule?page=" + pageSc,
    }).then((res) => {
      var arr = [];
      res.data.data.forEach((el) => {
        var item = new Object();
        item.id = el.id;
        item.coursename = el.coursename;
        item.username = el.username;
        item.duration = el.duration;
        item.created_at = el.created_at;
        var schedule = JSON.parse(el.schedule);
        var str = ``;
        str += ``;
        schedule.forEach((el1) => {
          str += el1.time;
        });
        item.schedule = str;
        arr.push(item);
      });
      var arr1 = [];
      for (let i = 1; i < res.data.last_page + 1; i++) {
        arr1.push(i);
        // setPagination((pagination) => [...pagination, i]);
      }
      setPagination1(arr1);
      setLast1(res.data.last_page);
      setSchedule(arr);
    });
  }, [pageSc]);
  const setPageF = (i) => {
    if (i < 1) {
      setPage(1);
    } else if (i > lastpage) {
      setPage(lastpage);
    } else {
      setPage(i);
    }
  };
  const setPageF1 = (i) => {
    if (i < 1) {
      setPageSc(1);
    } else if (i > lastpage1) {
      setPageSc(lastpage1);
    } else {
      setPageSc(i);
    }
  };
  return (
    <>
      <Sidebar />
      <div className={`content ${show3 ? "" : "open"} mt-3`}>
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
            className=" ms-3 btn btn-primary"
            onClick={handleShow}
          >
            Thêm lịch giảng
          </button>
        </nav>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Lớp học</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <select
              name=""
              onChange={(e) => setCourseID(e.target.value)}
              className="form-control"
              id=""
            >
              <option value="0" selected disabled>
                Chọn khóa học
              </option>
              {courses &&
                courses.length > 0 &&
                courses.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name} - {item.duration} h
                  </option>
                ))}
            </select>
            <select
              name=""
              onChange={(e) => setTeachID(e.target.value)}
              className="form-control mt-3"
              id=""
            >
              <option value="0" selected disabled>
                Chọn giảng viên
              </option>
              {teacher &&
                teacher.length > 0 &&
                teacher.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name} - {item.email}
                  </option>
                ))}
            </select>
            {times.map((item, index) => (
              <div key={index} className="d-flex">
                <input
                  type="text"
                  className="form-control mt-3"
                  placeholder="Lịch giảng"
                  onChange={(e) => addSchedule(e.target.value, index)}
                />
                <button
                  style={{ borderRadius: "0px" }}
                  className="btn btn-danger btn-sm mt-3"
                  onClick={(e) => deleteTime(index)}
                >
                  Xóa
                </button>
              </div>
            ))}
            <button
              className="btn btn-warning btn-sm mt-2"
              style={{ borderRadius: "0px" }}
              onClick={handleServiceAdd}
            >
              Thêm
            </button>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
            <Button variant="primary" onClick={(e) => submitSchedule()}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={show1} onHide={handleClose1}>
          <Modal.Header closeButton>
            <Modal.Title>Thay đổi lịch dạy</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={editSchedule}
              onChange={(e) => setEditschedule(e.target.value)}
              className="form-control"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose1}>
              Close
            </Button>
            <Button variant="primary" onClick={(e) => submiteditSchedule()}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="table-responsive mt-3">
          <table className="table table-primary">
            <thead>
              <tr>
                <th scope="col">Khoá học</th>
                <th scope="col">Lịch giảng</th>
                <th scope="col">Giáo viên</th>
                <th scope="col">Thời gian</th>
                <th scope="col">Xoá</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length > 0 &&
                schedules.map((ỉtem, index) => (
                  <tr className="" key={index}>
                    <td>
                      {ỉtem.coursename} - {ỉtem.duration}h
                    </td>
                    <td>{ỉtem.schedule}</td>
                    <td>{ỉtem.username}</td>
                    <td>{ỉtem.created_at}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={(e) => deleteSchedule(ỉtem.id)}
                      >
                        Xoá
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={(e) =>
                          setEditschedule1(ỉtem.id, ỉtem.schedule)
                        }
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {pagination1.length > 1 && (
            <div className="row w-100 mt-3">
              <div className="col-md">
                <ul className="pagination">
                  <li style={{ listStyle: "none" }} className={`page-item`}>
                    <a
                      className="page-link"
                      onClick={(e) => setPageF1(page - 1)}
                    >
                      Previous
                    </a>
                  </li>
                  {pagination1.map((item, index) => (
                    <li key={index} className="page-item">
                      {item == pageSc ? (
                        <a
                          className="page-link active"
                          onClick={(e) => setPageSc(item)}
                          href="#"
                        >
                          {item}
                        </a>
                      ) : (
                        <a
                          className="page-link"
                          onClick={(e) => setPageSc(item)}
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
                      onClick={(e) => setPageF1(page + 1)}
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

export default Calendar;
