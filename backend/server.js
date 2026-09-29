require("dotenv").config();
console.log("MAILTRAP_HOST =", process.env.MAILTRAP_HOST);
console.log("MAILTRAP_PORT =", process.env.MAILTRAP_PORT);
console.log("MAILTRAP_USER =", process.env.MAILTRAP_USER ? "Loaded" : "Missing");
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const {
    sendBookingConfirmation,
    sendWaitlistNotification,
    sendPromotionNotification
} = require("./email");

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "EventSpark API is running successfully!"
    });

});


// ==========================================
// GET ALL EVENTS
// ==========================================

app.get("/api/events", async (req, res) => {

    try {

        const [rows] = await pool.execute(`
            SELECT
                e.id,
                e.name,
                e.description,
                e.event_date,
                e.venue,
                e.seat_limit,
                e.category,
                e.price,

                COALESCE(
                    SUM(
                        CASE
                            WHEN b.status = 'confirmed'
                            THEN 1
                            ELSE 0
                        END
                    ),
                    0
                ) AS confirmed_bookings

            FROM events e

            LEFT JOIN bookings b
                ON e.id = b.event_id

            GROUP BY
                e.id,
                e.name,
                e.description,
                e.event_date,
                e.venue,
                e.seat_limit,
                e.category,
                e.price

            ORDER BY e.event_date ASC
        `);


        const events = rows.map((event) => {

            const seatLimit =
                Number(event.seat_limit || 0);

            const seatsBooked =
                Number(event.confirmed_bookings || 0);

            const seatsAvailable =
                Math.max(
                    seatLimit - seatsBooked,
                    0
                );


            let status = "Available";

            if (seatsAvailable === 0) {

                status = "Full";

            } else if (seatsAvailable <= 10) {

                status = "Almost Full";

            }


            return {

                id: event.id,

                name: event.name,

                title: event.name,

                description: event.description,

                date: event.event_date,

                event_date: event.event_date,

                venue: event.venue,

                location: event.venue,

                seat_limit: seatLimit,

                seats_booked: seatsBooked,

                seats_available: seatsAvailable,

                category: event.category,

                price: Number(event.price || 0),

                status: status
            };

        });


        res.json({

            success: true,

            count: events.length,

            events: events
        });


    } catch (error) {

        console.error(
            "GET EVENTS ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Unable to load events",

            error: error.message
        });
    }

});


// ==========================================
// GET SINGLE EVENT
// ==========================================

app.get("/api/events/:id", async (req, res) => {

    try {

        const eventId =
            Number(req.params.id);


        if (
            !eventId ||
            Number.isNaN(eventId)
        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid event ID"
            });
        }


        const [rows] = await pool.execute(`

            SELECT
                e.id,
                e.name,
                e.description,
                e.event_date,
                e.venue,
                e.seat_limit,
                e.category,
                e.price,

                COALESCE(
                    SUM(
                        CASE
                            WHEN b.status = 'confirmed'
                            THEN 1
                            ELSE 0
                        END
                    ),
                    0
                ) AS confirmed_bookings

            FROM events e

            LEFT JOIN bookings b
                ON e.id = b.event_id

            WHERE e.id = ?

            GROUP BY
                e.id,
                e.name,
                e.description,
                e.event_date,
                e.venue,
                e.seat_limit,
                e.category,
                e.price

        `, [eventId]);


        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Event not found"
            });
        }


        const event = rows[0];


        const seatLimit =
            Number(event.seat_limit || 0);

        const seatsBooked =
            Number(event.confirmed_bookings || 0);

        const seatsAvailable =
            Math.max(
                seatLimit - seatsBooked,
                0
            );


        res.json({

            success: true,

            event: {

                id: event.id,

                name: event.name,

                title: event.name,

                description: event.description,

                date: event.event_date,

                event_date: event.event_date,

                venue: event.venue,

                location: event.venue,

                seat_limit: seatLimit,

                seats_booked: seatsBooked,

                seats_available: seatsAvailable,

                category: event.category,

                price: Number(event.price || 0),

                status:
                    seatsAvailable <= 0
                        ? "Full"
                        : seatsAvailable <= 10
                            ? "Almost Full"
                            : "Available"
            }
        });


    } catch (error) {

        console.error(
            "GET SINGLE EVENT ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Unable to load event",

            error: error.message
        });
    }

});


// ==========================================
// CREATE NEW EVENT
// ==========================================

app.post("/api/events", async (req, res) => {

    try {

        const {
            name,
            description,
            event_date,
            venue,
            seat_limit,
            category,
            price
        } = req.body || {};


        if (
            !name ||
            !event_date ||
            !venue ||
            !seat_limit
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Event name, date, venue and seat limit are required"
            });
        }


        const seatLimit =
            Number(seat_limit);

        const eventPrice =
            Number(price || 0);


        if (seatLimit <= 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Seat limit must be greater than 0"
            });
        }


        if (eventPrice < 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Price cannot be negative"
            });
        }


        const [result] =
            await pool.execute(
                `
                INSERT INTO events
                (
                    name,
                    description,
                    event_date,
                    venue,
                    seat_limit,
                    seats_booked,
                    category,
                    price
                )
                VALUES (?, ?, ?, ?, ?, 0, ?, ?)
                `,
                [
                    name.trim(),
                    description || "",
                    event_date,
                    venue.trim(),
                    seatLimit,
                    category || "General",
                    eventPrice
                ]
            );


        return res.status(201).json({

            success: true,

            message:
                "Event created successfully",

            eventId:
                result.insertId
        });


    } catch (error) {

        console.error(
            "CREATE EVENT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to create event",

            error:
                error.message
        });
    }

});


