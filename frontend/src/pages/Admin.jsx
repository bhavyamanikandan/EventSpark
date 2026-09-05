import React from "react";

function Admin() {
    return (
        <div className="page">
            <h1>Admin Dashboard</h1>

            <p>
                Organizer controls will appear here.
            </p>

            <div className="admin-card">
                <h2>Create Event</h2>
                <p>Event creation functionality coming soon.</p>

                <button>Create Event</button>
            </div>

            <div className="admin-card">
                <h2>Registrants</h2>
                <p>Registered attendees will appear here.</p>
            </div>
        </div>
    );
}

export default Admin;
