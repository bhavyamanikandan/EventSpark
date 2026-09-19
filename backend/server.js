const express = require("express");
const cors = require("cors");
const pool = require("./db");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// Temporary event data
const events = [
    {
        id: 1,
        title: "Midnight Vibes Concert",
        category: "Music",
        location: "Chennai, Tamil Nadu",
        date: "24 August 2026",
        price: 499,
        totalSeats: 200,
        bookedSeats: 120
    },
    {
        id: 2,
        title: "Tech Summit 2026",
        category: "Conference",
        location: "Bangalore, Karnataka",
        date: "30 August 2026",
        price: 999,
        totalSeats: 150,
        bookedSeats: 80
    },
    {
        id: 3,
        title: "Cooking Masterclass",
        category: "Workshop",
        location: "Coimbatore, Tamil Nadu",
        date: "5 September 2026",
        price: 799,
        totalSeats: 50,
        bookedSeats: 25
    },
    {
        id: 4,
        title: "Startup Networking Night",
        category: "Business",
        location: "Hyderabad, Telangana",
        date: "12 September 2026",
        price: 599,
        totalSeats: 100,
        bookedSeats: 100
    }
];

// Home API
app.get("/", (req, res) => {
    res.json({
        message: "EventSpark API is running successfully!"
    });
});

// Get all events
app.get("/api/events", (req, res) => {
    const result = events.map(event => ({
        ...event,
        availableSeats: event.totalSeats - event.bookedSeats,
        status:
            event.bookedSeats >= event.totalSeats
                ? "Full"
                : event.bookedSeats > 0
                ? "Available"
                : "Available"
    }));

    res.json(result);
});
// Register for an event
app.post("/api/events/:id/register", async (req, res) => {
    try {
        const eventId = req.params.id;
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        // Find event
        const event = events.find(
            (event) => String(event.id) === String(eventId)
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        // Check whether the attendee is already registered
        const [existing] = await pool.execute(
            `SELECT id FROM bookings
             WHERE event_id = ?
             AND attendee_email = ?
             AND status != 'cancelled'`,
            [eventId, email]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: "You are already registered for this event"
            });
        }

        // Determine booking status
        const availableSeats = event.totalSeats - event.bookedSeats;

        const status = availableSeats > 0
            ? "confirmed"
            : "waitlisted";

        // Save booking in database
        const [result] = await pool.execute(
            `INSERT INTO bookings
            (event_id, attendee_name, attendee_email, status)
            VALUES (?, ?, ?, ?)`,
            [eventId, name, email, status]
        );

        // Update in-memory seat count only when confirmed
        if (status === "confirmed") {
            event.bookedSeats++;
        }

        res.status(201).json({
            success: true,
            message:
                status === "confirmed"
                    ? "Registration successful"
                    : "Event is full. You have been added to the waitlist.",
            bookingId: result.insertId,
            status: status
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});
if (require.main === module) {
    app.listen(5000, () => {
        console.log("EventSpark backend running on http://localhost:5000");
    });
}

module.exports = app;