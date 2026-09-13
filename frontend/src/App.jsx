import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Events from "./pages/Events";
import Admin from "./pages/Admin";
import MyBookings from "./pages/MyBookings";


function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/bookings"
          element={<MyBookings />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;