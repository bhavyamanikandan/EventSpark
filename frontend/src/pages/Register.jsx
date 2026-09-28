import React, { useState } from "react";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();
        console.log("Registering event:", eventId);

        if (!name || !email || !password) {
            setMessage("Please fill in all fields.");
            return;
        }

        setMessage("Registration successful!");
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-icon">✨</div>

                <p className="auth-label">JOIN EVENTSPARK</p>

                <h1>Create Your Account</h1>

                <p className="auth-subtitle">
                    Register to discover events and manage your bookings.
                </p>

                <form onSubmit={handleRegister}>

                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" className="auth-button">
                        Create Account
                    </button>

                </form>

                {message && (
                    <p className="auth-message">
                        {message}
                    </p>
                )}

            </div>
        </div>
    );
}

export default Register;