import React, { useEffect, useState } from "react";
import "./LeaveApproval.css";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

const LeaveApproval = () => {
  let [datas, setDatas] = useState([]);
  let dates = [];
  useEffect(() => {
    axios.get("http://localhost:3000/ess/leaveapproval", { withCredentials: true })
      .then((res) => {
        setDatas(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const [rejectReason, setRejectReason] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);

  const handleApprove = (request) => {
    setCurrentRequest(request);
    axios
      .post(
        "http://localhost:3000/ess/leaveapproval",
        {
          status: "approved",
          leave_id: request.leave_id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("Leaverequestapproved:", res.data.thisrequest);
        setLeaverequestsToday((prev) =>
          prev.filter((item) => item.leave_id != request.leave_id)
        );
        setleaverequestsyesterday((prev) =>
          prev.filter((item) => item.leave_id != request.leave_id)
        );
      });
      location.reload();
  };

  const handleRejectClick = (request) => {
    setShowPopup(true);
    setCurrentRequest(request);
  };

  const handleReject = () => {
    if (currentRequest) {
      console.log(
        `${currentRequest.emp_name} is rejected! due to ${rejectReason}`
      );
      axios
        .post(
          "http://localhost:3000/ess/leaveapproval",
          {
            status: "rejected",
            leave_id: currentRequest.leave_id,
            reason_for_reject: rejectReason,
          },
          { withCredentials: true }
        )
        .then((res) => {
          console.log("Leaverequest :", res.data.thisrequest);
          setLeaverequestsToday((prev) =>
            prev.filter((item) => item.leave_id != currentRequest.leave_id)
          );
          setleaverequestsyesterday((prev) =>
            prev.filter((item) => item.leave_id != currentRequest.leave_id)
          );
        })
        .catch((err) => console.log(err));
      setRejectReason("");
      setShowPopup(false);
    }
    location.reload();
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setRejectReason("");
  };

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
        <h1>Leave Approval</h1>

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
                                <button className="approve-button reject-button" onClick={()=>handleRejectClick(request)}>
                                  Reject
                                </button>
                                <button className="approve-button" onClick={()=>handleApprove(request)}>Approve</button>
                              </div>
                            </div>
                          )
                  )}
                </div>
              </>
            );
          })}
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>Reject Leave Request</h3>
              <textarea
                rows="4"
                placeholder="Enter reason for rejection"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              ></textarea>
              <button onClick={handleReject}>Submit</button>
              <button onClick={handleClosePopup}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LeaveApproval;