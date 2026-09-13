import React, { useEffect, useState } from "react";

function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [formData, setFormData] = useState({
    attendee_name: "",
    attendee_email: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOAD EVENTS
  // =====================================================

  const loadEvents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/events"
      );

      if (!response.ok) {
        throw new Error("Failed to load events");
      }

      const data = await response.json();

      setEvents(data);

    } catch (error) {
      console.error("Error loading events:", error);
      setMessage("Unable to load events.");
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

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

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (dateString) => {

    const date = new Date(dateString);

    return {
      day: String(date.getDate()).padStart(2, "0"),

      month: date
        .toLocaleString("en-US", {
          month: "short",
        })
        .toUpperCase(),

      year: date.getFullYear(),
    };
  };

  // =====================================================
  // IMAGE
  // =====================================================

  const getImageClass = (index) => {

    const images = [
      "event-picture-1",
      "event-picture-2",
      "event-picture-3",
    ];

    return images[index % images.length];
  };

  // =====================================================
  // OPEN REGISTRATION MODAL
  // =====================================================

  const openRegistration = (event) => {

    setSelectedEvent(event);

    setFormData({
      attendee_name: "",
      attendee_email: "",
    });

    setMessage("");
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {

    setSelectedEvent(null);

    setFormData({
      attendee_name: "",
      attendee_email: "",
    });

    setMessage("");
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister = async (e) => {

    e.preventDefault();

    if (!selectedEvent) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const response = await fetch(
        `http://localhost:5000/api/events/${selectedEvent.id}/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            attendee_name:
              formData.attendee_name,

            attendee_email:
              formData.attendee_email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Registration failed"
        );
      }

      setMessage(data.message);

      // Reload event data so seat count updates
      await loadEvents();

      // Update selected event
      const updatedEvent =
        events.find(
          (event) =>
            event.id === selectedEvent.id
        );

      if (updatedEvent) {
        setSelectedEvent(updatedEvent);
      }

      setFormData({
        attendee_name: "",
        attendee_email: "",
      });

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

      setMessage(error.message);

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // PRICE FORMAT
  // =====================================================

  const formatPrice = (price) => {

    const numericPrice =
      Number(price || 0);

    if (numericPrice === 0) {
      return "FREE";
    }

    return "₹" + numericPrice.toLocaleString(
      "en-IN"
    );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="events-page">

      {/* =================================================
          EVENTS HERO
      ================================================= */}

      <section className="events-hero">

        <div className="events-hero-content">

          <p className="section-label">
            EXPLORE
          </p>

          <h1>
            Discover Your
            <span> Next Experience</span>
          </h1>

          <p>
            Find exciting events, connect with
            people, and create unforgettable
            memories.
          </p>

          <div className="events-search">

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

        </div>

      </section>


      {/* =================================================
          EVENTS SECTION
      ================================================= */}

      <section className="events-section">

        <div className="events-heading">

          <div>

            <p className="section-label">
              ALL EVENTS
            </p>

            <h2>
              Find Something Amazing
            </h2>

          </div>

          <span>
            {filteredEvents.length} Events
          </span>

        </div>


        {/* =================================================
            EVENT GRID
        ================================================= */}

        {filteredEvents.length === 0 ? (

          <div className="no-events">

            <h2>
              No events found
            </h2>

            <p>
              Try searching for another
              event or category.
            </p>

          </div>

        ) : (

          <div className="events-grid">

            {filteredEvents.map(
              (event, index) => {

                const date =
                  formatDate(
                    event.event_date
                  );

                const isFull =
                  event.status === "full";

                return (

                  <div
                    className="event-card"
                    key={event.id}
                  >

                    {/* IMAGE */}

                    <div
                      className={
                        "event-card-image " +
                        getImageClass(index)
                      }
                    >

                      <span className="event-category">

                        {event.category ||
                          "General"}

                      </span>

                      <span className="event-status">

                        {isFull
                          ? "FULL"
                          : "AVAILABLE"}

                      </span>

                    </div>


                    {/* CONTENT */}

                    <div className="event-card-content">

                      {/* DATE */}

                      <div className="event-date">

                        <strong>
                          {date.day}
                        </strong>

                        <span>
                          {date.month}
                        </span>

                        <small>
                          {date.year}
                        </small>

                      </div>


                      {/* DETAILS */}

                      <div className="event-info">

                        <h3>
                          {event.name}
                        </h3>

                        <p>
                          📍 {event.venue}
                        </p>

                        <p className="event-description">
                          {event.description}
                        </p>

                      </div>

                    </div>


                    {/* BOTTOM */}

                    <div className="event-card-footer">

                      <div>

                        <span className="seat-info">
                          👥{" "}
                          {event.seats_booked}
                          /
                          {event.seat_limit}
                          {" "}Seats
                        </span>

                        <span className="available-info">

                          {isFull
                            ? "Waitlist available"
                            : event.available_seats +
                              " seats left"}

                        </span>

                      </div>


                      <div className="event-price">

                        {formatPrice(
                          event.price
                        )}

                      </div>

                    </div>


                    {/* BUTTON */}

                    <button
                      className={
                        isFull
                          ? "event-button waitlist-button"
                          : "event-button"
                      }
                      onClick={() =>
                        openRegistration(event)
                      }
                    >

                      {isFull
                        ? "Join Waitlist"
                        : "Register Now"}

                    </button>

                  </div>

                );
              }
            )}

          </div>

        )}

      </section>


      {/* =================================================
          REGISTRATION MODAL
      ================================================= */}

      {selectedEvent && (

        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="registration-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={closeModal}
            >
              ×
            </button>


            <p className="section-label">
              EVENT REGISTRATION
            </p>

            <h2>
              {selectedEvent.name}
            </h2>

            <p className="modal-location">
              📍 {selectedEvent.venue}
            </p>


            <div className="modal-event-info">

              <div>
                <span>Category</span>
                <strong>
                  {selectedEvent.category ||
                    "General"}
                </strong>
              </div>

              <div>
                <span>Price</span>
                <strong>
                  {formatPrice(
                    selectedEvent.price
                  )}
                </strong>
              </div>

              <div>
                <span>Availability</span>
                <strong>
                  {selectedEvent.status ===
                  "full"
                    ? "Waitlist"
                    : selectedEvent.available_seats +
                      " Seats"}
                </strong>
              </div>

            </div>


            {/* SUCCESS / ERROR MESSAGE */}

            {message && (

              <div className="registration-message">

                {message}

              </div>

            )}


            {/* FORM */}

            <form
              onSubmit={handleRegister}
            >

              <label>
                Your Name
              </label>

              <input
                type="text"
                name="attendee_name"
                placeholder="Enter your name"
                value={
                  formData.attendee_name
                }
                onChange={handleChange}
                required
              />


              <label>
                Email Address
              </label>

              <input
                type="email"
                name="attendee_email"
                placeholder="Enter your email"
                value={
                  formData.attendee_email
                }
                onChange={handleChange}
                required
              />


              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >

                {loading
                  ? "Processing..."
                  : selectedEvent.status ===
                    "full"
                  ? "Join Waitlist"
                  : "Confirm Registration"}

              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Events;