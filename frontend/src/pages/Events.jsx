import React, { useEffect, useState } from "react";

function Events() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        fetch("http://localhost:5000/api/events")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to load events");
                }

                return response.json();
            })
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setError("Unable to load events.");
                setLoading(false);
            });

    }, []);

    if (loading) {
        return (
            <div className="featured">
                <h2>Loading Events...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="featured">
                <h2>{error}</h2>
                <p>Make sure the EventSpark backend is running.</p>
            </div>
        );
    }

    return (
        <div className="featured">

            <div className="section-header">

                <div>
                    <p className="section-label">
                        EXPLORE
                    </p>

                    <h2>
                        Discover Amazing Events
                    </h2>
                </div>

                <span>
                    {events.length} Events Available
                </span>

            </div>

            <div className="event-grid">

                {events.map(event => {

                    const imageMap = {
                        Music:
                            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",

                        Conference:
                            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",

                        Workshop:
                            "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",

                        Business:
                            "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"
                    };

                    return (
                        <div
                            className="event-card"
                            key={event.id}
                        >

                            <div className="event-image">

                                <img
                                    src={imageMap[event.category]}
                                    alt={event.title}
                                />

                                <span className="category">
                                    {event.category}
                                </span>

                                <button className="heart">
                                    ♡
                                </button>

                            </div>

                            <div className="event-info">

                                <div className="date-box">
                                    {event.date.substring(0, 2)}

                                    <small>
                                        AUG
                                    </small>
                                </div>

                                <div className="event-details">

                                    <h3>
                                        {event.title}
                                    </h3>

                                    <p>
                                        📍 {event.location}
                                    </p>

                                    <p>
                                        📅 {event.date}
                                    </p>

                                </div>

                            </div>

                            <div className="event-bottom">

                                <span>
                                    💺 {event.availableSeats} seats left
                                </span>

                                <strong>
                                    ₹{event.price}
                                </strong>

                            </div>

                            <div style={{
                                padding: "0 18px 18px"
                            }}>

                                {event.status === "Full" ? (

                                    <button
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border: "none",
                                            borderRadius: "8px",
                                            background: "#ddd",
                                            color: "#666",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        ⏳ Join Waitlist
                                    </button>

                                ) : (

                                    <button
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border: "none",
                                            borderRadius: "8px",
                                            background:
                                                "linear-gradient(135deg,#7c3aed,#a855f7)",
                                            color: "white",
                                            fontWeight: "bold",
                                            cursor: "pointer"
                                        }}
                                    >
                                        🎟️ Register Now
                                    </button>

                                )}

                            </div>

                        </div>
                    );

                })}

            </div>

        </div>
    );
}

export default Events;