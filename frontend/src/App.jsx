import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Events from "./pages/Events";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* Events */}
                <Route path="/events" element={<Events />} />

                {/* Bookings */}
                <Route path="/bookings" element={<MyBookings />} />

                {/* About */}
                <Route path="/about" element={<About />} />

                {/* Login */}
                <Route path="/login" element={<Login />} />

                {/* Register */}
                <Route path="/register" element={<Register />} />

                {/* Admin */}
                <Route path="/admin" element={<Admin />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;