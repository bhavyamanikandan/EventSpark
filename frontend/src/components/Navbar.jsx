import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const [name, setName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();

        if (!name || !registerEmail || !registerPassword) {
            alert("Please fill in all fields.");
            return;
        }

        alert("Registration successful!");

        setName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setShowRegister(false);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (!loginEmail || !loginPassword) {
            alert("Please enter your email and password.");
            return;
        }

        alert("Login successful!");

        setLoginEmail("");
        setLoginPassword("");
        setShowLogin(false);
    };

    const openLogin = () => {
        setShowRegister(false);
        setShowLogin(true);
    };

    const openRegister = () => {
        setShowLogin(false);
        setShowRegister(true);
    };

    return (
        <>
            {/* ================= NAVBAR ================= */}

            <nav className="navbar">

                <div className="navbar-container">

                    {/* LOGO */}
                    <Link to="/" className="navbar-logo">
                        Event<span>Spark</span>
                    </Link>


                    {/* NAVIGATION LINKS */}
                    <div className="navbar-links">

                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/events">
                            Events
                        </Link>

                        <Link to="/about">
                            About Us
                        </Link>

                        <Link to="/bookings">
                            My Bookings
                        </Link>

                        {/* ADMIN */}
                        <Link to="/admin">
                            Admin
                        </Link>

                    </div>


                    {/* LOGIN / REGISTER */}
                    <div className="navbar-actions">

                        <button
                            className="login-button"
                            onClick={openLogin}
                        >
                            Login
                        </button>

                        <button
                            className="register-button"
                            onClick={openRegister}
                        >
                            Register
                        </button>

                    </div>

                </div>

            </nav>


            {/* ================= LOGIN POPUP ================= */}

            {showLogin && (

                <div
                    className="register-overlay"
                    onClick={() => setShowLogin(false)}
                >

                    <div
                        className="register-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button
                            className="modal-close"
                            onClick={() => setShowLogin(false)}
                        >
                            ×
                        </button>

                        <div className="register-header">

                            <div className="register-icon">
                                🔐
                            </div>

                            <p>
                                WELCOME BACK
                            </p>

                            <h2>
                                Login to EventSpark
                            </h2>

                            <span>
                                Sign in to manage your events and bookings.
                            </span>

                        </div>


                        <form
                            className="register-form"
                            onSubmit={handleLogin}
                        >

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={loginEmail}
                                onChange={(e) =>
                                    setLoginEmail(e.target.value)
                                }
                            />


                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={loginPassword}
                                onChange={(e) =>
                                    setLoginPassword(e.target.value)
                                }
                            />


                            <button
                                type="submit"
                                className="register-submit"
                            >
                                Login
                            </button>

                        </form>


                        <p className="register-footer">

                            Don't have an account?{" "}

                            <button
                                type="button"
                                onClick={openRegister}
                                style={{
                                    border: "none",
                                    background: "none",
                                    color: "#7c3aed",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    fontSize: "14px"
                                }}
                            >
                                Register
                            </button>

                        </p>

                    </div>

                </div>

            )}


            {/* ================= REGISTER POPUP ================= */}

            {showRegister && (

                <div
                    className="register-overlay"
                    onClick={() => setShowRegister(false)}
                >

                    <div
                        className="register-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button
                            className="modal-close"
                            onClick={() => setShowRegister(false)}
                        >
                            ×
                        </button>


                        <div className="register-header">

                            <div className="register-icon">
                                ✨
                            </div>

                            <p>
                                JOIN EVENTSPARK
                            </p>

                            <h2>
                                Create Your Account
                            </h2>

                            <span>
                                Register to discover amazing events
                                and manage your bookings.
                            </span>

                        </div>


                        <form
                            className="register-form"
                            onSubmit={handleRegister}
                        >

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />


                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={registerEmail}
                                onChange={(e) =>
                                    setRegisterEmail(e.target.value)
                                }
                            />


                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Create a password"
                                value={registerPassword}
                                onChange={(e) =>
                                    setRegisterPassword(e.target.value)
                                }
                            />


                            <button
                                type="submit"
                                className="register-submit"
                            >
                                Create Account
                            </button>

                        </form>


                        <p className="register-footer">

                            Already have an account?{" "}

                            <button
                                type="button"
                                onClick={openLogin}
                                style={{
                                    border: "none",
                                    background: "none",
                                    color: "#7c3aed",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    fontSize: "14px"
                                }}
                            >
                                Login
                            </button>

                        </p>

                    </div>

                </div>

            )}

        </>
    );
}

export default Navbar;