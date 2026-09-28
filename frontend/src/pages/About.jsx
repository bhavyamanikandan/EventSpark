import React from "react";

function About() {
    return (
        <div className="about-page">

            {/* ================= HERO ================= */}

            <section className="about-hero">

                <div className="about-hero-content">

                    <p className="about-label">
                        ABOUT EVENTSPARK
                    </p>

                    <h1>
                        Where Events
                        <br />
                        <span>Become Memories.</span>
                    </h1>

                    <p>
                       <span>
                        EventSpark makes it simple to discover exciting
                        events, reserve your seat, and experience moments
                        worth remembering.</span>
                    </p>

                </div>

            </section>


            {/* ================= INTRO ================= */}

            <section className="about-content">

                <div className="about-intro">

                    <p className="section-label">
                        DISCOVER EVENTSPARK
                    </p>

                    <h2  className="about-title">
                        Everything you need to
                        <span> experience more.</span>
                    </h2>

                    <p className="about-description">
                        EventSpark is an event discovery and registration
                        platform designed to connect people with concerts,
                        conferences, workshops, networking events and more.
                        From finding the perfect event to securing your seat,
                        EventSpark keeps the entire experience simple and
                        organized.
                        
                    </p>

                </div>


                {/* ================= FEATURES ================= */}

                <div className="about-features">

                    <div className="about-card">

                        <div className="about-card-icon">
                            🔎
                        </div>

                        <h3>
                            Discover Events
                        </h3>

                        <p>
                            Explore concerts, conferences, workshops,
                            networking events and other experiences
                            in one place.
                        </p>

                    </div>


                    <div className="about-card">

                        <div className="about-card-icon">
                            🎟️
                        </div>

                        <h3>
                            Easy Registration
                        </h3>

                        <p>
                            Find an event you love and reserve your seat
                            quickly with a simple registration process.
                        </p>

                    </div>


                    <div className="about-card">

                        <div className="about-card-icon">
                            💺
                        </div>

                        <h3>
                            Smart Seat Management
                        </h3>

                        <p>
                            See available seats in real time and keep track
                            of your event registration status.
                        </p>

                    </div>


                    <div className="about-card">

                        <div className="about-card-icon">
                            ⏳
                        </div>

                        <h3>
                            Automatic Waitlist
                        </h3>

                        <p>
                            When an event reaches capacity, attendees can
                            join the waitlist instead of losing their place.
                        </p>

                    </div>


                    <div className="about-card">

                        <div className="about-card-icon">
                            📧
                        </div>

                        <h3>
                            Instant Updates
                        </h3>

                        <p>
                            Stay informed about your registration and
                            waitlist status with timely notifications.
                        </p>

                    </div>


                    <div className="about-card">

                        <div className="about-card-icon">
                            🛡️
                        </div>

                        <h3>
                            Simple & Secure
                        </h3>

                        <p>
                            Event registration information is organized
                            and managed through the EventSpark platform.
                        </p>

                    </div>

                </div>

            </section>


            {/* ================= BOTTOM SECTION ================= */}

            <section className="about-bottom">

                <div>

                    <p className="section-label">
                        THE EVENTSPARK EXPERIENCE
                    </p>

                    <h2>
                        Discover something
                        <span> worth remembering.</span>
                    </h2>

                </div>

                <div className="about-stats">

                    <div>
                        <strong>50+</strong>
                        <span>Events</span>
                    </div>

                    <div>
                        <strong>2.5K+</strong>
                        <span>Attendees</span>
                    </div>

                    <div>
                        <strong>1.8K+</strong>
                        <span>Bookings</span>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default About;