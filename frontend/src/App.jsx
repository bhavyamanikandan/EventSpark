import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import Admin from "./pages/Admin.jsx";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </main>

            <footer>
                <p>© 2026 EventSpark. All rights reserved.</p>
            </footer>
        </BrowserRouter>
    );
}

export default App;