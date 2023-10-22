import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import Loader from "../components/Loading.jsx/Loader";
function BillPage() {
  const url = "https://api.trungthanhweb.com/api/";
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [loading, setLoading] = useState(false);
  const handleShow = () => setShow(true);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const [bills, setBill] = useState([]);
  const [idTeacher, setIdTeacher] = useState(0);
  const [idCourse, setidCourse] = useState(0);
  const [teacher, setTeacher] = useState([]);
  const [schedule, setSchedule] = useState("");
  const [scheduleList, setScheduleList] = useState([]);
  const [classname, setClass] = useState("");
  const [process, setProcess] = useState(0);
  const [idBill, setidBill] = useState(0);
  const [studentname, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setstudentPhone] = useState("");
  const [availableClass, setClass1] = useState([]);
  const [idSchedulechoose, setChooseSchedule] = useState(0);
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
  const [show3, setShow3] = useState(false);
  const submitClass = () => {
    if (process == 0) {
      Toast.fire({
        icon: "error",
        title: "Chưa có thời lượng khoá học",
      });
    } else if (schedule == "") {
      Toast.fire({
        icon: "error",
        title: "Chưa chọn lịch học",
      });
    } else if (classname == "") {
      Toast.fire({
        icon: "error",
        title: "Chưa nhập tên lớp học",
      });
    } else if (idTeacher == 0) {
      Toast.fire({
        icon: "error",
        title: "Chưa có giáo viên",
      });
    } else if (idCourse == 0) {
      Toast.fire({
        icon: "error",
        title: "Chưa có mã khoá học",
      });
    } else {
      axios({
        method: "post",
        url: url + "createClass",
        data: {
          idTeacher: Number(idTeacher),
          name: classname,
          schedules: schedule,
          idCourse: idCourse,
          duration: Number(process),
        },
      }).then((res) => {
        if (res.data.check == true) {
          Toast.fire({
            icon: "success",
            title: "Đã thêm thành công",
          });
          setShow(false);
        } else if (res.data.check == false) {
          if (res.data.msg.idTeacher) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.idTeacher,
            });
          } else if (res.data.msg.name) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.name,
            });
          } else if (res.data.msg.schedules) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.schedules,
            });
          } else if (res.data.msg.idCourse) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.idCourse,
            });
          } else if (res.data.msg.duration) {
            Toast.fire({
              icon: "error",
              title: res.data.msg.duration,
            });
          }
        }
      });
    }
  };
  const setSchedule1 = (e) => {
    var arr = e.target.value.split(",");
    setidCourse(Number(arr[1]));
    setSchedule(arr[0]);
  };
  const setUpChooseClass = (item) => {
    setStudentName(item[0]);
    setStudentEmail(item[2]);
    setstudentPhone(item[1]);
    setidBill(item[3]);
    fetch(url + "getAvailableClass")
      .then((res) => res.json())
      .then((res) => setClass1(res));
    handleShow1();
  };
  const submitStudentAdd = () => {
    if (studentname == "") {
      Toast.fire({
        icon: "error",
        title: "Thiếu tên học viên",
      });
    } else if (studentEmail == "") {
      Toast.fire({
        icon: "error",
        title: "Thiếu email học viên",
      });
    } else if (studentPhone == "") {
      Toast.fire({
        icon: "error",
        title: "Thiếu số điện thoại học viên",
      });
    } else if (idSchedulechoose == 0) {
      Toast.fire({
        icon: "error",
        title: "Thiếu lịch học",
      });
    } else if (idBill == 0) {
      Toast.fire({
        icon: "error",
        title: "Thiếu mã hoá đơn",
      });
    } else {
      axios
        .post(url + "addStudent", {
          name: studentname,
          email: studentEmail,
          phone: studentPhone,
          schedule: idSchedulechoose,
          idBill: idBill,
        })
        .then(function (res) {
          if (res.data.check == true) {
            Toast.fire({
              icon: "success",
              title: "Đã đăng ký học viên",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  useEffect(() => {
    var arr = [];

    fetch(url + "getBills")
      .then((res) => res.json())
      .then((res) => {
        res.forEach((el) => {
          var item = {};
          item.name = el.courseName;
          item.status = el.status;
          item.duration = el.duration;
          item.student = [el.name, el.phone, el.email, el.id];
          item.schedule = JSON.parse(el.schedule)[0].time;
          arr.push(item);
        });
        setBill(arr);
      });
    fetch("https://api.trungthanhweb.com/api/getTeacherList")
      .then((res) => res.json())
      .then((res) => setTeacher(res));
    fetch("https://api.trungthanhweb.com/api/getCourseList")
      .then((res) => res.json())
      .then((res) => {
        var arr = [];
        res.forEach((el) => {
          var item = {};
          item.name = el.name;
          item.schedule = JSON.parse(el.schedule)[0].time;
          item.id = Number(el.id);
          arr.push(item);
        });
        setScheduleList(arr);
      });
  }, []);
  return (
    <>
      <Sidebar show={show3} />
      <div className={`content ${show3 ? "" : "open"} mt-3`}>
        {loading && <Loader />}
        <nav
         style={{'paddingLeft':show3?'27%':'2%','transition':'ease-in-out .3s'}} className="navbar navbar-expand sticky-top pt-3 px-4 py-0"
        >
            <button
            href="#"
            className="btn btn-primary"
            onClick={(e) => handleShow()}
          >
            Thêm lớp học
          </button>
        </nav>
        <div className="container-fluid">
          <Modal show={show1} onHide={handleClose1}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                type="text"
                value={studentname}
                readOnly
                onChange={(e) => setStudentName(e.target.value)}
                className="form-control mb-2"
              />
              <input
                type="text"
                value={studentEmail}
                readOnly
                onChange={(e) => setStudentEmail(e.target.value)}
                className="form-control mb-2"
              />
              <input
                type="text"
                value={studentPhone}
                readOnly
                onChange={(e) => setstudentPhone(e.target.value)}
                className="form-control mb-2"
              />
              {availableClass.length > 0 &&
                availableClass.map((item, index) => (
                  <div key={index} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultValue={item.id}
                      name="idSchedule"
                      id={"checkbox" + index}
                      onChange={(e) => setChooseSchedule(e.target.value)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={"checkbox" + index}
                    >
                      Tên lớp : {item.name} <br />
                      Lịch học : {item.schedules} <br />
                      Giáo viên : {item.teacher} <br />
                    </label>
                  </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose1}>
                Close
              </Button>
              <Button variant="primary" onClick={submitStudentAdd}>
                Thêm
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm lớp học</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                type="text"
                placeholder="Mã lớp học"
                onChange={(e) => setClass(e.target.value)}
                className="form-control mb-3"
              />
              <select
                name=""
                value={idTeacher}
                onChange={(e) => setIdTeacher(e.target.value)}
                id=""
                className="form-control"
              >
                <option value="0" disabled>
                  Chọn giáo viên
                </option>
                {teacher.length > 0 &&
                  teacher.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
              <select
                name=""
                onChange={(e) => setSchedule1(e)}
                defaultValue={0}
                className="form-control mt-3"
                id=""
              >
                <option value={0} disabled>
                  Chọn giờ học
                </option>
                {scheduleList.length > 0 &&
                  scheduleList.map((item, index) => (
                    <option key={index} value={[item.schedule, item.id]}>
                      {item.schedule}
                    </option>
                  ))}
              </select>
              <input
                type="text"
                value={schedule}
                readOnly
                placeholder="Lịch học"
                className="form-control mt-3"
              />
              <input
                type="number"
                placeholder="Số buổi học"
                onChange={(e) => setProcess(e.target.value)}
                value={process}
                className="form-control mt-3"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={submitClass}>
                Tạo
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="table-responsive mt-4">
            <table className="table table-primary">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">T.Tin học viên</th>
                  <th scope="col">Khóa học đã mua</th>
                  <th scope="col">Lịch học</th>
                  <th scope="col">Thời lượng</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col">Tùy chỉnh</th>
                </tr>
              </thead>
              <tbody>
                {bills.length > 0 &&
                  bills.map((item, index) => (
                    <tr key={index}>
                      <td scope="row">{++index}</td>
                      <td>
                        <b>Tên học viên : </b> <span> {item.student[0]}</span>
                        <br />
                        <b>Số điện thoại : </b> <span> {item.student[1]}</span>
                        <br />
                        <b>Email : </b> <span> {item.student[2]}</span>
                        <br />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.schedule}</td>
                      <td>{item.duration}</td>

                      <td>
                        {item.status == 0 ? <b>Đã đặt</b> : <b>Đã xếp lớp</b>}
                      </td>
                      <td>
                        {item.status==0 &&
                        <button
                        className="btn btn-warning"
                        onClick={(e) => setUpChooseClass(item.student)}
                      >
                        Sắp lớp
                      </button>
                        }
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default BillPage;
