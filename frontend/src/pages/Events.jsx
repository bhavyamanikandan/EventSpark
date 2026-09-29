import React, { useEffect, useState } from "react";

const API_URL = "https://eventspark-backend-5gjz.onrender.com";

const eventImages = {
    "Midnight Vibes Concert":
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80",

    "Tech Summit 2026":
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",

    "Cooking Masterclass":
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80",

    "Startup Networking Night":
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80",

    "Full Stack Developer Meetup":
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80"
};


function Events() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showRegisterForm, setShowRegisterForm] =
        useState(false);

    const [selectedEvent, setSelectedEvent] =
        useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [registering, setRegistering] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [registerError, setRegisterError] =
        useState("");


    /* =====================================================
       LOAD EVENTS
    ===================================================== */

    useEffect(() => {
        fetchEvents();
    }, []);


    const fetchEvents = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/events`
            );

            if (!response.ok) {
                throw new Error("Failed to load events");
            }

            const data = await response.json();

            if (Array.isArray(data)) {

                setEvents(data);

            } else if (Array.isArray(data.events)) {

                setEvents(data.events);

            } else {

                setEvents([]);

            }

        } catch (err) {

            console.error(
                "Error loading events:",
                err
            );

            setError(
                "Unable to load events. Please make sure the backend is running."
            );

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       CALCULATE AVAILABLE SEATS
    ===================================================== */

    const getAvailableSeats = (event) => {

        const seatLimit =
            Number(event.seat_limit ?? 0);

        const seatsBooked =
            Number(event.seats_booked ?? 0);

        return Math.max(
            0,
            seatLimit - seatsBooked
        );
    };


    /* =====================================================
       GET EVENT STATUS
    ===================================================== */

    const getEventStatus = (event) => {

        const availableSeats =
            getAvailableSeats(event);

        if (availableSeats <= 0) {

            return "Full";

        }

        if (availableSeats <= 10) {

            return "Almost Full";

        }

        return "Available";
    };


    /* =====================================================
       OPEN REGISTRATION POPUP
    ===================================================== */

    const handleRegister = (event) => {

        setSelectedEvent(event);

        setName("");
        setEmail("");

        setMessage("");
        setRegisterError("");

        setShowRegisterForm(true);
    };


    /* =====================================================
       CLOSE POPUP
    ===================================================== */

    const closeRegisterForm = () => {

        setShowRegisterForm(false);

        setSelectedEvent(null);

        setName("");
        setEmail("");

        setMessage("");
        setRegisterError("");
    };


    /* =====================================================
       REGISTER / WAITLIST
    ===================================================== */

    const submitRegistration = async (e) => {

        e.preventDefault();

        setMessage("");
        setRegisterError("");

        if (!name.trim()) {

            setRegisterError(
                "Please enter your name."
            );

            return;
        }


        if (!email.trim()) {

            setRegisterError(
                "Please enter your email."
            );

            return;
        }


        if (!email.includes("@")) {

            setRegisterError(
                "Please enter a valid email address."
            );

            return;
        }


        if (!selectedEvent) {

            setRegisterError(
                "Please select an event."
            );

            return;
        }


        try {

            setRegistering(true);

            const response = await fetch(
                `${API_URL}/api/events/${selectedEvent.id}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim()
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Registration failed. Please try again."
                );
            }


            setMessage(
                data.message ||
                "Registration successful!"
            );


            /*
             * Reload events so the seat count
             * and status update immediately.
             */

            await fetchEvents();


            setName("");
            setEmail("");


        } catch (err) {

            console.error(
                "Registration error:",
                err
            );

            setRegisterError(
                err.message ||
                "Registration failed. Please try again."
            );

        } finally {

            setRegistering(false);

        }
    };


    /* =====================================================
       DATE FORMAT
    ===================================================== */

    const formatDate = (date) => {

        if (!date) {

            return "Date not available";
        }


        const newDate =
            new Date(date);


        if (
            isNaN(
                newDate.getTime()
            )
        ) {

            return date;
        }


        return newDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    };


    /* =====================================================
       EVENT IMAGE
    ===================================================== */

    const getEventImage = (event) => {

        return (
            eventImages[event.name] ||
            eventImages[event.title] ||
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80"
        );
    };


    /* =====================================================
       LOADING SCREEN
    ===================================================== */

    if (loading) {

        return (

            <div style={styles.loadingPage}>

                <div style={styles.loadingIcon}>
                    ✨
                </div>

                <h2>
                    Finding Amazing Events...
                </h2>

                <p>
                    Please wait while we load
                    the latest events.
                </p>

            </div>
        );
    }


    /* =====================================================
       MAIN PAGE
    ===================================================== */

    return (

        <div style={styles.page}>

            {/* =================================================
                HERO
            ================================================= */}

            <section style={styles.hero}>

                <div
                    style={styles.heroOverlay}
                ></div>


                <div style={styles.heroContent}>

                    <p style={styles.heroLabel}>
                        ✦ EXPLORE EVENTSPARK
                    </p>


                    <h1 style={styles.heroTitle}>

                        Discover Your

                        <br />

                        <span>
                            Next Experience.
                        </span>

                    </h1>


                    <p style={styles.heroText}>

                        From unforgettable concerts
                        to inspiring conferences,
                        find an event that sparks
                        something special.

                    </p>

                </div>


                <div style={styles.heroDecoration}>
                    ✦
                </div>

            </section>


            {/* =================================================
                EVENTS SECTION
            ================================================= */}

            <section style={styles.section}>

                <div style={styles.sectionHeader}>

                    <div>

                        <p style={styles.sectionLabel}>
                            DON'T MISS OUT
                        </p>


                        <h2 style={styles.sectionTitle}>
                            Upcoming Events
                        </h2>


                        <p style={styles.sectionSubtitle}>
                            Find something exciting
                            to experience.
                        </p>

                    </div>


                    <div style={styles.eventCount}>

                        <strong>
                            {events.length}
                        </strong>

                        <span>
                            Events Available
                        </span>

                    </div>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div style={styles.errorBox}>

                        <span>
                            ⚠️ {error}
                        </span>


                        <button
                            onClick={fetchEvents}
                            style={styles.retryButton}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!error &&
                    events.length === 0 && (

                        <div
                            style={styles.emptyBox}
                        >

                            <div
                                style={styles.emptyIcon}
                            >
                                🎟️
                            </div>


                            <h2>
                                No Events Available
                            </h2>


                            <p>
                                There are currently
                                no events to display.
                            </p>

                        </div>
                    )
                }


                {/* =================================================
                    EVENT GRID
                ================================================= */}

                {!error &&
                    events.length > 0 && (

                        <div
                            style={styles.eventGrid}
                        >

                            {events.map((event) => {

                                const eventName =
                                    event.name ||
                                    event.title ||
                                    "Event";


                                const availableSeats =
                                    getAvailableSeats(
                                        event
                                    );


                                const eventStatus =
                                    getEventStatus(
                                        event
                                    );


                                const isFull =
                                    eventStatus === "Full";


                                const isAlmostFull =
                                    eventStatus === "Almost Full";


                                return (

                                    <article
                                        key={event.id}
                                        style={styles.card}
                                    >

                                        {/* IMAGE */}

                                        <div
                                            style={
                                                styles.imageContainer
                                            }
                                        >

                                            <img
                                                src={
                                                    getEventImage(
                                                        event
                                                    )
                                                }
                                                alt={eventName}
                                                style={
                                                    styles.image
                                                }
                                            />


                                            <div
                                                style={
                                                    styles.category
                                                }
                                            >
                                                {
                                                    event.category ||
                                                    "EVENT"
                                                }
                                            </div>


                                            <div
                                                style={
                                                    styles.imageShade
                                                }
                                            ></div>

                                        </div>


                                        {/* CARD CONTENT */}

                                        <div
                                            style={
                                                styles.cardContent
                                            }
                                        >

                                            <h3
                                                style={
                                                    styles.eventTitle
                                                }
                                            >
                                                {eventName}
                                            </h3>


                                            {/* LOCATION */}

                                            <div
                                                style={
                                                    styles.infoRow
                                                }
                                            >

                                                <span>
                                                    📍
                                                </span>

                                                <span>
                                                    {
                                                        event.location ||
                                                        event.venue ||
                                                        "Location not available"
                                                    }
                                                </span>

                                            </div>


                                            {/* DATE */}

                                            <div
                                                style={
                                                    styles.infoRow
                                                }
                                            >

                                                <span>
                                                    📅
                                                </span>

                                                <span>
                                                    {formatDate(
                                                        event.date ||
                                                        event.event_date
                                                    )}
                                                </span>

                                            </div>


                                            {/* SEATS + PRICE */}

                                            <div
                                                style={
                                                    styles.cardBottom
                                                }
                                            >

                                                <span
                                                    style={{
                                                        ...styles.seatStatus,

                                                        color:
                                                            isFull
                                                                ? "#dc2626"
                                                                : isAlmostFull
                                                                    ? "#d97706"
                                                                    : "#475569"
                                                    }}
                                                >

                                                    💺{" "}

                                                    {isFull

                                                        ? "Event Full"

                                                        : isAlmostFull

                                                            ? `Almost Full • ${availableSeats} seats left`

                                                            : `${availableSeats} seats left`
                                                    }

                                                </span>


                                                <strong
                                                    style={
                                                        styles.price
                                                    }
                                                >

                                                    ₹
                                                    {event.price ||
                                                        0}

                                                </strong>

                                            </div>
                                            {/* STATUS BADGE */}

                                            <div
                                                style={{
                                                    ...styles.statusBadge,

                                                    background:
                                                        isFull
                                                            ? "#fee2e2"
                                                            : isAlmostFull
                                                                ? "#fef3c7"
                                                                : "#dcfce7",

                                                    color:
                                                        isFull
                                                            ? "#b91c1c"
                                                            : isAlmostFull
                                                                ? "#b45309"
                                                                : "#15803d"
                                                }}
                                            >

                                                {isFull
                                                    ? "🔴 FULL"
                                                    : isAlmostFull
                                                        ? "⚠️ ALMOST FULL"
                                                        : "✓ AVAILABLE"
                                                }

                                            </div>


                                            {/* REGISTER / WAITLIST */}

                                            <button
                                                onClick={() =>
                                                    handleRegister(
                                                        event
                                                    )
                                                }

                                                style={{
                                                    ...styles.registerButton,

                                                    background:
                                                        isFull

                                                            ? "linear-gradient(135deg, #dc2626, #ef4444)"

                                                            : isAlmostFull

                                                                ? "linear-gradient(135deg, #d97706, #f59e0b)"

                                                                : "linear-gradient(135deg, #7c3aed, #a855f7)"
                                                }}
                                            >

                                                {isFull

                                                    ? "Join Waitlist"

                                                    : "🎟 Register Now"
                                                }

                                            </button>

                                        </div>

                                    </article>
                                );

                            })}

                        </div>
                    )
                }

            </section>


            {/* =================================================
                REGISTRATION / WAITLIST POPUP
            ================================================= */}

            {showRegisterForm &&
                selectedEvent && (

                    <div
                        style={styles.modalOverlay}
                        onClick={closeRegisterForm}
                    >

                        <div
                            style={styles.modal}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            {/* CLOSE */}

                            <button
                                onClick={
                                    closeRegisterForm
                                }
                                style={
                                    styles.closeButton
                                }
                            >
                                ×
                            </button>


                            {/* ICON */}

                            <div
                                style={
                                    styles.modalIcon
                                }
                            >
                                🎟️
                            </div>


                            {/* LABEL */}

                            <p
                                style={
                                    styles.modalLabel
                                }
                            >
                                EVENT REGISTRATION
                            </p>


                            {/* TITLE */}

                            <h2
                                style={
                                    styles.modalTitle
                                }
                            >

                                {getAvailableSeats(
                                    selectedEvent
                                ) <= 0

                                    ? "Join the Waitlist"

                                    : "Reserve Your Seat"
                                }

                            </h2>


                            {/* EVENT NAME */}

                            <p
                                style={
                                    styles.modalEvent
                                }
                            >

                                {
                                    selectedEvent.name ||
                                    selectedEvent.title
                                }

                            </p>


                            {/* =================================================
                                SUCCESS / WAITLIST MESSAGE
                            ================================================= */}

                            {message && (

                                <div
                                    style={
                                        styles.successBox
                                    }
                                >

                                    <div
                                        style={
                                            styles.successIcon
                                        }
                                    >
                                        ✓
                                    </div>


                                    <h3>

                                        {message
                                            .toLowerCase()
                                            .includes(
                                                "waitlist"
                                            )

                                            ? "Added to Waitlist"

                                            : "Registration Successful"
                                        }

                                    </h3>


                                    <p>
                                        {message}
                                    </p>


                                    <button
                                        onClick={
                                            closeRegisterForm
                                        }
                                        style={
                                            styles.doneButton
                                        }
                                    >
                                        Done
                                    </button>

                                </div>

                            )}


                            {/* ERROR */}

                            {registerError && (

                                <div
                                    style={
                                        styles.registerError
                                    }
                                >
                                    ⚠️{" "}
                                    {registerError}
                                </div>

                            )}


                            {/* =================================================
                                FORM
                            ================================================= */}

                            {!message && (

                                <form
                                    onSubmit={
                                        submitRegistration
                                    }
                                >

                                    <label
                                        style={
                                            styles.formLabel
                                        }
                                    >
                                        Full Name
                                    </label>


                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(
                                                e.target.value
                                            )
                                        }
                                        style={
                                            styles.input
                                        }
                                    />


                                    <label
                                        style={
                                            styles.formLabel
                                        }
                                    >
                                        Email Address
                                    </label>


                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        style={
                                            styles.input
                                        }
                                    />


                                    <button
                                        type="submit"
                                        disabled={
                                            registering
                                        }
                                        style={
                                            styles.submitButton
                                        }
                                    >

                                        {registering

                                            ? "Processing..."

                                            : getAvailableSeats(
                                                selectedEvent
                                            ) <= 0

                                                ? "Join Waitlist"

                                                : "Confirm Registration"
                                        }

                                    </button>

                                </form>

                            )}

                        </div>

                    </div>

                )
            }

        </div>
    );
}


