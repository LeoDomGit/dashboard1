import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageResize from "quill-image-resize-module-react";
import Swal from "sweetalert2";
import "../css/style.css";
import { FileUploader } from "react-drag-drop-files";
import Loader from "../components/Loading.jsx/Loader";
Quill.register("modules/imageResize", ImageResize);
function EditCourse() {
  const url = "https://api.trungthanhweb.com/api/";
  const [loading, setLoading] = useState(false);
  const [showImg, setRenderImg] = useState("");
  const [file, setFile] = useState(null);
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
  const uploadFile = (file) => {
    setFile(file);
    console.log(file);
    var str = ``;
    var url = URL.createObjectURL(file);
    str +=
      `
    <div class="imgcol">
        <img src="` +
      url +
      `" class="renderImage" alt="">
    </div>`;
    console.log(str);
    setRenderImg(str);
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
  const [courses, setCourse] = useState([]);
  const { id } = useParams();
  const [moduleList, setModuleList] = useState([{ module: "", detail: "" }]);
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
  const [idCourseCate, SetidCourseCate] = useState(0);
  const [className, setClass] = useState("");
  const addContentModule = (value, index) => {
    const list = [...moduleList];
    list[index].detail = value;
    setModuleList(list);
  };
  const handleServiceAdd = () => {
    setModuleList([...moduleList, { module: "", detail: "" }]);
  };
  const deleteModule = (index) => {
    const updateModuleList = [...moduleList];
    updateModuleList.splice(index, 1);
    setModuleList(updateModuleList);
  };
  const addModule = () => {
    const updateModuleList = [...moduleList];
    updateModuleList.splice(moduleList.length, 0, { module: "", detail: "" });
    setModuleList(updateModuleList);
  };
  const [show3, setShow3] = useState(false);
  const submitCourse = () => {
    const detail = JSON.stringify(moduleList);
    if (
      courseName == "" ||
      courseSummary == "" ||
      detail == "" ||
      coursePrice == 0 ||
      duration == 0 ||file == null
    ) {
      Toast.fire({
        icon: "error",
        title: "Thiếu thông tin khóa học",
      });
    } else {
      const formData = new FormData();
      if (file != null) {
        formData.append("file", file);
      }
      formData.append("name", courseName);
      formData.append("summary", courseSummary);
      formData.append("price", coursePrice);
      formData.append("discount", courseDiscount);
      formData.append("idCourseCate", idCourseCate);
      formData.append("duration", duration);
      formData.append("detail", detail);
      formData.append("id", id);
      formData.append("Grade", className);
      axios({
        method: "post",
        url: url + "editCourse",
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      }).then(function (res) {
        if (res.data.check == true) {
          Toast.fire({
            icon: "success",
            title: "Sửa thành công",
          }).then(() => {
            window.location.replace(`/course/${courses.idCourseCate}`);
          });
        } else {
        }
      });
    }
  };
  useEffect(() => {
    axios({
      method: "get",
      url: url + `getEditCourse/${id}`,
    }).then(function (res) {
      setCourse(res.data[0]);
      setModuleList(JSON.parse(res.data[0].detail));
      setCourseName(res.data[0].name);
      setcourseSummary(res.data[0].summary);
      setcourseDiscount(res.data[0].discount);
      setcoursePrice(res.data[0].price);
      setDuration(res.data[0].duration);
      SetidCourseCate(res.data[0].idCourseCate);
      setClass(res.data[0].Grade);
    });
  }, []);
  return (
    <>
      <Sidebar show={show3} />
      <div className={`content ${show3 ? "" : "open"} mt-3`}>
        {loading && <Loader />}
        <div className="container-fluid">
            <div className="row mt-3">
            <div className="row mt-2 w-100">
                <div className="row">
                  <div className="col-md">
                    <label htmlFor="">Tên khóa học</label>
                    <input
                      value={courseName}
                      type="text"
                      onChange={(e) => setCourseName(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md">
                    <label htmlFor="">Tóm tắt</label>
                    <input
                      value={courseSummary}
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
                      value={coursePrice}
                      type="number"
                      onChange={(e) => setcoursePrice(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md">
                    <label htmlFor="">Giảm giá</label>
                    <input
                    value={courseDiscount}
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
                <div className="row mt-2" >
                  {showImg!='' &&
                  <div className="imgRow"
                  dangerouslySetInnerHTML={{__html: showImg}}
                  />
                  }
                </div>
                {moduleList.map((item, index) => (
                  <div key={index} className="row mb-5">
                    <div className="col-md">
                      <div className="row">
                        <div className="col-md">
                          <div className="row">
                            <div className="col-md-8">Tên Module</div>
                          </div>

                          <input
                            type="text"
                            value={item.module}
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
                      value={item.detail}
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
                <div className="row">
                    <div className="col-md">
                         <button className="btn btn-primary" onClick={submitCourse}>Sửa</button>
                         <button className="btn btn-warning ms-3" onClick={addModule}>Thêm Module</button>
                    </div>
                </div>
              </div>
            </div>
        </div>
    </div>
    </>
  );
}

export default EditCourse;
