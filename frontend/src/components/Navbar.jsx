import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                🎉 EventSpark
            </Link>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/events">Events</Link>
                <Link to="/admin">Admin</Link>
            </div>
        </nav>
    );
}

export default Navbar;