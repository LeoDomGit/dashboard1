import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageResize from "quill-image-resize-module-react";
import Swal from "sweetalert2";
import { FileUploader } from "react-drag-drop-files";
import Loader from "../components/Loading.jsx/Loader";
import "../css/style.css";
Quill.register("modules/imageResize", ImageResize);
function SingleCateCourse() {
    const [show3, setShow3] = useState(false);
    const [loading, setLoading] = useState(false);
    const img = `https://api.trungthanhweb.com/images/`;
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
    const [addCourse, setAddcourse] = useState(false);
    const [courses, setCourse] = useState([]);
    const { id } = useParams();
    const [moduleList, setModuleList] = useState([{ module: "", detail: "" }]);
    const [number, setNumber] = useState([]);
    const [page, setPage] = useState(1);
    const addTitleModule = (e, index) => {
      const list = [...moduleList];
      list[index].module = e;
      setModuleList(list);
    };
    const [courseName, setCourseName] = useState("");
    const [courseSummary, setcourseSummary] = useState("");
    const [coursePrice, setcoursePrice] = useState(0);
    const [courseDiscount, setcourseDiscount] = useState(0);
    const [duration, setDuration] = useState(0);
    const [file, setFile] = useState(null);
    const [showImg, setRenderImg] = useState("");
    const [allCourse, setAllCourses] = useState([]);
    const [Grades, setGrade] = useState([]);
    const [search,SetSearch]= useState('');
    const [className,setClass]= useState('');
    const fileTypes = [
      "gif",
      "jpeg",
      "png",
      "webp",
      "jpg",
      "JPG",
      "jfif",
      "GIF",
      "JPEG",
      "PNG",
      "WEBP",
    ];
    const deleteCourse = (id)=>{
      Swal.fire({
        text: 'Xoá khoá học này?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Đúng',
        denyButtonText: `Không`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          fetch(url+'deletecourse?id='+id).then(res=>res.json()).then((res)=>{
            if(res.check==true){
              Toast.fire({
                icon: 'success',
                title: "Đã xoá thành công"
              })
              setCourse(res.courses.data);
              const old = [];
              for (let i = 1; i < res.courses.last_page + 1; i++) {
                old.push(i);
              }
              setAllCourses(res.courses.data);
              setNumber(old);
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
      })
    }
    const uploadFile = (file) => {
      setFile(file);
      var url1 = URL.createObjectURL(file);
      setRenderImg(url1);
      console.log(url1);
    };
    const addContentModule = (value, index) => {
      const list = [...moduleList];
      list[index].detail = value;
      setModuleList(list);
    };
    const handleServiceAdd = () => {
      setModuleList([...moduleList, { module: "", detail: "" }]);
    };
    const submitCourse = () => {
      const detail = JSON.stringify(moduleList);
      if (
        courseName == "" ||
        courseSummary == "" ||
        detail == "" ||
        coursePrice == 0 ||
        duration == 0 ||className==''||
        file == null
      ) {
        Toast.fire({
          icon: "error",
          title: "Thiếu thông tin khóa học",
        });
      } else {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", courseName);
        formData.append("summary", courseSummary);
        formData.append("price", coursePrice);
        formData.append("discount", courseDiscount);
        formData.append("idCourseCate", id);
        formData.append("duration", duration);
        formData.append("detail", detail);
        formData.append("Grade", className);
  
        axios({
          method: "post",
          url: url + "course",
          headers: { "Content-Type": "multipart/form-data" },
          data: formData,
        }).then(function (res) {
          if (res.data.check == true) {
            Toast.fire({
              icon: "success",
              title: "Thêm thành công",
            });
            setCourse(res.data.courses);
            setCourseName("");
            setcourseSummary("");
            setcoursePrice(0);
            setcourseDiscount(0);
            setModuleList([{ module: "", detail: "" }]);
            window.location.replace(`/course/${id}`);
          } else {
          }
        });
      }
    };
    const deleteModule = (index) => {
      const updateModuleList = [...moduleList];
      updateModuleList.splice(index, 1);
      setModuleList(updateModuleList);
    };
    const dupplicateCourse = (id) => {
      axios({
        method: "get",
        url: url + `duplicateCourse/${id}`,
      }).then(function (res) {
        setCourse(res.data.data);
        console.log(courses);
      });
    };
    const filterCourse = () => {
      var old = [...courses];
      if (search == "") {
        setCourse(allCourse);
      } else {
        old = old.filter((old) => old.summary.includes(search));  
        if(old.length==0){
          setCourse(allCourse);
        }else{
          setCourse(old);
        }
      }
    };
    useEffect(() => {
      axios({
        method: "get",
        url: url + `course/${id}?page=` + page,
      }).then(function (res) {
        setCourse(res.data.result.data);
        const old = [];
        for (let i = 1; i < res.data.result.last_page + 1; i++) {
          old.push(i);
        }
        setAllCourses(res.data.result.data);
        setNumber(old);
        setGrade(res.data.grades);
      });
    }, [page]);
  return (
    <>
        <Sidebar show={show3} />
        <div classname={`content ${show3 ? "" : "open"} mt-3`}>
        {loading && <Loader />}
        <nav
         style={{'paddingLeft':show3?'27%':'2%','transition':'ease-in-out .3s'}} className="navbar navbar-expand sticky-top pt-3 px-4 py-0"
        >
             <button
              className="btn btn-primary"
              onClick={() => setAddcourse(true)}
            >
              Thêm
            </button>
            <button
              className="btn btn-warning ms-3"
              onClick={() => setAddcourse(false)}
            >
              Hủy
            </button>
        </nav>
        <div className="container-fluid">
        <div className="row mt-3">
        {addCourse && (
              <div className="row mt-2 w-100">
                <div className="row">
                  <div className="col-md">
                    <label htmlFor="">Tên khóa học</label>
                    <input
                      type="text"
                      onChange={(e) => setCourseName(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md">
                    <label htmlFor="">Tóm tắt</label>
                    <input
                      type="text"
                      onChange={(e) => setcourseSummary(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md">
                    <label htmlFor="">Gía khóa</label>
                    <input
                      type="number"
                      onChange={(e) => setcoursePrice(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md">
                    <label htmlFor="">Giảm giá</label>
                    <input
                      type="number"
                      onChange={(e) => setcourseDiscount(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md">
                    <label htmlFor="">Thời gian học</label>
                    <input
                      value={duration}
                      type="number"
                      onChange={(e) => setDuration(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md">
                    <label htmlFor="">Khối lớp</label>
                    <input
                      value={className}
                      type="text"
                      onChange={(e) => setClass(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <FileUploader
                    multiple={false}
                    handleChange={uploadFile}
                    name="file"
                    types={fileTypes}
                  />
                </div>
                <div className="row mt-2">
                  {showImg != "" && (
                   <img style={{'height':'120px','width':'auto'}} src={showImg} alt="" />
                  )}
                </div>
                <div className="row mt-2">
                  {moduleList.map((SingleModule, index) => (
                    <div key={index} className="row mb-5">
                      <div className="col-md">
                        <div className="row">
                          <div className="col-md">
                            <div className="row">
                              <div className="col-md-8">Tên Module</div>
                            </div>

                            <input
                              type="text"
                              onChange={(e) =>
                                addTitleModule(e.target.value, index)
                              }
                              className="form-control w-100"
                            />
                          </div>
                        </div>
                      </div>
                      <label htmlFor="" className="mb-2 mt-3">
                        Nội dung
                      </label>
                      <ReactQuill
                        onChange={(value) => addContentModule(value, index)}
                        className="mb-5"
                        modules={{
                          toolbar: [
                            [{ header: "1" }, { header: "2" }, { font: [] }],
                            [{ size: [] }],
                            [
                              "bold",
                              "italic",
                              "underline",
                              "strike",
                              "blockquote",
                            ],
                            [
                              { list: "ordered" },
                              { list: "bullet" },
                              { indent: "-1" },
                              { indent: "+1" },
                            ],
                            ["link", "image", "video"],
                            ["clean"],
                          ],
                          clipboard: {
                            // toggle to add extra line breaks when pasting HTML:
                            matchVisual: false,
                          },
                          imageResize: {
                            parchment: Quill.import("parchment"),
                            modules: ["Resize", "DisplaySize"],
                          },
                        }}
                      />
                      <div className="col-md-3">
                        <button
                          className="btn btn-danger"
                          onClick={(e) => deleteModule(index)}
                        >
                          Xóa Module
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="row">
                  <div className="col-md">
                    <button
                      className="btn btn-warning"
                      onClick={handleServiceAdd}
                    >
                      Thêm module
                    </button>
                    <button
                      className="btn btn-success ms-3"
                      onClick={submitCourse}
                    >
                      Thêm khóa học
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!addCourse &&
            <div className="d-flex mb-3">
            <div style={{'width':'60%'}} className="d-flex">
                <input
                  type="text"
                  className="form-control "
                  onChange={(e) => SetSearch(e.target.value)}
                  placeholder="Nhập tên khóa học"
                />
                <button className="btn btn-primary" onClick={(e)=>filterCourse()}>Tìm</button>

            </div>
            <div className="ms-3" style={{'width':'20%'}}>
                  <select name="" className="form-control" id="">
                    {Grades.length>0 && Grades.map((item,index)=>(
                      <option key={index} value="">{item.Grade}</option>
                    ))}
                  </select>
                </div>
            </div>
          }

            {!addCourse && courses.length > 0 && (
              <>
                <div
                  className="accordion accordion-flush"
                  id="accordionFlushList"
                >
                  {courses.map((item) => (
                    <div key={item.id} className="accordion-item">
                      <h2
                        className="accordion-header"
                        id={`flush-heading${item.id}`}
                      >
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#flush-collapse${item.id}`}
                          aria-expanded="false"
                          aria-controls={`flush-collapse${item.id}`}
                        >
                          <img
                            src={img + item.image}
                            style={{ height: "100px", width: "auto" }}
                            className="card-img-top img-fluid"
                            alt="..."
                          />
                          <h5 className="ms-3">{item.name}</h5> -
                        </button>
                      </h2>
                      <div
                        id={`flush-collapse${item.id}`}
                        className="accordion-collapse collapse"
                        aria-labelledby={`flush-heading${item.id}`}
                        data-bs-parent="#accordionFlushList"
                      >
                        <div className="accordion-body">
                          <h5>{item.summary}</h5>
                          <h5>Thời gian học : {item.duration}h</h5>
                          <h5>Giá : {Intl.NumberFormat('en-US').format(item.price)} đ</h5>
                          <h5>Khối lớp : {item.Grade}</h5>
                          <a
                            href={`/single/${item.id}`}
                            className="btn btn-primary mt-3"
                          >
                            Xem thêm
                          </a>
                          <a
                            href={`/edit/${item.id}`}
                            className="btn btn-warning mt-3 ms-3"
                          >
                            Sửa đổi
                          </a>
                          <button
                            onClick={(e) => dupplicateCourse(item.id)}
                            className="btn btn-secondary mt-3 ms-3"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={(e) => deleteCourse(item.id)}
                            className="btn btn-danger mt-3 ms-3"
                          >
                            Xoá
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {number.length > 1 && (
                  <nav className="mt-3">
                    <ul className="pagination">
                      <li
                        style={{ listStyle: "none" }}
                        className={`page-item ${page > 1 ? "" : "disabled"}`}
                      >
                        <button
                          className="page-link"
                          tabIndex={-1}
                          aria-disabled="true"
                          onClick={(e)=>setPage(page-1)}
                        >
                          Previous
                        </button>
                      </li>
                      {number &&
                        number.length > 0 &&
                        number.map((item,index) => (
                          <li key={index} className="page-item">
                            <button
                              className="page-link"
                              onClick={(e) => setPage(item)}
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      <li
                        className={`page-item ${
                          page < number[number.length - 1] ? "" : "disabled"
                        }`}
                      >
                        <a className="page-link" href="#">
                          Next
                        </a>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
        </div>
        </div>
        </div>
    </>
  )
}

export default SingleCateCourse