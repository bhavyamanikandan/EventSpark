import React from "react";
import { Link } from "react-router-dom";

function Home() {
    const events = [
        {
            title: "Live Concert: Midnight Vibes",
            category: "Music",
            date: "24 AUG",
            location: "Chennai, Tamil Nadu",
            seats: "120/200 Seats",
            price: "₹499",
            image:
                "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Tech Summit 2026",
            category: "Conference",
            date: "30 AUG",
            location: "Bangalore, Karnataka",
            seats: "80/150 Seats",
            price: "₹999",
            image:
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Cooking Masterclass",
            category: "Workshop",
            date: "05 SEP",
            location: "Coimbatore, Tamil Nadu",
            seats: "25/50 Seats",
            price: "₹799",
            image:
                "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <div className="home">

            {/* HERO SECTION */}
            <section className="hero">

                <div className="hero-overlay"></div>

                <div className="hero-content">

                    <span className="hero-badge">
                        ⚡ Discover • Book • Experience
                    </span>

                    <h1>
                        Experience Events
                        <br />
                        <span>That Spark Joy</span>
                    </h1>

                    <p>
                        Find amazing events, book your spot, and create
                        unforgettable memories with EventSpark.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/events" className="primary-btn">
                            🔍 Browse Events
                        </Link>

                        <Link to="/events" className="secondary-btn">
                            🎟️ My Bookings
                        </Link>
                    </div>

                </div>

                {/* SEARCH */}
                <div className="hero-search">
                    <input
                        type="text"
                        placeholder="Search events, categories, or venues..."
                    />
                    <button>🔍</button>
                </div>

                {/* STATS */}
                <div className="stats">

                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div>
                            <h3>50+</h3>
                            <p>Events</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div>
                            <h3>2.5K+</h3>
                            <p>Attendees</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🎟️</div>
                        <div>
                            <h3>1.8K+</h3>
                            <p>Tickets Booked</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div>
                            <h3>4.9</h3>
                            <p>Rating</p>
                        </div>
                    </div>

                </div>

            </section>


            {/* FEATURED EVENTS */}
            <section className="featured">

                <div className="section-header">
                    <div>
                        <p className="section-label">DON'T MISS OUT</p>
                        <h2>Featured Events</h2>
                    </div>

                    <Link to="/events" className="view-link">
                        View All Events →
                    </Link>
                </div>


                <div className="content-grid">

                    {/* EVENT CARDS */}
                    <div className="event-grid">

                        {events.map((event, index) => (

                            <div className="event-card" key={index}>

                                <div className="event-image">

                                    <img
                                        src={event.image}
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
                                        {event.date.split(" ")[0]}
                                        <small>
                                            {event.date.split(" ")[1]}
                                        </small>
                                    </div>

                                    <div className="event-details">

                                        <h3>{event.title}</h3>

                                        <p>
                                            📍 {event.location}
                                        </p>

                                    </div>

                                </div>

                                <div className="event-bottom">

                                    <span>
                                        👥 {event.seats}
                                    </span>

                                    <strong>
                                        {event.price}
                                    </strong>

                                </div>

                            </div>

                        ))}

                    </div>


                    {/* ORGANIZER CARD */}
                    <div className="organizer-card">

                        <span>FOR ORGANIZERS</span>

                        <h2>
                            Create & Manage
                            <br />
                            Events with Ease
                        </h2>

                        <p>
                            Powerful tools to create, manage and grow
                            your events.
                        </p>

                        <Link to="/admin" className="create-btn">
                            Create Event
                            <span>＋</span>
                        </Link>

                        <div className="organizer-decoration">
                            ✦
                        </div>

                    </div>

                </div>

            </section>


            {/* WHY EVENTSPARK */}
            <section className="why-section">

                <p className="section-label">WHY EVENTSPARK?</p>

                <h2>
                    Everything you need for
                    <span> unforgettable events.</span>
                </h2>

                <div className="features">

                    <div className="feature">
                        <div>🎟️</div>
                        <h3>Easy Booking</h3>
                        <p>
                            Book your favourite events in just a few clicks.
                        </p>
                    </div>

                    <div className="feature">
                        <div>💺</div>
                        <h3>Smart Seats</h3>
                        <p>
                            Real-time seat availability with automatic
                            waitlists.
                        </p>
                    </div>

                    <div className="feature">
                        <div>📧</div>
                        <h3>Instant Updates</h3>
                        <p>
                            Get booking and waitlist notifications instantly.
                        </p>
                    </div>

                    <div className="feature">
                        <div>🛡️</div>
                        <h3>Secure</h3>
                        <p>
                            Your registration information is securely managed.
                        </p>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;