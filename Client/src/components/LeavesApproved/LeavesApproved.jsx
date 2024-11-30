import React, { useEffect, useState } from "react";
import "./LeaveApproval.css";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

const LeavesApproved = () => {
  let [datas, setDatas] = useState([]);
  let dates = [];
  useEffect(() => {
    axios
      .get("http://localhost:3000/ess/leavesapproved", { withCredentials: true })
      .then((res) => {
        setDatas(res.data.datas);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let uniquedates = () => {
    for (let data of datas) {
        let formatteddate = new Date(data.created_at).toLocaleDateString();
            if (!dates.includes(formatteddate)) {
                 dates.push(formatteddate);
                }
    }
  };
  uniquedates();

  return (
    <>
      <Navbar />
      <div className="leave-approval-page">
        <h1>Leaves Approved and Rejected</h1>

        <div className="leave-section">
          {dates.map((date,index) => {
            let dateobj = [];
            for (let request of datas) {
              if (date == new Date(request.created_at).toLocaleDateString()) {
                dateobj.push(request);
              }
            }
            return (
              <>
                <div key={index}>
                  <h2>{date}</h2>
                  {dateobj.map((request) =>
                         (
                            <div
                                key={request.leave_id} 
                              className={`leave-card ${
                                request.leave_type
                                  ? request.leave_type.replace(" ", "-").toLowerCase()
                                  : ""
                              }`}
                            >
                              <div className="user-info">
                                <div className="user-avatar">👤</div>
                                <div className="user-details">
                                  <span className="user-name">{request.emp_name}</span>
                                  <span className="leave-type">
                                    {request.leave_type}
                                  </span>
                                  <span className="leave-date">
                                    On :{" "}
                                    {new Date(request.from_date)
                                      .toISOString()
                                      .slice(0, 10)}
                                    &nbsp;&nbsp;
                                    {request.to_date
                                      ? `To : ${new Date(request.to_date)
                                          .toISOString()
                                          .slice(0, 10)}`
                                      : ""}
                                  </span>
                                  <span className="leave-reason">
                                    Reason : {request.reason_for_leave}
                                  </span>
                                </div>
                              </div>
                              <div>
                                {request.status=="Approved"?(<div className="approved-div">
                                    <h3>Approved😁</h3>
                                </div>):request.status=="Rejected"?(<div className="rejected-div">
                                    <h3>Rejected 😞</h3>
                                    <p>{request.reason_for_reject}</p>
                                </div>):(<div className="Pending-div">
                                    <h3>Pending...</h3>
                                </div>)}
                              </div>
                            </div>
                        )
                  )}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LeavesApproved;