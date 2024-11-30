import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import axios from "axios";
import { useEffect } from "react";

const Navbar = ({ setIsAuthenticated }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  let [userrole,setuserRole]=useState("");
  useEffect(() => {
    axios
      .get("http://localhost:3000/validate", { withCredentials: true })
      .then((res) => {
        setuserRole(res.data.role);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/ess/logout", { withCredentials: true })
      .then((res) => {
        console.log(res.data.message);
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <NavLink
          to="/leaverequest"
          className="nav-link"
          activeClassName="active"
        >
          Leave Request
        </NavLink>
        <NavLink to="/holidays" className="nav-link" activeClassName="active">
          Holidays
        </NavLink>
        <NavLink to="/rules" className="nav-link" activeClassName="active">
          Rules & Regulations
        </NavLink>
        {(userrole=="Manager"||userrole=="CEO" ||userrole=="teamlead") && (<NavLink to="/leaveapproval" className="nav-link">
            Leave Approval
          </NavLink>)}
          {/* <NavLink to="/leaveapproval" className="nav-link">
            Leave Approval
          </NavLink> */}
        {userrole && userrole === "Developer" && (
          <NavLink to="/leavesapproved" className="nav-link">
            Leaves Approved
          </NavLink>
        )}
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      <button
        className="hamburger"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span>__</span>
        <span>__</span>
        <span>__</span>
      </button>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <NavLink
            to="/leaverequest"
            className="nav-link"
            activeClassName="active"
            onClick={toggleMobileMenu}
          >
            Leave Request
          </NavLink>
          <NavLink
            to="/holidays"
            className="nav-link"
            activeClassName="active"
            onClick={toggleMobileMenu}
          >
            Holidays
          </NavLink>
          <NavLink
            to="/rules"
            className="nav-link"
            activeClassName="active"
            onClick={toggleMobileMenu}
          >
            Rules & Regulations
          </NavLink>
          <NavLink
            to="/leaveapproval"
            className="nav-link"
            activeClassName="active"
            onClick={toggleMobileMenu}
          >
            Leave Approval
          </NavLink>
          <button
            className="logout-button"
            onClick={() => {
              handleLogout();
              toggleMobileMenu();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
