import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="navbar-logo">

        <Link to="/">

          <span className="spark-icon">
            ✦
          </span>

          <span className="logo-event">
            Event
          </span>

          <span className="logo-spark">
            Spark
          </span>

        </Link>

      </div>


      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/events">
          Events
        </Link>

        <Link to="/bookings">
          My Bookings
        </Link>

        <Link to="/admin">
          Admin
        </Link>

      </div>


      <div className="nav-actions">

        <button className="login-button">
          Login
        </button>

        <Link
          to="/bookings"
          className="register-nav-button"
        >
          My Bookings
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;