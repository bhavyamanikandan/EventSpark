import React from "react";

function Events() {
    return (
        <div className="page">
            <h1>Events</h1>

            <div className="event-card">
                <h2>Tech Conference 2026</h2>
                <p>📅 20 September 2026</p>
                <p>📍 Delhi</p>
                <p>Status: Available</p>

                <button>Register</button>
            </div>

            <div className="event-card">
                <h2>Music Festival</h2>
                <p>📅 5 October 2026</p>
                <p>📍 Delhi</p>
                <p>Status: Available</p>

                <button>Register</button>
            </div>
        </div>
    );
}

export default Events;