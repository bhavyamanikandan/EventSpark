import React, { useState } from "react";

function Admin() {
  const [eventId, setEventId] = useState("");
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    event_date: "",
    venue: "",
    seat_limit: "",
    category: "General",
    price: "0",
  });


  /* =========================================
     CREATE EVENT
  ========================================= */

  const handleEventChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };


  const createEvent = async (e) => {
    e.preventDefault();

    setCreating(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/events",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: eventData.name,
            description: eventData.description,
            event_date: eventData.event_date,
            venue: eventData.venue,
            seat_limit: Number(eventData.seat_limit),
            category: eventData.category,
            price: Number(eventData.price),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create event"
        );
      }

      setMessage(
        "Event created successfully! Event ID: " +
          data.id
      );

      setEventData({
        name: "",
        description: "",
        event_date: "",
        venue: "",
        seat_limit: "",
        category: "General",
        price: "0",
      });

    } catch (err) {
      console.error(
        "Create event error:",
        err
      );

      setError(err.message);

    } finally {
      setCreating(false);
    }
  };


  /* =========================================
     VIEW REGISTRANTS
  ========================================= */

  const fetchBookings = async () => {
    if (!eventId) {
      setError("Please enter an Event ID.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setBookings([]);

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/events/" +
          eventId +
          "/bookings"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load bookings."
        );
      }

      setBookings(data);

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="admin-page">

      <div className="admin-container">


        {/* =====================================
            ADMIN HEADER
        ===================================== */}

        <div className="admin-header">

          <p className="section-label">
            EVENT MANAGEMENT
          </p>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Create events and manage attendee
            registrations.
          </p>

        </div>


        {/* =====================================
            CREATE EVENT
        ===================================== */}

        <div className="admin-search-card">

          <div className="registrants-heading">

            <div>
              <h2>
                Create New Event
              </h2>

              <p>
                Add a new event to EventSpark.
              </p>
            </div>

          </div>


          <form
            className="create-event-form"
            onSubmit={createEvent}
          >

            <div className="form-row">

              <div className="form-group">

                <label>
                  Event Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Example: Tech Innovation Summit"
                  value={eventData.name}
                  onChange={handleEventChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Venue
                </label>

                <input
                  type="text"
                  name="venue"
                  placeholder="Example: Bangalore Convention Centre"
                  value={eventData.venue}
                  onChange={handleEventChange}
                  required
                />

              </div>

            </div>


            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                placeholder="Describe your event..."
                value={eventData.description}
                onChange={handleEventChange}
                rows="4"
                required
              ></textarea>

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Event Date & Time
                </label>

                <input
                  type="datetime-local"
                  name="event_date"
                  value={eventData.event_date}
                  onChange={handleEventChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Seat Limit
                </label>

                <input
                  type="number"
                  name="seat_limit"
                  min="1"
                  placeholder="100"
                  value={eventData.seat_limit}
                  onChange={handleEventChange}
                  required
                />

              </div>

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={eventData.category}
                  onChange={handleEventChange}
                >

                  <option value="General">
                    General
                  </option>

                  <option value="Music">
                    Music
                  </option>

                  <option value="Conference">
                    Conference
                  </option>

                  <option value="Workshop">
                    Workshop
                  </option>

                  <option value="Sports">
                    Sports
                  </option>

                  <option value="Technology">
                    Technology
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Price (₹)
                </label>

                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  placeholder="999"
                  value={eventData.price}
                  onChange={handleEventChange}
                  required
                />

              </div>

            </div>


            {message && (
              <div className="admin-success">
                {message}
              </div>
            )}


            {error && (
              <div className="admin-error">
                {error}
              </div>
            )}


            <button
              type="submit"
              className="create-event-button"
              disabled={creating}
            >

              {creating
                ? "Creating Event..."
                : "Create Event"}

            </button>

          </form>

        </div>


        {/* =====================================
            VIEW REGISTRANTS
        ===================================== */}

        <div className="admin-search-card">

          <div className="registrants-heading">

            <div>
              <h2>
                View Registrants
              </h2>

              <p>
                Enter an event ID to view
                registrations.
              </p>
            </div>

          </div>


          <label htmlFor="eventId">
            Event ID
          </label>


          <div className="admin-search-row">

            <input
              id="eventId"
              type="number"
              placeholder="Enter Event ID"
              value={eventId}
              onChange={(e) =>
                setEventId(e.target.value)
              }
            />

            <button
              onClick={fetchBookings}
            >
              {loading
                ? "Loading..."
                : "View Registrants"}
            </button>

          </div>

        </div>


        {/* =====================================
            REGISTRANTS TABLE
        ===================================== */}

        {bookings.length > 0 && (

          <div className="registrants-card">

            <div className="registrants-heading">

              <h2>
                Event Registrants
              </h2>

              <span>
                {bookings.length}
                {" "}Registrations
              </span>

            </div>


            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Attendee Name
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {bookings.map(
                    (booking) => (

                      <tr
                        key={booking.id}
                      >

                        <td>
                          {booking.id}
                        </td>

                        <td>
                          {booking.attendee_name}
                        </td>

                        <td>
                          {booking.attendee_email}
                        </td>

                        <td>

                          <span
                            className={
                              "status-badge " +
                              booking.status
                            }
                          >
                            {booking.status}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}


        {!loading &&
          eventId &&
          bookings.length === 0 &&
          !error && (

            <div className="no-bookings">

              <h2>
                No Registrants Found
              </h2>

              <p>
                This event currently has
                no registrations.
              </p>

            </div>

          )}

      </div>

    </div>
  );
}

export default Admin;