// ==========================================
// REGISTER FOR EVENT
// ==========================================

app.post("/api/events/:id/register", async (req, res) => {

    let connection;

    try {

        const eventId =
            Number(req.params.id);

        const {
            name,
            email
        } = req.body || {};


        if (
            !eventId ||
            Number.isNaN(eventId)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid event ID"
            });
        }


        if (!name || !email) {

            return res.status(400).json({

                success: false,

                message:
                    "Name and email are required"
            });
        }


        const attendeeName =
            name.trim();

        const attendeeEmail =
            email.trim().toLowerCase();


        if (
            !attendeeName ||
            !attendeeEmail
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name and email are required"
            });
        }


        // ======================================
        // START TRANSACTION
        // ======================================

        connection =
            await pool.getConnection();

        await connection.beginTransaction();


        // ======================================
        // LOCK EVENT ROW
        // ======================================

        const [eventRows] =
            await connection.execute(
                `
                SELECT
                    id,
                    name,
                    seat_limit
                FROM events
                WHERE id = ?
                FOR UPDATE
                `,
                [eventId]
            );


        if (eventRows.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message:
                    "Event not found"
            });
        }


        const event =
            eventRows[0];


        // ======================================
        // MAXIMUM 2 ACTIVE BOOKINGS
        // ======================================

        const [activeBookingRows] =
            await connection.execute(
                `
                SELECT COUNT(*) AS active_booking_count
                FROM bookings
                WHERE attendee_email = ?
                AND status IN ('confirmed', 'waitlisted')
                `,
                [attendeeEmail]
            );


        const activeBookingCount =
            Number(
                activeBookingRows[0]
                    .active_booking_count || 0
            );


        // ======================================
        // DUPLICATE EVENT REGISTRATION
        // ======================================

        const [existingRows] =
            await connection.execute(
                `
                SELECT id
                FROM bookings
                WHERE event_id = ?
                AND attendee_email = ?
                AND status IN ('confirmed', 'waitlisted')
                `,
                [
                    eventId,
                    attendeeEmail
                ]
            );


        if (existingRows.length > 0) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message:
                    "You are already registered for this event"
            });
        }


        // ======================================
        // MAXIMUM 2 EVENTS
        // ======================================

        if (activeBookingCount >= 2) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message:
                    "You can register for a maximum of 2 events."
            });
        }


        // ======================================
        // COUNT CONFIRMED BOOKINGS
        // ======================================

        const [countRows] =
            await connection.execute(
                `
                SELECT COUNT(*) AS confirmed_count
                FROM bookings
                WHERE event_id = ?
                AND status = 'confirmed'
                `,
                [eventId]
            );


        const confirmedCount =
            Number(
                countRows[0]
                    .confirmed_count || 0
            );


        const seatLimit =
            Number(event.seat_limit || 0);


        const availableSeats =
            seatLimit - confirmedCount;


        // ======================================
        // DETERMINE BOOKING STATUS
        // ======================================

        let status;


        if (availableSeats > 0) {

            status = "confirmed";

        } else {

            status = "waitlisted";
        }


        // ======================================
        // INSERT BOOKING
        // ======================================

        const [result] =
            await connection.execute(
                `
                INSERT INTO bookings
                (
                    event_id,
                    attendee_name,
                    attendee_email,
                    status
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    eventId,
                    attendeeName,
                    attendeeEmail,
                    status
                ]
            );


        // ======================================
        // UPDATE SEATS
        // ======================================

        if (status === "confirmed") {

            await connection.execute(
                `
                UPDATE events
                SET seats_booked =
                    seats_booked + 1
                WHERE id = ?
                `,
                [eventId]
            );
        }


        // ======================================
        // COMMIT
        // ======================================

        await connection.commit();


        // ======================================
        // SEND EMAIL
        // ======================================

        try {

            if (status === "confirmed") {

                await sendBookingConfirmation(
                    attendeeEmail,
                    attendeeName,
                    event.name
                );

            } else {

                await sendWaitlistNotification(
                    attendeeEmail,
                    attendeeName,
                    event.name
                );
            }

        } catch (emailError) {

            console.error(
                "Email notification failed:",
                emailError.message
            );

        }


        // ======================================
        // RESPONSE
        // ======================================

        return res.status(201).json({

            success: true,

            message:
                status === "confirmed"
                    ? "Registration successful"
                    : "Event is full. You have been added to the waitlist.",

            bookingId:
                result.insertId,

            eventId:
                eventId,

            status:
                status
        });


    } catch (error) {

        if (connection) {

            await connection.rollback();
        }


        console.error(
            "Registration error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Registration failed",

            error:
                error.message
        });


    } finally {

        if (connection) {

            connection.release();
        }
    }

});


// ==========================================
// GET ALL BOOKINGS
// ==========================================

app.get("/api/bookings", async (req, res) => {

    try {

        const [bookings] =
            await pool.execute(
                `
                SELECT
                    bookings.id,
                    bookings.event_id,
                    bookings.attendee_name,
                    bookings.attendee_email,
                    bookings.status,

                    events.name AS event_name,
                    events.event_date,
                    events.venue,
                    events.category,
                    events.price

                FROM bookings

                LEFT JOIN events
                    ON bookings.event_id =
                       events.id

                ORDER BY bookings.id DESC
                `
            );


        return res.status(200).json({

            success: true,

            count:
                bookings.length,

            bookings:
                bookings
        });


    } catch (error) {

        console.error(
            "Error loading bookings:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to load bookings",

            error:
                error.message
        });
    }

});


// ==========================================
// CANCEL BOOKING
// ==========================================

app.put("/api/bookings/:id/cancel", async (req, res) => {

    let connection;

    try {

        const bookingId =
            Number(req.params.id);


        if (
            !bookingId ||
            Number.isNaN(bookingId)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid booking ID"
            });
        }


        connection =
            await pool.getConnection();

        await connection.beginTransaction();


        // ======================================
        // GET BOOKING + EVENT NAME
        // ======================================

        const [bookingRows] =
            await connection.execute(
                `
                SELECT
                    bookings.id,
                    bookings.event_id,
                    bookings.status,
                    bookings.attendee_name,
                    bookings.attendee_email,
                    events.name AS event_name
                FROM bookings
                LEFT JOIN events
                    ON bookings.event_id =
                       events.id
                WHERE bookings.id = ?
                FOR UPDATE
                `,
                [bookingId]
            );


        if (bookingRows.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message:
                    "Booking not found"
            });
        }


        const booking =
            bookingRows[0];


        if (booking.status === "cancelled") {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message:
                    "Booking is already cancelled"
            });
        }


        // ======================================
        // CANCEL BOOKING
        // ======================================

        await connection.execute(
            `
            UPDATE bookings
            SET status = 'cancelled'
            WHERE id = ?
            `,
            [bookingId]
        );


        // ======================================
        // FREE SEAT IF CONFIRMED
        // ======================================

        if (booking.status === "confirmed") {

            await connection.execute(
                `
                UPDATE events
                SET seats_booked =
                    GREATEST(seats_booked - 1, 0)
                WHERE id = ?
                `,
                [booking.event_id]
            );


            // ==================================
            // FIND FIRST WAITLISTED ATTENDEE
            // ==================================

            const [waitlistRows] =
                await connection.execute(
                    `
                    SELECT
                        id,
                        attendee_name,
                        attendee_email
                    FROM bookings
                    WHERE event_id = ?
                    AND status = 'waitlisted'
                    ORDER BY id ASC
                    LIMIT 1
                    FOR UPDATE
                    `,
                    [booking.event_id]
                );


            // ==================================
            // PROMOTE WAITLISTED ATTENDEE
            // ==================================

            if (waitlistRows.length > 0) {

                const promotedBooking =
                    waitlistRows[0];


                // ------------------------------
                // Change status to confirmed
                // ------------------------------

                await connection.execute(
                    `
                    UPDATE bookings
                    SET status = 'confirmed'
                    WHERE id = ?
                    `,
                    [promotedBooking.id]
                );


                // ------------------------------
                // Increase booked seats
                // ------------------------------

                await connection.execute(
                    `
                    UPDATE events
                    SET seats_booked =
                        seats_booked + 1
                    WHERE id = ?
                    `,
                    [booking.event_id]
                );


                // ------------------------------
                // Commit promotion email later
                // ------------------------------

                await connection.commit();


                try {

                    await sendPromotionNotification(
                        promotedBooking.attendee_email,
                        promotedBooking.attendee_name,
                        booking.event_name
                    );

                } catch (emailError) {

                    console.error(
                        "Waitlist promotion email failed:",
                        emailError.message
                    );

                }


                return res.status(200).json({

                    success: true,

                    message:
                        "Booking cancelled successfully. A waitlisted attendee has been promoted."
                });

            }

        }


        // ======================================
        // COMMIT
        // ======================================

        await connection.commit();


        return res.status(200).json({

            success: true,

            message:
                "Booking cancelled successfully"
        });


    } catch (error) {

        if (connection) {

            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error(
                    "Rollback error:",
                    rollbackError.message
                );
            }
        }


        console.error(
            "Cancel booking error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to cancel booking",

            error:
                error.message
        });


    } finally {

        if (connection) {

            connection.release();
        }
    }

});


// ==========================================
// START SERVER
// ==========================================

if (require.main === module) {

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {

        console.log(
            `EventSpark backend running on port ${PORT}`
        );

    });

}

module.exports = app;