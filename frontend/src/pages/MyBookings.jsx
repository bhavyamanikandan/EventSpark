import React, { useState } from "react";

function MyBookings() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const searchBookings = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setBookings([]);

    try {
      /*
       * The backend admin endpoint returns bookings
       * for one event, so we first load all events
       * and then check their bookings.
       */
      const eventsResponse = await fetch(
        "http://localhost:5000/api/events"
      );

      const events = await eventsResponse.json();

      if (!eventsResponse.ok) {
        throw new Error("Unable to load events.");
      }

      let allBookings = [];

      for (const event of events) {
        try {
          const response = await fetch(
            "http://localhost:5000/api/admin/events/" +
              event.id +
              "/bookings"
          );

          if (!response.ok) {
            continue;
          }

          const eventBookings = await response.json();

          const matchingBookings = eventBookings
            .filter(
              (booking) =>
                booking.attendee_email.toLowerCase() ===
                email.toLowerCase()
            )
            .map((booking) => ({
              ...booking,
              event_name: event.name,
              event_date: event.event_date,
              venue: event.venue,
              category: event.category,
              price: event.price,
            }));

          allBookings = [
            ...allBookings,
            ...matchingBookings,
          ];
        } catch (eventError) {
          console.error(
            "Error loading event bookings:",
            eventError
          );
        }
      }

      setBookings(allBookings);

      if (allBookings.length === 0) {
        setMessage(
          "No bookings found for this email address."
        );
      }

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to load your bookings."
      );

    } finally {
      setLoading(false);
    }
  };


  const cancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    setCancelling(bookingId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings/" +
          bookingId,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to cancel booking."
        );
      }

      setMessage(
        data.message ||
          "Booking cancelled successfully."
      );

      /*
       * Reload the bookings after cancellation.
       */
      const fakeEvent = {
        preventDefault: () => {},
      };

      await searchBookings(fakeEvent);

    } catch (err) {
      console.error(
        "Cancellation error:",
        err
      );

      setError(
        err.message ||
          "Unable to cancel booking."
      );

    } finally {
      setCancelling(null);
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  const formatPrice = (price) => {
    const value = Number(price || 0);

    if (value === 0) {
      return "FREE";
    }

    return "₹" + value.toLocaleString("en-IN");
  };


  return (
    <div className="bookings-page">

      <div className="bookings-container">

        {/* HEADER */}

        <div className="bookings-header">

          <p className="section-label">
            YOUR EVENTS
          </p>

          <h1>
            My Bookings
          </h1>

          <p>
            Enter the email address you used
            during registration to view your
            bookings.
          </p>

        </div>


        {/* SEARCH */}

        <div className="booking-search-card">

          <form onSubmit={searchBookings}>

            <label htmlFor="booking-email">
              Email Address
            </label>

            <div className="booking-search-row">

              <input
                id="booking-email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Searching..."
                  : "Find My Bookings"}
              </button>

            </div>

          </form>

        </div>


        {/* MESSAGE */}

        {message && (
          <div className="booking-message">
            {message}
          </div>
        )}


        {error && (
          <div className="booking-error">
            {error}
          </div>
        )}


        {/* BOOKINGS */}

        {bookings.length > 0 && (

          <div className="booking-list">

            <div className="booking-list-header">

              <h2>
                Your Bookings
              </h2>

              <span>
                {bookings.length} Booking
                {bookings.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>


            {bookings.map((booking) => (

              <div
                className="booking-card"
                key={booking.id}
              >

                <div className="booking-card-top">

                  <div>

                    <span className="booking-category">
                      {booking.category ||
                        "General"}
                    </span>

                    <h3>
                      {booking.event_name}
                    </h3>

                    <p>
                      📅{" "}
                      {formatDate(
                        booking.event_date
                      )}
                    </p>

                    <p>
                      📍{" "}
                      {booking.venue}
                    </p>

                  </div>


                  <span
                    className={
                      "booking-status " +
                      booking.status
                    }
                  >
                    {booking.status}
                  </span>

                </div>


                <div className="booking-card-bottom">

                  <div>

                    <span>
                      Booking ID
                    </span>

                    <strong>
                      #{booking.id}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Price
                    </span>

                    <strong>
                      {formatPrice(
                        booking.price
                      )}
                    </strong>

                  </div>


                  {booking.status !==
                    "cancelled" && (

                    <button
                      className="cancel-booking-button"
                      onClick={() =>
                        cancelBooking(
                          booking.id
                        )
                      }
                      disabled={
                        cancelling ===
                        booking.id
                      }
                    >
                      {cancelling ===
                      booking.id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyBookings;