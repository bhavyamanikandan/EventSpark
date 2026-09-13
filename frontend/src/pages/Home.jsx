import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load events");
        }

        return response.json();
      })
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => {
        console.error("Error loading events:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredEvents = events.filter((event) => {
    const text =
      String(event.name || "") +
      " " +
      String(event.description || "") +
      " " +
      String(event.venue || "") +
      " " +
      String(event.category || "");

    return text
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const featuredEvents = filteredEvents.slice(0, 3);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return {
      day: String(date.getDate()).padStart(2, "0"),
      month: date
        .toLocaleString("en-US", {
          month: "short",
        })
        .toUpperCase(),
    };
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price || 0);

    if (numericPrice === 0) {
      return "FREE";
    }

    return "₹" + numericPrice.toLocaleString("en-IN");
  };

  const getImageClass = (index) => {
    const images = [
      "event-image-one",
      "event-image-two",
      "event-image-three",
    ];

    return images[index % images.length];
  };

  return (
    <div className="home-page">

      {/* HERO SECTION */}

      <section className="hero-section">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <span className="hero-badge">
            ✦ Discover • Book • Experience
          </span>

          <h1>
            Experience Events
            <br />
            <span>That Spark Joy</span>
          </h1>

          <p>
            Find amazing events, book your spot,
            and create unforgettable memories
            with EventSpark.
          </p>

          <div className="hero-buttons">

            <Link
              to="/events"
              className="primary-button"
            >
              Browse Events →
            </Link>

            <Link
              to="/admin"
              className="secondary-button"
            >
              My Bookings
            </Link>

          </div>

        </div>


        {/* HERO SEARCH + STATS */}

        <div className="hero-side">

          <div className="search-box">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search events, categories, or venues..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon">
                🎫
              </div>

              <div>
                <h3>{events.length}+</h3>
                <p>Events</p>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon">
                👥
              </div>

              <div>
                <h3>2.5K+</h3>
                <p>Attendees</p>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon">
                🎟️
              </div>

              <div>
                <h3>
                  {events.reduce(
                    (total, event) =>
                      total +
                      Number(event.seats_booked || 0),
                    0
                  )}
                </h3>

                <p>Tickets Booked</p>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon">
                ⭐
              </div>

              <div>
                <h3>4.9</h3>
                <p>Rating</p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* FEATURED EVENTS */}

      <section className="featured-section">

        <div className="section-heading">

          <div>

            <p className="section-label">
              FEATURED EVENTS
            </p>

            <h2>
              Don't Miss Out
            </h2>

          </div>

          <Link to="/events">
            View All Events →
          </Link>

        </div>


        {loading ? (

          <div className="no-events">
            <h2>Loading Events...</h2>
          </div>

        ) : featuredEvents.length === 0 ? (

          <div className="no-events">

            <h2>
              No Events Available
            </h2>

            <p>
              Check back soon for exciting events.
            </p>

          </div>

        ) : (

          <div className="featured-layout">

            <div className="featured-events">

              {featuredEvents.map(
                (event, index) => {

                  const date =
                    formatDate(
                      event.event_date
                    );

                  const isFull =
                    event.status === "full";

                  return (

                    <div
                      className="featured-card"
                      key={event.id}
                    >

                      <div
                        className={
                          "event-image " +
                          getImageClass(index)
                        }
                      >

                        <span className="category">
                          {event.category ||
                            "General"}
                        </span>

                        <button
                          className="heart"
                          type="button"
                          aria-label="Favorite event"
                        >
                          ♡
                        </button>

                      </div>


                      <div className="featured-content">

                        <div className="date-box">

                          <strong>
                            {date.day}
                          </strong>

                          <span>
                            {date.month}
                          </span>

                        </div>


                        <div className="event-details">

                          <h3>
                            {event.name}
                          </h3>

                          <p>
                            📍 {event.venue}
                          </p>

                          <div className="event-bottom">

                            <span>
                              👥{" "}
                              {event.available_seats}
                              {" "}seats left
                            </span>

                            <strong>
                              {formatPrice(
                                event.price
                              )}
                            </strong>

                          </div>

                        </div>

                      </div>

                    </div>

                  );
                }
              )}

            </div>


            {/* PROMO CARD */}

            <div className="promo-card">

              <p>
                FOR ORGANIZERS
              </p>

              <h2>
                Organizing an Event?
              </h2>

              <span>
                Create and manage your events
                with ease. Reach more people
                and make your event successful.
              </span>

              <Link
                to="/admin"
                className="promo-button"
              >
                Create Event →
              </Link>

            </div>

          </div>

        )}

      </section>

    </div>
  );
}

export default Home;