/* =========================================================
   STYLES
========================================================= */

const styles = {

    page: {
        minHeight: "100vh",
        background: "#f7f5fc",
        paddingBottom: "80px",
        fontFamily:
            "Inter, Arial, Helvetica, sans-serif"
    },


    /* HERO */

    hero: {
        minHeight: "430px",
        position: "relative",
        overflow: "hidden",

        display: "flex",
        alignItems: "center",

        background:
            "linear-gradient(110deg, rgba(35, 12, 72, 0.96), rgba(91, 33, 182, 0.82), rgba(124, 58, 237, 0.55)), url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=85')",

        backgroundSize: "cover",
        backgroundPosition: "center"
    },


    heroOverlay: {
        position: "absolute",
        inset: 0,

        background:
            "radial-gradient(circle at 80% 30%, rgba(216, 180, 254, 0.28), transparent 30%)"
    },


    heroContent: {
        position: "relative",
        zIndex: 2,

        width: "90%",
        maxWidth: "1250px",

        margin: "0 auto"
    },


    heroLabel: {
        color: "#ddd6fe",
        fontSize: "14px",
        fontWeight: "800",
        letterSpacing: "3px",
        marginBottom: "18px"
    },


    heroTitle: {
        color: "#ffffff",
        fontSize:
            "clamp(45px, 6vw, 72px)",
        lineHeight: "1.02",
        letterSpacing: "-2px",
        margin: 0
    },


    heroText: {
        maxWidth: "620px",
        color: "#ede9fe",
        fontSize: "18px",
        lineHeight: "1.7",
        marginTop: "24px"
    },


    heroDecoration: {
        position: "absolute",
        right: "8%",
        bottom: "-65px",

        color:
            "rgba(255,255,255,0.08)",

        fontSize: "280px",

        zIndex: 1
    },


    /* SECTION */

    section: {
        width: "90%",
        maxWidth: "1250px",
        margin: "0 auto",
        paddingTop: "65px"
    },


    sectionHeader: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "30px",
        marginBottom: "35px"
    },


    sectionLabel: {
        color: "#7c3aed",
        fontSize: "13px",
        fontWeight: "800",
        letterSpacing: "3px",
        margin: 0
    },


    sectionTitle: {
        color: "#172554",
        fontSize: "42px",
        margin: "8px 0",
        lineHeight: "1.15"
    },


    sectionSubtitle: {
        color: "#64748b",
        fontSize: "16px",
        margin: 0
    },


    eventCount: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",

        padding: "14px 20px",

        borderRadius: "15px",

        background: "#ffffff",

        border:
            "1px solid #e9e5f2"
    },


    /* GRID */

    eventGrid: {
        display: "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(290px, 1fr))",

        gap: "26px"
    },


    /* CARD */

    card: {
        background: "#ead4f3",

        borderRadius: "20px",

        overflow: "hidden",

        border:
            "1px solid #e8e4f0",

        boxShadow:
            "0 8px 28px rgba(23, 37, 84, 0.08)"
    },


    imageContainer: {
        height: "220px",

        position: "relative",

        overflow: "hidden"
    },


    image: {
        width: "100%",
        height: "100%",

        objectFit: "cover",

        display: "block"
    },


    imageShade: {
        position: "absolute",
        inset: 0,

        background:
            "linear-gradient(to bottom, rgba(0,0,0,0.08), transparent 55%)"
    },


    category: {
        position: "absolute",

        top: "16px",
        left: "16px",

        padding: "8px 14px",

        borderRadius: "20px",

        background:
            "rgba(255,255,255,0.94)",

        color: "#6d28d9",

        fontSize: "12px",

        fontWeight: "800",

        letterSpacing: "0.5px",

        zIndex: 2
    },


    cardContent: {
        padding: "24px"
    },


    eventTitle: {
        color: "#172554",
        fontSize: "22px",

        margin: "0 0 18px",

        lineHeight: "1.25"
    },


    infoRow: {
        display: "flex",

        alignItems: "center",

        gap: "9px",

        color: "#64748b",

        fontSize: "14px",

        marginBottom: "11px"
    },


    cardBottom: {
        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        borderTop:
            "1px solid #eeeaf5",

        marginTop: "20px",

        paddingTop: "18px"
    },


    seatStatus: {
        fontSize: "14px",
        fontWeight: "700"
    },


    price: {
        color: "#7c3aed",
        fontSize: "20px"
    },


    /* STATUS BADGE */

    statusBadge: {
        display: "inline-block",

        marginTop: "15px",

        padding: "7px 12px",

        borderRadius: "20px",

        fontSize: "11px",

        fontWeight: "800",

        letterSpacing: "0.5px"
    },


    registerButton: {
        width: "100%",

        border: "none",

        borderRadius: "11px",

        padding: "14px",

        marginTop: "20px",

        color: "#ffffff",

        fontSize: "15px",

        fontWeight: "700",

        cursor: "pointer"
    },


    /* ERROR */

    errorBox: {
        background: "#fff1f2",

        border:
            "1px solid #fecdd3",

        color: "#9f1239",

        padding: "18px 20px",

        borderRadius: "14px",

        marginBottom: "25px",

        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        gap: "15px"
    },


    retryButton: {
        border: "none",

        borderRadius: "8px",

        padding: "9px 16px",

        background: "#9f1239",

        color: "#ffffff",

        cursor: "pointer",

        fontWeight: "600"
    },


    /* EMPTY */

    emptyBox: {
        background: "#ffffff",

        borderRadius: "20px",

        textAlign: "center",

        padding: "80px 20px",

        border:
            "1px solid #e8e4f0"
    },


    emptyIcon: {
        fontSize: "55px",
        marginBottom: "15px"
    },


    /* LOADING */

    loadingPage: {
        minHeight: "80vh",

        display: "flex",

        flexDirection: "column",

        justifyContent: "center",

        alignItems: "center",

        color: "#172554",

        background: "#f7f5fc"
    },


    loadingIcon: {
        width: "65px",
        height: "65px",

        borderRadius: "20px",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        background:
            "linear-gradient(135deg, #7c3aed, #a855f7)",

        color: "#ffffff",

        fontSize: "28px",

        marginBottom: "18px"
    },


    /* =====================================================
       MODAL
    ===================================================== */

    modalOverlay: {
        position: "fixed",

        inset: 0,

        background:
            "rgba(15, 10, 35, 0.68)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        padding: "20px",

        zIndex: 9999
    },


    modal: {
        position: "relative",

        width: "100%",

        maxWidth: "470px",

        maxHeight: "90vh",

        overflowY: "auto",

        background: "#ffffff",

        borderRadius: "24px",

        padding: "35px",

        boxShadow:
            "0 25px 70px rgba(30, 20, 70, 0.35)"
    },


    closeButton: {
        position: "absolute",

        right: "17px",

        top: "12px",

        border: "none",

        background: "transparent",

        fontSize: "30px",

        color: "#64748b",

        cursor: "pointer"
    },


    modalIcon: {
        width: "60px",
        height: "60px",

        margin: "0 auto 15px",

        borderRadius: "18px",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        background:
            "linear-gradient(135deg, #7c3aed, #a855f7)",

        fontSize: "27px"
    },


    modalLabel: {
        textAlign: "center",

        color: "#7c3aed",

        fontSize: "12px",

        fontWeight: "800",

        letterSpacing: "2px",

        margin: "0 0 7px"
    },


    modalTitle: {
        textAlign: "center",

        color: "#172554",

        fontSize: "28px",

        margin: 0
    },


    modalEvent: {
        textAlign: "center",

        color: "#7c3aed",

        fontWeight: "700",

        margin: "10px 0 25px"
    },


    formLabel: {
        display: "block",

        color: "#172554",

        fontSize: "14px",

        fontWeight: "700",

        marginBottom: "7px",

        marginTop: "16px"
    },


    input: {
        width: "100%",

        boxSizing: "border-box",

        padding: "14px",

        border:
            "1px solid #d8dbe5",

        borderRadius: "11px",

        background: "#fafaff",

        fontSize: "15px",

        outline: "none"
    },


    submitButton: {
        width: "100%",

        marginTop: "22px",

        padding: "14px",

        border: "none",

        borderRadius: "11px",

        background:
            "linear-gradient(135deg, #7c3aed, #a855f7)",

        color: "#ffffff",

        fontSize: "15px",

        fontWeight: "700",

        cursor: "pointer"
    },


    registerError: {
        padding: "12px",

        borderRadius: "10px",

        background: "#fee2e2",

        color: "#991b1b",

        fontSize: "14px",

        marginBottom: "15px"
    },


    successBox: {
        textAlign: "center",

        background: "#f0fdf4",

        borderRadius: "15px",

        padding: "25px",

        color: "#166534"
    },


    successIcon: {
        width: "50px",
        height: "50px",

        margin: "0 auto 12px",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        borderRadius: "50%",

        background: "#22c55e",

        color: "#ffffff",

        fontSize: "25px",

        fontWeight: "800"
    },


    doneButton: {
        border: "none",

        borderRadius: "9px",

        padding: "10px 25px",

        background: "#166534",

        color: "#ffffff",

        cursor: "pointer",

        fontWeight: "700"
    }

};


export default Events;