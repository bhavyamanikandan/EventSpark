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
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80"
};

const defaultImage =
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80";


function MyBookings() {

    const [bookings, setBookings] = useState([]);
    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [cancelBooking, setCancelBooking] = useState(null);
    const [cancelling, setCancelling] = useState(false);
    const [message, setMessage] = useState("");


    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {
        loadData();
    }, []);


    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [bookingsResponse, eventsResponse] =
                await Promise.all([
                    fetch(`${API_URL}/api/bookings`),
                    fetch(`${API_URL}/api/events`)
                ]);

            if (!bookingsResponse.ok) {
                throw new Error("Unable to load bookings");
            }

            if (!eventsResponse.ok) {
                throw new Error("Unable to load events");
            }

            const bookingsData =
                await bookingsResponse.json();

            const eventsData =
                await eventsResponse.json();


            if (Array.isArray(bookingsData)) {
                setBookings(bookingsData);
            } else if (Array.isArray(bookingsData.bookings)) {
                setBookings(bookingsData.bookings);
            } else {
                setBookings([]);
            }


            if (Array.isArray(eventsData)) {
                setEvents(eventsData);
            } else if (Array.isArray(eventsData.events)) {
                setEvents(eventsData.events);
            } else {
                setEvents([]);
            }

        } catch (err) {

            console.error("Error loading bookings:", err);

            setError(
                "Unable to load your bookings. Please make sure the backend is running."
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================================================
    // EVENT HELPERS
    // =========================================================

    const getEvent = (booking) => {

        return events.find(
            (event) =>
                String(event.id) ===
                String(booking.event_id)
        );
    };


    const getEventName = (booking) => {

        const event = getEvent(booking);

        return (
            event?.name ||
            event?.title ||
            booking.event_name ||
            booking.name ||
            `Event #${booking.event_id}`
        );
    };


    const getEventDate = (booking) => {

        const event = getEvent(booking);

        const date =
            event?.event_date ||
            event?.date ||
            booking.event_date ||
            booking.date;

        if (!date) {
            return "Date not available";
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    };


    const getEventLocation = (booking) => {

        const event = getEvent(booking);

        return (
            event?.location ||
            event?.venue ||
            booking.location ||
            booking.venue ||
            "Location not available"
        );
    };


    const getEventImage = (booking) => {

        const eventName = getEventName(booking);

        return eventImages[eventName] || defaultImage;
    };


    const getStatus = (booking) => {

        return (
            booking.status || "confirmed"
        ).toLowerCase();
    };


    // =========================================================
    // CANCELLATION
    // =========================================================

    const openCancelPopup = (booking) => {

        setMessage("");
        setCancelBooking(booking);
    };


    const closeCancelPopup = () => {

        if (cancelling) {
            return;
        }

        setCancelBooking(null);
    };


    const confirmCancellation = async () => {

        if (!cancelBooking) {
            return;
        }

        try {

            setCancelling(true);
            setMessage("");

            const response = await fetch(
                `${API_URL}/api/bookings/${cancelBooking.id}/cancel`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to cancel booking"
                );
            }

            setCancelBooking(null);

            setMessage(
                data.message ||
                "Booking cancelled successfully."
            );

            await loadData();

        } catch (err) {

            console.error(
                "Cancellation error:",
                err
            );

            setMessage(
                err.message ||
                "Unable to cancel booking."
            );

        } finally {

            setCancelling(false);

        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div style={styles.loadingPage}>

                <div style={styles.loadingIcon}>
                    🎟️
                </div>

                <h2 style={styles.loadingTitle}>
                    Loading Your Bookings...
                </h2>

                <p style={styles.loadingText}>
                    Please wait while we retrieve your bookings.
                </p>

            </div>
        );
    }


    // =========================================================
    // MAIN
    // =========================================================

    return (

        <div style={styles.page}>

            {/* ================= HEADER ================= */}

            <section style={styles.header}>

                <div>

                    <div style={styles.headerTag}>
                        🎟️ EVENTSPARK
                    </div>

                    <h1 style={styles.headerTitle}>
                        My Bookings
                    </h1>

                    <p style={styles.headerSubtitle}>
                        View and manage your event registrations.
                    </p>

                </div>


                <div style={styles.bookingCount}>

                    <div style={styles.countNumber}>
                        {bookings.length}
                    </div>

                    <div style={styles.countText}>
                        Bookings
                    </div>

                </div>

            </section>


            {/* ================= SUCCESS ================= */}

            {message && (

                <div style={styles.successMessage}>

                    <div style={styles.successIcon}>
                        ✓
                    </div>

                    <span>
                        {message}
                    </span>

                    <button
                        onClick={() => setMessage("")}
                        style={styles.messageClose}
                    >
                        ×
                    </button>

                </div>
            )}


            {/* ================= ERROR ================= */}

            {error && (

                <div style={styles.errorBox}>

                    <span>
                        ⚠️ {error}
                    </span>

                    <button
                        onClick={loadData}
                        style={styles.retryButton}
                    >
                        Try Again
                    </button>

                </div>
            )}


            {/* ================= EMPTY ================= */}

            {!error && bookings.length === 0 && (

                <div style={styles.emptyBox}>

                    <div style={styles.emptyIcon}>
                        🎟️
                    </div>

                    <h2 style={styles.emptyTitle}>
                        No Bookings Yet
                    </h2>

                    <p style={styles.emptyText}>
                        You have not registered for any events yet.
                    </p>

                </div>
            )}


            {/* ================= BOOKINGS ================= */}

            {!error && bookings.length > 0 && (

                <div style={styles.bookingList}>

                    {bookings.map((booking) => {

                        const status = getStatus(booking);

                        const isCancelled =
                            status === "cancelled";

                        const eventName =
                            getEventName(booking);

                        return (

                            <article
                                key={booking.id}
                                style={{
                                    ...styles.bookingCard,
                                    ...(isCancelled
                                        ? styles.cancelledCard
                                        : {})
                                }}
                            >

                                {/* IMAGE */}

                                <div style={styles.imageContainer}>

                                    <img
                                        src={getEventImage(booking)}
                                        alt={eventName}
                                        style={styles.image}
                                    />

                                    <div style={styles.imageOverlay}>
                                        {status === "confirmed" &&
                                            "✓ CONFIRMED"}

                                        {status === "waitlisted" &&
                                            "⏳ WAITLISTED"}

                                        {status === "cancelled" &&
                                            "✕ CANCELLED"}
                                    </div>

                                </div>


                                {/* CONTENT */}

                                <div style={styles.bookingContent}>

                                    <div style={styles.topRow}>

                                        <div style={styles.titleArea}>

                                            <div style={styles.eventLabel}>
                                                EVENT
                                            </div>

                                            <h2 style={styles.eventTitle}>
                                                {eventName}
                                            </h2>

                                        </div>


                                        <span
                                            style={{
                                                ...styles.statusBadge,

                                                ...(status === "confirmed"
                                                    ? styles.confirmed
                                                    : {}),

                                                ...(status === "waitlisted"
                                                    ? styles.waitlisted
                                                    : {}),

                                                ...(status === "cancelled"
                                                    ? styles.cancelled
                                                    : {})
                                            }}
                                        >

                                            {status === "confirmed" &&
                                                "✓ Confirmed"}

                                            {status === "waitlisted" &&
                                                "⏳ Waitlisted"}

                                            {status === "cancelled" &&
                                                "✕ Cancelled"}

                                        </span>

                                    </div>


                                    <div style={styles.divider} />


                                    {/* DETAILS */}

                                    <div style={styles.detailsGrid}>

                                        <div style={styles.detailItem}>

                                            <div style={styles.detailIcon}>
                                                📅
                                            </div>

                                            <div>
                                                <span style={styles.detailLabel}>
                                                    Date
                                                </span>

                                                <strong style={styles.detailValue}>
                                                    {getEventDate(booking)}
                                                </strong>
                                            </div>

                                        </div>


                                        <div style={styles.detailItem}>

                                            <div style={styles.detailIcon}>
                                                📍
                                            </div>

                                            <div>
                                                <span style={styles.detailLabel}>
                                                    Location
                                                </span>

                                                <strong style={styles.detailValue}>
                                                    {getEventLocation(booking)}
                                                </strong>
                                            </div>

                                        </div>


                                        <div style={styles.detailItem}>

                                            <div style={styles.detailIcon}>
                                                👤
                                            </div>

                                            <div>
                                                <span style={styles.detailLabel}>
                                                    Attendee
                                                </span>

                                                <strong style={styles.detailValue}>
                                                    {booking.attendee_name ||
                                                        booking.name ||
                                                        "Attendee"}
                                                </strong>
                                            </div>

                                        </div>

                                    </div>


                                    <div style={styles.divider} />


                                    {/* BOTTOM */}

                                    <div style={styles.bottomRow}>

                                        <div>

                                            <span style={styles.bookingIdLabel}>
                                                BOOKING ID
                                            </span>

                                            <span style={styles.bookingId}>
                                                #{booking.id}
                                            </span>

                                        </div>


                                        {!isCancelled && (

                                            <button
                                                onClick={() =>
                                                    openCancelPopup(booking)
                                                }
                                                style={styles.cancelButton}
                                            >
                                                Cancel Booking
                                            </button>

                                        )}

                                    </div>

                                </div>

                            </article>
                        );
                    })}

                </div>
            )}


            {/* ================= CANCEL MODAL ================= */}

            {cancelBooking && (

                <div
                    style={styles.modalOverlay}
                    onClick={closeCancelPopup}
                >

                    <div
                        style={styles.modal}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div style={styles.warningIcon}>
                            ⚠️
                        </div>

                        <h2 style={styles.modalTitle}>
                            Cancel Booking?
                        </h2>

                        <p style={styles.modalText}>
                            Are you sure you want to cancel your
                            booking for
                        </p>

                        <h3 style={styles.modalEventName}>
                            {getEventName(cancelBooking)}
                        </h3>

                        <p style={styles.modalWarning}>
                            Your seat will be released for this event.
                        </p>

                        <div style={styles.modalActions}>

                            <button
                                onClick={closeCancelPopup}
                                disabled={cancelling}
                                style={styles.keepButton}
                            >
                                Keep Booking
                            </button>

                            <button
                                onClick={confirmCancellation}
                                disabled={cancelling}
                                style={styles.confirmCancelButton}
                            >
                                {cancelling
                                    ? "Cancelling..."
                                    : "Yes, Cancel"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}


// =============================================================
// STYLES
// =============================================================

const styles = {

    // ================= PAGE =================

    page: {
        minHeight: "100vh",
        background: "#e6ddee",
        paddingBottom: "70px",
        fontFamily: "Inter, Arial, Helvetica, sans-serif"
    },


    // ================= HEADER =================

    header: {
        width: "90%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "45px 0 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    headerLabel: {
        color: "#7c3aed",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "2px",
        marginBottom: "8px"
    },

    headerTitle: {
        color: "#172554",
        fontSize: "42px",
        fontWeight: "800",
        margin: 0
    },

    headerSubtitle: {
        color: "#64748b",
        fontSize: "16px",
        marginTop: "10px"
    },


    // ================= BOOKING COUNT =================

    bookingCount: {
        width: "110px",
        height: "90px",
        borderRadius: "16px",
        background: "#7c3aed",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 20px rgba(124, 58, 237, 0.25)"
    },

    bookingCountStrong: {
        fontSize: "28px",
        fontWeight: "800"
    },


    // ================= LIST =================

    bookingList: {
        width: "90%",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },


    // ================= BOOKING CARD =================

    bookingCard: {
        display: "flex",
        background: "#ffffff",
        borderRadius: "18px",
        overflow: "hidden",
        border: "1px solid #d9dff5",
        boxShadow: "0 6px 18px rgba(30, 41, 59, 0.08)",
        minHeight: "285px"
    },

    cancelledCard: {
        opacity: 0.65
    },


    // ================= IMAGE =================

    imageContainer: {
        width: "270px",
        minWidth: "270px",
        position: "relative",
        background: "#312e81"
    },

    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block"
    },


    imageOverlay: {
        position: "absolute",
        bottom: "12px",
        left: "12px",
        background: "#7c3aed",
        color: "#ffffff",
        padding: "6px 10px",
        borderRadius: "7px",
        fontSize: "10px",
        fontWeight: "800"
    },


    // ================= CONTENT =================

    bookingContent: {
        flex: 1,
        padding: "28px 32px",
        background: "#ffffff"
    },

    topRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px"
    },

    titleArea: {
        flex: 1
    },

    eventLabel: {
        color: "#8b5cf6",
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "2px",
        marginBottom: "6px"
    },

    eventTitle: {
        color: "#172554",
        fontSize: "27px",
        fontWeight: "800",
        margin: 0
    },


    // ================= STATUS =================

    statusBadge: {
        padding: "8px 14px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "800",
        whiteSpace: "nowrap"
    },

    confirmed: {
        background: "#dcfce7",
        color: "#15803d"
    },

    waitlisted: {
        background: "#fef3c7",
        color: "#b45309"
    },

    cancelled: {
        background: "#fee2e2",
        color: "#b91c1c"
    },


    // ================= DIVIDER =================

    divider: {
        height: "1px",
        background: "#e5e7eb",
        margin: "20px 0"
    },


    // ================= DETAILS =================

    detailsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px"
    },

    detailItem: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },

    detailIcon: {
        width: "38px",
        height: "38px",
        borderRadius: "9px",
        background: "#ede9fe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "17px"
    },

    detailLabel: {
        display: "block",
        color: "#94a3b8",
        fontSize: "12px",
        marginBottom: "3px"
    },

    detailValue: {
        display: "block",
        color: "#172554",
        fontSize: "14px",
        fontWeight: "700"
    },


    // ================= BOTTOM =================

    bottomRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },

    bookingId: {
        color: "#475569",
        fontSize: "13px",
        fontWeight: "600"
    },


    // ================= CANCEL BUTTON =================

    cancelButton: {
        border: "1px solid #fca5a5",
        background: "#fff1f2",
        color: "#dc2626",
        padding: "9px 17px",
        borderRadius: "8px",
        fontWeight: "700",
        cursor: "pointer"
    },


    // ================= SUCCESS =================

    successMessage: {
        width: "90%",
        maxWidth: "1200px",
        margin: "0 auto 20px",
        padding: "13px 18px",
        background: "#dcfce7",
        border: "1px solid #86efac",
        borderRadius: "10px",
        color: "#166534",
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },

    messageClose: {
        marginLeft: "auto",
        border: "none",
        background: "transparent",
        color: "#166534",
        fontSize: "20px",
        cursor: "pointer"
    },


    // ================= ERROR =================

    errorBox: {
        width: "90%",
        maxWidth: "1200px",
        margin: "0 auto 20px",
        padding: "15px 18px",
        background: "#fff1f2",
        border: "1px solid #fecdd3",
        borderRadius: "10px",
        color: "#9f1239",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },

    retryButton: {
        border: "none",
        borderRadius: "7px",
        padding: "8px 15px",
        background: "#7c3aed",
        color: "#ffffff",
        cursor: "pointer",
        fontWeight: "700"
    },


    // ================= EMPTY =================

    emptyBox: {
        width: "90%",
        maxWidth: "700px",
        margin: "40px auto",
        padding: "60px 25px",
        textAlign: "center",
        background: "#ffffff",
        borderRadius: "18px",
        border: "1px solid #d9dff5"
    },

    emptyIcon: {
        width: "65px",
        height: "65px",
        margin: "0 auto 15px",
        borderRadius: "15px",
        background: "#ede9fe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "30px"
    },

    emptyTitle: {
        color: "#172554",
        margin: "0 0 8px"
    },

    emptyText: {
        color: "#64748b"
    },


    // ================= LOADING =================

    loadingPage: {
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#eef2ff",
        color: "#172554"
    },

    loadingIcon: {
        width: "60px",
        height: "60px",
        borderRadius: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#7c3aed",
        color: "#ffffff",
        fontSize: "26px",
        marginBottom: "15px"
    },

    loadingTitle: {
        margin: "0 0 5px"
    },

    loadingText: {
        color: "#64748b"
    },


    // ================= MODAL =================

    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 10000
    },

    modal: {
        width: "100%",
        maxWidth: "420px",
        background: "#ffffff",
        borderRadius: "18px",
        padding: "30px",
        textAlign: "center",
        boxShadow: "0 20px 50px rgba(0,0,0,0.25)"
    },

    warningIcon: {
        width: "60px",
        height: "60px",
        margin: "0 auto 15px",
        borderRadius: "50%",
        background: "#fef3c7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "27px"
    },

    modalTitle: {
        margin: "0 0 10px",
        color: "#172554",
        fontSize: "25px"
    },

    modalText: {
        margin: 0,
        color: "#64748b",
        fontSize: "14px",
        lineHeight: "1.6"
    },

    modalEventName: {
        margin: "10px 0",
        color: "#7c3aed",
        fontSize: "19px"
    },

    modalWarning: {
        margin: "8px 0 22px",
        color: "#94a3b8",
        fontSize: "13px"
    },

    modalActions: {
        display: "flex",
        gap: "10px"
    },

    keepButton: {
        flex: 1,
        padding: "11px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        background: "#ffffff",
        color: "#334155",
        fontWeight: "700",
        cursor: "pointer"
    },

    confirmCancelButton: {
        flex: 1,
        padding: "11px",
        borderRadius: "8px",
        border: "none",
        background: "#dc2626",
        color: "#ffffff",
        fontWeight: "700",
        cursor: "pointer"
    }
};
export default MyBookings;