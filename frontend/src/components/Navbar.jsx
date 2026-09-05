import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">

            <Link to="/" className="logo">
                ✦ Event<span style={{ color: "#7c3aed" }}>Spark</span>
            </Link>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/events">Events</Link>
                <Link to="/events">My Bookings</Link>
                <Link to="/admin">About Us</Link>
            </div>

            <div className="nav-buttons">

                <Link to="/events" className="login-btn">
                    ↪ Login
                </Link>

                <Link to="/events" className="register-btn">
                    ♙ Register
                </Link>

            </div>

        </nav>
    );
}

export default Navbar;