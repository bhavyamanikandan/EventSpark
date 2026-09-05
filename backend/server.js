const express = require("express");
const cors = require("cors");

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

app.listen(PORT, () => {
    console.log(`EventSpark backend running on http://localhost:${PORT}`);
});