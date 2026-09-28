import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Admin() {

    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [creating, setCreating] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        description: "",
        event_date: "",
        venue: "",
        seat_limit: "",
        category: "General",
        price: ""
    });


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {
        loadEvents();
        loadBookings();
    }, []);


    const loadEvents = async () => {

        try {

            const response =
                await fetch(`${API_URL}/api/events`);

            const data =
                await response.json();

            setEvents(
                Array.isArray(data)
                    ? data
                    : data.events || []
            );

        } catch (error) {

            console.error(
                "Error loading events:",
                error
            );
        }
    };


    const loadBookings = async () => {

        try {

            const response =
                await fetch(`${API_URL}/api/bookings`);

            const data =
                await response.json();

            setBookings(
                Array.isArray(data)
                    ? data
                    : data.bookings || []
            );

        } catch (error) {

            console.error(
                "Error loading bookings:",
                error
            );
        }
    };


    // ==========================================
    // STATISTICS
    // ==========================================

    const confirmed =
        bookings.filter(
            (booking) =>
                booking.status === "confirmed"
        ).length;

    const waitlisted =
        bookings.filter(
            (booking) =>
                booking.status === "waitlisted"
        ).length;

    const cancelled =
        bookings.filter(
            (booking) =>
                booking.status === "cancelled"
        ).length;


    // ==========================================
    // FORM
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    const openCreateForm = () => {

        setMessage("");
        setError("");

        setForm({
            name: "",
            description: "",
            event_date: "",
            venue: "",
            seat_limit: "",
            category: "General",
            price: ""
        });

        setShowCreateForm(true);
    };


    const closeCreateForm = () => {

        if (creating) {
            return;
        }

        setShowCreateForm(false);
    };


    // ==========================================
    // CREATE EVENT
    // ==========================================

    const handleCreateEvent = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        if (!form.name.trim()) {

            setError("Please enter an event name.");
            return;
        }


        if (!form.event_date) {

            setError("Please select an event date.");
            return;
        }


        if (!form.venue.trim()) {

            setError("Please enter the venue.");
            return;
        }


        if (
            !form.seat_limit ||
            Number(form.seat_limit) <= 0
        ) {

            setError("Please enter a valid seat limit.");
            return;
        }


        if (
            form.price !== "" &&
            Number(form.price) < 0
        ) {

            setError("Price cannot be negative.");
            return;
        }


        try {

            setCreating(true);


            const response =
                await fetch(
                    `${API_URL}/api/events`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name:
                                form.name.trim(),

                            description:
                                form.description.trim(),

                            event_date:
                                form.event_date,

                            venue:
                                form.venue.trim(),

                            seat_limit:
                                Number(
                                    form.seat_limit
                                ),

                            category:
                                form.category,

                            price:
                                Number(
                                    form.price || 0
                                )
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to create event"
                );
            }


            setMessage(
                data.message ||
                "Event created successfully!"
            );


            setShowCreateForm(false);


            // Refresh both sections
            await loadEvents();
            await loadBookings();


        } catch (err) {

            console.error(
                "Create event error:",
                err
            );

            setError(
                err.message ||
                "Unable to create event."
            );

        } finally {

            setCreating(false);
        }
    };


    // ==========================================
    // MAIN PAGE
    // ==========================================

    return (

        <div style={styles.page}>

            {/* =====================================
                HEADER
            ===================================== */}

            <div style={styles.header}>

                <div style={styles.label}>
                    EVENTSPARK ADMIN
                </div>

                <h1 style={styles.title}>
                    Admin Dashboard
                </h1>

                <p style={styles.subtitle}>
                    Manage events, registrations and
                    attendees.
                </p>

            </div>


            {/* =====================================
                SUCCESS MESSAGE
            ===================================== */}

            {message && (

                <div style={styles.successMessage}>

                    <span>✓</span>

                    <span>
                        {message}
                    </span>

                    <button
                        onClick={() =>
                            setMessage("")
                        }
                        style={styles.messageClose}
                    >
                        ×
                    </button>

                </div>
            )}


            {/* =====================================
                ERROR MESSAGE
            ===================================== */}

            {error && !showCreateForm && (

                <div style={styles.errorMessage}>

                    <span>
                        ⚠️ {error}
                    </span>

                    <button
                        onClick={() =>
                            setError("")
                        }
                        style={styles.messageClose}
                    >
                        ×
                    </button>

                </div>
            )}


            {/* =====================================
                STATISTICS
            ===================================== */}

            <div style={styles.stats}>

                <div style={styles.statCard}>

                    <div style={styles.statNumber}>
                        {events.length}
                    </div>

                    <div style={styles.statText}>
                        Total Events
                    </div>

                </div>


                <div style={styles.statCard}>

                    <div style={styles.statNumber}>
                        {bookings.length}
                    </div>

                    <div style={styles.statText}>
                        Total Bookings
                    </div>

                </div>


                <div style={styles.statCard}>

                    <div style={styles.statNumber}>
                        {confirmed}
                    </div>

                    <div style={styles.statText}>
                        Confirmed
                    </div>

                </div>


                <div style={styles.statCard}>

                    <div style={styles.statNumber}>
                        {waitlisted}
                    </div>

                    <div style={styles.statText}>
                        Waitlisted
                    </div>

                </div>


                <div style={styles.statCard}>

                    <div style={styles.statNumber}>
                        {cancelled}
                    </div>

                    <div style={styles.statText}>
                        Cancelled
                    </div>

                </div>

            </div>


            {/* =====================================
                EVENT MANAGEMENT
            ===================================== */}

            <div style={styles.section}>

                <div style={styles.sectionHeader}>

                    <div>

                        <div style={styles.label}>
                            EVENT MANAGEMENT
                        </div>

                        <h2 style={styles.sectionTitle}>
                            Events
                        </h2>

                    </div>


                    <button
                        onClick={openCreateForm}
                        style={styles.createButton}
                    >
                        + Create Event
                    </button>

                </div>


                <div style={styles.eventGrid}>

                    {events.length === 0 ? (

                        <p style={styles.noData}>
                            No events available.
                        </p>

                    ) : (

                        events.map((event) => {

                            const available =
                                Number(
                                    event.seat_limit || 0
                                ) -
                                Number(
                                    event.seats_booked || 0
                                );


                            return (

                                <div
                                    key={event.id}
                                    style={styles.eventCard}
                                >

                                    <div
                                        style={styles.category}
                                    >
                                        {event.category ||
                                            "General"}
                                    </div>


                                    <h3
                                        style={styles.eventName}
                                    >
                                        {event.name}
                                    </h3>


                                    <p style={styles.info}>
                                        📍 {event.venue}
                                    </p>


                                    <p style={styles.info}>
                                        📅{" "}
                                        {event.event_date
                                            ? new Date(
                                                event.event_date
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                }
                                            )
                                            : "Date unavailable"}
                                    </p>


                                    <div
                                        style={styles.eventBottom}
                                    >

                                        <span
                                            style={
                                                available <= 0
                                                    ? styles.full
                                                    : styles.available
                                            }
                                        >

                                            {available <= 0
                                                ? "Event Full"
                                                : `${available} seats left`}

                                        </span>


                                        <strong
                                            style={styles.price}
                                        >
                                            ₹{event.price || 0}
                                        </strong>

                                    </div>

                                </div>
                            );
                        })
                    )}

                </div>

            </div>


            {/* =====================================
                BOOKINGS
            ===================================== */}

            <div style={styles.section}>

                <div style={styles.label}>
                    REGISTRATIONS
                </div>

                <h2 style={styles.sectionTitle}>
                    Recent Bookings
                </h2>


                {bookings.length === 0 ? (

                    <p style={styles.noData}>
                        No bookings available.
                    </p>

                ) : (

                    <div>

                        {bookings.map((booking) => (

                            <div
                                key={booking.id}
                                style={styles.booking}
                            >

                                <div>

                                    <strong>
                                        {booking.attendee_name}
                                    </strong>

                                    <p
                                        style={styles.email}
                                    >
                                        {booking.attendee_email}
                                    </p>

                                    <small
                                        style={
                                            styles.bookingEvent
                                        }
                                    >
                                        {booking.event_name ||
                                            `Event #${booking.event_id}`}
                                    </small>

                                </div>


                                <span
                                    style={
                                        booking.status ===
                                            "confirmed"
                                            ? styles.confirmed
                                            : booking.status ===
                                                "waitlisted"
                                                ? styles.waitlisted
                                                : styles.cancelled
                                    }
                                >
                                    {booking.status}
                                </span>

                            </div>
                        ))}

                    </div>
                )}

            </div>


            {/* =====================================
                CREATE EVENT POPUP
            ===================================== */}

            {showCreateForm && (

                <div
                    style={styles.modalOverlay}
                    onClick={closeCreateForm}
                >

                    <div
                        style={styles.modal}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            onClick={closeCreateForm}
                            style={styles.closeButton}
                        >
                            ×
                        </button>


                        <div style={styles.modalHeader}>

                            <div style={styles.modalIcon}>
                                ✨
                            </div>

                            <div
                                style={styles.modalLabel}
                            >
                                EVENT MANAGEMENT
                            </div>

                            <h2
                                style={styles.modalTitle}
                            >
                                Create New Event
                            </h2>

                            <p
                                style={
                                    styles.modalSubtitle
                                }
                            >
                                Add a new event to EventSpark.
                            </p>

                        </div>


                        {error && (

                            <div
                                style={
                                    styles.formError
                                }
                            >
                                ⚠️ {error}
                            </div>
                        )}


                        <form
                            onSubmit={handleCreateEvent}
                        >

                            {/* NAME */}

                            <label
                                style={styles.formLabel}
                            >
                                Event Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter event name"
                                value={form.name}
                                onChange={handleChange}
                                style={styles.input}
                            />


                            {/* DESCRIPTION */}

                            <label
                                style={styles.formLabel}
                            >
                                Description
                            </label>

                            <textarea
                                name="description"
                                placeholder="Describe the event"
                                value={form.description}
                                onChange={handleChange}
                                rows="3"
                                style={styles.textarea}
                            />


                            {/* DATE */}

                            <label
                                style={styles.formLabel}
                            >
                                Event Date
                            </label>

                            <input
                                type="datetime-local"
                                name="event_date"
                                value={form.event_date}
                                onChange={handleChange}
                                style={styles.input}
                            />


                            {/* VENUE */}

                            <label
                                style={styles.formLabel}
                            >
                                Venue
                            </label>

                            <input
                                type="text"
                                name="venue"
                                placeholder="Enter venue"
                                value={form.venue}
                                onChange={handleChange}
                                style={styles.input}
                            />


                            {/* TWO COLUMNS */}

                            <div
                                style={
                                    styles.formGrid
                                }
                            >

                                <div>

                                    <label
                                        style={
                                            styles.formLabel
                                        }
                                    >
                                        Seat Limit
                                    </label>

                                    <input
                                        type="number"
                                        name="seat_limit"
                                        min="1"
                                        placeholder="100"
                                        value={
                                            form.seat_limit
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        style={
                                            styles.input
                                        }
                                    />

                                </div>


                                <div>

                                    <label
                                        style={
                                            styles.formLabel
                                        }
                                    >
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        min="0"
                                        placeholder="0"
                                        value={
                                            form.price
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        style={
                                            styles.input
                                        }
                                    />

                                </div>

                            </div>


                            {/* CATEGORY */}

                            <label
                                style={styles.formLabel}
                            >
                                Category
                            </label>

                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                style={styles.input}
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

                                <option value="Business">
                                    Business
                                </option>

                                <option value="Entertainment">
                                    Entertainment
                                </option>

                            </select>


                            {/* BUTTONS */}

                            <div
                                style={
                                    styles.modalActions
                                }
                            >

                                <button
                                    type="button"
                                    onClick={
                                        closeCreateForm
                                    }
                                    disabled={creating}
                                    style={
                                        styles.cancelButton
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={creating}
                                    style={
                                        styles.submitButton
                                    }
                                >
                                    {creating
                                        ? "Creating..."
                                        : "Create Event"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}


/* =========================================================
   STYLES
========================================================= */

const styles = {

    page: {
        minHeight: "100vh",
        background:
            "linear-gradient(135deg, #f1e8ff 0%, #eef2ff 100%)",
        padding: "50px 6%",
        fontFamily: "Arial, sans-serif",
        color: "#172554"
    },


    header: {
        marginBottom: "25px",
        background:
            "linear-gradient(135deg, #24104f, #4c1d95)",
        padding: "35px",
        borderRadius: "16px",
        color: "white"
    },


    label: {
        color: "#a855f7",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "1.5px",
        marginBottom: "8px"
    },


    title: {
        fontSize: "46px",
        fontWeight: "700",
        margin: "0 0 8px",
        color: "#ffffff"
    },


    subtitle: {
        fontSize: "18px",
        color: "#ddd6fe",
        margin: 0
    },


    successMessage: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "#ecfdf5",
        border: "1px solid #bbf7d0",
        color: "#166534",
        padding: "14px 18px",
        borderRadius: "10px",
        marginBottom: "25px"
    },


    errorMessage: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "#fff1f2",
        border: "1px solid #fecdd3",
        color: "#9f1239",
        padding: "14px 18px",
        borderRadius: "10px",
        marginBottom: "25px"
    },


    messageClose: {
        marginLeft: "auto",
        border: "none",
        background: "transparent",
        fontSize: "20px",
        cursor: "pointer",
        color: "inherit"
    },


    stats: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(170px, 1fr))",
        gap: "18px",
        marginBottom: "35px"
    },


    statCard: {
        background: "#ffffff",
        border: "1px solid #ddd6fe",
        borderRadius: "14px",
        padding: "22px",
        textAlign: "center",
        boxShadow:
            "0 4px 15px rgba(76, 29, 149, 0.08)"
    },


    statNumber: {
        fontSize: "30px",
        fontWeight: "700",
        color: "#7c3aed",
        marginBottom: "6px"
    },


    statText: {
        color: "#475569",
        fontSize: "15px"
    },


    section: {
        background: "#ffffff",
        border: "1px solid #ddd6fe",
        borderRadius: "16px",
        padding: "28px",
        marginBottom: "30px",
        boxShadow:
            "0 5px 20px rgba(76, 29, 149, 0.08)"
    },


    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px"
    },


    sectionTitle: {
        fontSize: "28px",
        color: "#172554",
        margin: 0
    },


    createButton: {
        background:
            "linear-gradient(135deg, #7c3aed, #a855f7)",
        color: "#ffffff",
        border: "none",
        borderRadius: "9px",
        padding: "12px 20px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer"
    },


    eventGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "18px"
    },


    eventCard: {
        border: "1px solid #ddd6fe",
        borderRadius: "12px",
        padding: "20px",
        background: "#faf8ff",
        borderTop: "4px solid #8b5cf6"
    },


    category: {
        display: "inline-block",
        background: "#ede9fe",
        color: "#6d28d9",
        padding: "5px 10px",
        borderRadius: "15px",
        fontSize: "12px",
        fontWeight: "700",
        textTransform: "uppercase"
    },


    eventName: {
        color: "#172554",
        fontSize: "21px",
        margin: "16px 0"
    },


    info: {
        color: "#64748b",
        margin: "8px 0"
    },


    eventBottom: {
        borderTop: "1px solid #f0edff",
        marginTop: "18px",
        paddingTop: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },


    available: {
        color: "#15803d",
        background: "#dcfce7",
        padding: "5px 10px",
        borderRadius: "12px",
        fontWeight: "600"
    },


    full: {
        color: "#dc2626",
        background: "#fee2e2",
        padding: "5px 10px",
        borderRadius: "12px",
        fontWeight: "600"
    },


    price: {
        color: "#7c3aed",
        fontSize: "18px"
    },


    booking: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #ddd6fe",
        borderRadius: "10px",
        padding: "15px",
        marginTop: "12px",
        background: "#f8f5ff"
    },


    email: {
        color: "#64748b",
        margin: "5px 0"
    },


    bookingEvent: {
        color: "#7c3aed",
        fontSize: "13px"
    },


    confirmed: {
        background: "#dcfce7",
        color: "#15803d",
        padding: "6px 12px",
        borderRadius: "15px",
        fontSize: "13px",
        fontWeight: "600"
    },


    waitlisted: {
        background: "#fef3c7",
        color: "#b45309",
        padding: "6px 12px",
        borderRadius: "15px",
        fontSize: "13px",
        fontWeight: "600"
    },


    cancelled: {
        background: "#fee2e2",
        color: "#dc2626",
        padding: "6px 12px",
        borderRadius: "15px",
        fontSize: "13px",
        fontWeight: "600"
    },


    noData: {
        color: "#64748b",
        padding: "10px 0"
    },


    /* =====================================
       MODAL
    ===================================== */

    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.70)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 9999
    },


    modal: {
        position: "relative",
        width: "100%",
        maxWidth: "560px",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#ffffff",
        borderRadius: "20px",
        padding: "32px",
        boxSizing: "border-box",
        boxShadow:
            "0 25px 70px rgba(30, 20, 70, 0.35)"
    },


    closeButton: {
        position: "absolute",
        top: "12px",
        right: "17px",
        border: "none",
        background: "transparent",
        fontSize: "28px",
        color: "#64748b",
        cursor: "pointer"
    },


    modalHeader: {
        textAlign: "center",
        marginBottom: "22px"
    },


    modalIcon: {
        width: "55px",
        height: "55px",
        margin: "0 auto 12px",
        borderRadius: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
            "linear-gradient(135deg, #7c3aed, #a855f7)",
        color: "#ffffff",
        fontSize: "25px"
    },


    modalLabel: {
        color: "#7c3aed",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "2px",
        marginBottom: "6px"
    },


    modalTitle: {
        color: "#172554",
        fontSize: "27px",
        margin: "0 0 7px"
    },


    modalSubtitle: {
        color: "#64748b",
        fontSize: "14px",
        margin: 0
    },


    formError: {
        background: "#fee2e2",
        color: "#991b1b",
        padding: "11px 13px",
        borderRadius: "9px",
        marginBottom: "15px",
        fontSize: "14px"
    },


    formLabel: {
        display: "block",
        color: "#172554",
        fontSize: "14px",
        fontWeight: "700",
        marginBottom: "7px",
        marginTop: "15px"
    },


    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 13px",
        border: "1px solid #d8dbe5",
        borderRadius: "9px",
        background: "#fafaff",
        color: "#172554",
        fontSize: "14px",
        outline: "none"
    },


    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 13px",
        border: "1px solid #d8dbe5",
        borderRadius: "9px",
        background: "#fafaff",
        color: "#172554",
        fontSize: "14px",
        resize: "vertical",
        fontFamily: "Arial, sans-serif",
        outline: "none"
    },


    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px"
    },


    modalActions: {
        display: "flex",
        gap: "12px",
        marginTop: "25px"
    },


    cancelButton: {
        flex: 1,
        padding: "13px",
        borderRadius: "9px",
        border: "1px solid #d8dbe5",
        background: "#ffffff",
        color: "#475569",
        fontWeight: "700",
        cursor: "pointer"
    },


    submitButton: {
        flex: 1,
        padding: "13px",
        borderRadius: "9px",
        border: "none",
        background:
            "linear-gradient(135deg, #7c3aed, #a855f7)",
        color: "#ffffff",
        fontWeight: "700",
        cursor: "pointer"
    }
};
export default Admin;