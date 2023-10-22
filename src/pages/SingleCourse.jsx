import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import "../css/style2.css";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
function SingleCourse() {
    const url = "https://api.trungthanhweb.com/api/";
  const urlimg = "https://api.trungthanhweb.com/images/";
  const [data, setData] = useState({});
  const [module, setModule] = useState([]);
  const { id } = useParams();
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
  useEffect(() => {
    axios({
      method: "get",
      url: url + `singlecourse/${id}`,
    }).then(function (res) {
      setData(res.data[0]);
      const modules = JSON.parse(res.data[0].detail);
      setModule(modules);
      console.log(data);
    });
  }, []);
  return (
    <>
        <Sidebar/>

        <div className="row mt-4">
            <div className="col-md-4 ms-3">
              <h4 className="title text-danger">Tên khóa học : {data.name}</h4>
              <h4 className="title">Chương trình học : {data.majorname}</h4>
              <h4 className="title">Thời gian học : {data.duration}</h4>
              <h4 className="title">
                Giá : {Intl.NumberFormat("en-US").format(Number(data.price))}
              </h4>
              <h4 className="title">Giảm giá : {data.discount} %</h4>
              <h4 className="title">Nội dung tóm tắt : {data.summary}</h4>
            </div>
            <div className="col-md">
              <img
                className="img-fluid"
                style={{ height: "120px", width: "auto" }}
                src={urlimg + data.image}
                alt=""
              />
            </div>
          </div>
          <div className="row mt-5 mb-5">
            <div className="accordion accordion-flush" id="accordionFlushExample">
            {module &&
                module.length > 0 &&
                module.map((item, index) => (
              <div key={index} className="accordion-item">
                <h2 className="accordion-header" id="flush-headingOne">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#flush-collapse${++index}`}
                    aria-expanded="false"
                    aria-controls={`flush-collapse${index}`}
                  >
                   {item.module}
                  </button>
                </h2>
                <div
                  id={`flush-collapse${index}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`flush-heading${++index}`}
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body">
                  <div
                      dangerouslySetInnerHTML={{__html: item.detail}}

                    />
                  </div>
                </div>
              </div>
                ))}
            </div>
          </div>
    </>
  )
}

export default SingleCourse