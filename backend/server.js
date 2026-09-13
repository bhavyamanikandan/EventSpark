require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./db");
const { sendBookingEmail } = require("./email");

const app = express();

app.use(cors());
app.use(express.json());


// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "EventSpark API is running"
  });
});


// =====================================================
// GET ALL EVENTS
// =====================================================

app.get("/api/events", async (req, res) => {
  try {
    const [events] = await pool.query(`
      SELECT
        id,
        name,
        description,
        event_date,
        venue,
        seat_limit,
        seats_booked,
        category,
        price,
        (seat_limit - seats_booked) AS available_seats,
        CASE
          WHEN seats_booked >= seat_limit THEN 'full'
          ELSE 'available'
        END AS status
      FROM events
      ORDER BY event_date ASC
    `);

    res.json(events);

  } catch (error) {
    console.error(
      "Error fetching events:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch events"
    });
  }
});


// =====================================================
// GET SINGLE EVENT
// =====================================================

app.get("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [events] = await pool.query(
      `
      SELECT
        id,
        name,
        description,
        event_date,
        venue,
        seat_limit,
        seats_booked,
        category,
        price,
        (seat_limit - seats_booked) AS available_seats,
        CASE
          WHEN seats_booked >= seat_limit THEN 'full'
          ELSE 'available'
        END AS status
      FROM events
      WHERE id = ?
      `,
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.json(events[0]);

  } catch (error) {
    console.error(
      "Error fetching event:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch event"
    });
  }
});


// =====================================================
// CREATE EVENT
// =====================================================

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
    } = req.body;

    if (
      !name ||
      !event_date ||
      !venue ||
      !seat_limit
    ) {
      return res.status(400).json({
        message:
          "Name, event date, venue and seat limit are required"
      });
    }

    if (Number(seat_limit) <= 0) {
      return res.status(400).json({
        message:
          "Seat limit must be greater than 0"
      });
    }

    if (Number(price || 0) < 0) {
      return res.status(400).json({
        message:
          "Price cannot be negative"
      });
    }

    const [result] = await pool.query(
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
        name,
        description || "",
        event_date,
        venue,
        Number(seat_limit),
        category || "General",
        Number(price || 0)
      ]
    );

    res.status(201).json({
      message: "Event created successfully",
      id: result.insertId
    });

  } catch (error) {
    console.error(
      "Error creating event:",
      error
    );

    res.status(500).json({
      message: "Failed to create event"
    });
  }
});


// =====================================================
// REGISTER FOR EVENT
// =====================================================

app.post(
  "/api/events/:id/register",
  async (req, res) => {

    const connection =
      await pool.getConnection();

    try {
      const { id } = req.params;

      const {
        attendee_name,
        attendee_email
      } = req.body;

      if (
        !attendee_name ||
        !attendee_email
      ) {
        return res.status(400).json({
          message:
            "Attendee name and email are required"
        });
      }

      await connection.beginTransaction();


      // -------------------------------------------------
      // LOCK EVENT ROW
      // -------------------------------------------------

      const [events] =
        await connection.query(
          `
          SELECT *
          FROM events
          WHERE id = ?
          FOR UPDATE
          `,
          [id]
        );


      if (events.length === 0) {

        await connection.rollback();

        return res.status(404).json({
          message: "Event not found"
        });
      }


      const event = events[0];


      // -------------------------------------------------
      // CHECK MAXIMUM 2 ACTIVE BOOKINGS
      // -------------------------------------------------

      const [existingBookings] =
        await connection.query(
          `
          SELECT COUNT(*) AS count
          FROM bookings
          WHERE attendee_email = ?
          AND status IN ('confirmed', 'waitlisted')
          `,
          [attendee_email]
        );


      if (
        existingBookings[0].count >= 2
      ) {

        await connection.rollback();

        return res.status(400).json({
          message:
            "You can have a maximum of 2 active registrations."
        });
      }


      // -------------------------------------------------
      // DETERMINE BOOKING STATUS
      // -------------------------------------------------

      let bookingStatus;

      if (
        event.seats_booked <
        event.seat_limit
      ) {

        bookingStatus = "confirmed";

      } else {

        bookingStatus = "waitlisted";
      }


      // -------------------------------------------------
      // INSERT BOOKING
      // -------------------------------------------------

      const [bookingResult] =
        await connection.query(
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
            id,
            attendee_name,
            attendee_email,
            bookingStatus
          ]
        );


      // -------------------------------------------------
      // UPDATE SEAT COUNT
      // -------------------------------------------------

      if (
        bookingStatus === "confirmed"
      ) {

        await connection.query(
          `
          UPDATE events
          SET seats_booked =
            seats_booked + 1
          WHERE id = ?
          `,
          [id]
        );
      }


      await connection.commit();


      // -------------------------------------------------
      // SEND EMAIL
      // -------------------------------------------------

      try {

        await sendBookingEmail(
          attendee_email,
          attendee_name,
          event.name,
          bookingStatus
        );

      } catch (emailError) {

        console.error(
          "Email sending failed:",
          emailError
        );

      }


      // -------------------------------------------------
      // RESPONSE
      // -------------------------------------------------

      if (
        bookingStatus === "confirmed"
      ) {

        return res.status(201).json({
          message:
            "Registration successful! Your booking is confirmed.",
          booking_id:
            bookingResult.insertId,
          status: "confirmed"
        });

      }


      return res.status(201).json({
        message:
          "Event is full. You have been added to the waitlist.",
        booking_id:
          bookingResult.insertId,
        status: "waitlisted"
      });


    } catch (error) {

      await connection.rollback();

      console.error(
        "Registration error:",
        error
      );

      res.status(500).json({
        message:
          "Registration failed"
      });

    } finally {

      connection.release();
    }
  }
);


// =====================================================
// GET BOOKINGS BY ATTENDEE EMAIL
// =====================================================

app.get(
  "/api/bookings",
  async (req, res) => {

    try {

      const { email } = req.query;


      if (!email) {

        return res.status(400).json({
          message:
            "Email is required"
        });
      }


      const [bookings] =
        await pool.query(
          `
          SELECT
            b.id,
            b.event_id,
            b.attendee_name,
            b.attendee_email,
            b.status,
            b.created_at,
            e.name AS event_name,
            e.description,
            e.event_date,
            e.venue,
            e.category,
            e.price
          FROM bookings b
          INNER JOIN events e
            ON b.event_id = e.id
          WHERE LOWER(b.attendee_email)
            = LOWER(?)
          ORDER BY b.created_at DESC
          `,
          [email]
        );


      res.json(bookings);


    } catch (error) {

      console.error(
        "Error fetching attendee bookings:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch bookings"
      });
    }
  }
);


// =====================================================
// CANCEL BOOKING
// =====================================================

app.delete(
  "/api/bookings/:id",
  async (req, res) => {

    const connection =
      await pool.getConnection();

    try {

      const { id } = req.params;

      await connection.beginTransaction();


      // -------------------------------------------------
      // LOCK BOOKING
      // -------------------------------------------------

      const [bookings] =
        await connection.query(
          `
          SELECT
            b.*,
            e.name AS event_name
          FROM bookings b
          INNER JOIN events e
            ON b.event_id = e.id
          WHERE b.id = ?
          FOR UPDATE
          `,
          [id]
        );


      if (bookings.length === 0) {

        await connection.rollback();

        return res.status(404).json({
          message:
            "Booking not found"
        });
      }


      const booking =
        bookings[0];


      if (
        booking.status === "cancelled"
      ) {

        await connection.rollback();

        return res.status(400).json({
          message:
            "Booking is already cancelled"
        });
      }


      // -------------------------------------------------
      // CANCEL BOOKING
      // -------------------------------------------------

      await connection.query(
        `
        UPDATE bookings
        SET status = 'cancelled'
        WHERE id = ?
        `,
        [id]
      );


      // -------------------------------------------------
      // IF CONFIRMED BOOKING IS CANCELLED
      // -------------------------------------------------

      if (
        booking.status === "confirmed"
      ) {

        // Find oldest waitlisted booking
        const [waitlisted] =
          await connection.query(
            `
            SELECT *
            FROM bookings
            WHERE event_id = ?
            AND status = 'waitlisted'
            ORDER BY created_at ASC, id ASC
            LIMIT 1
            FOR UPDATE
            `,
            [booking.event_id]
          );


        if (
          waitlisted.length > 0
        ) {

          const promoted =
            waitlisted[0];


          // Promote waitlisted attendee
          await connection.query(
            `
            UPDATE bookings
            SET status = 'confirmed'
            WHERE id = ?
            `,
            [promoted.id]
          );


          // Seat count stays the same
          // because one confirmed attendee
          // was replaced by another attendee.


          await connection.commit();


          // Send promotion email
          try {

            await sendBookingEmail(
              promoted.attendee_email,
              promoted.attendee_name,
              booking.event_name,
              "confirmed"
            );

          } catch (emailError) {

            console.error(
              "Promotion email failed:",
              emailError
            );
          }


          return res.json({
            message:
              "Booking cancelled and the next waitlisted attendee has been promoted."
          });
        }


        // No waitlisted attendee
        await connection.query(
          `
          UPDATE events
          SET seats_booked =
            CASE
              WHEN seats_booked > 0
              THEN seats_booked - 1
              ELSE 0
            END
          WHERE id = ?
          `,
          [booking.event_id]
        );
      }


      await connection.commit();


      res.json({
        message:
          "Booking cancelled successfully."
      });


    } catch (error) {

      await connection.rollback();

      console.error(
        "Cancellation error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to cancel booking"
      });

    } finally {

      connection.release();
    }
  }
);


// =====================================================
// ADMIN - VIEW EVENT REGISTRANTS
// =====================================================

app.get(
  "/api/admin/events/:id/bookings",
  async (req, res) => {

    try {

      const { id } = req.params;


      // Check event exists
      const [events] =
        await pool.query(
          `
          SELECT id
          FROM events
          WHERE id = ?
          `,
          [id]
        );


      if (events.length === 0) {

        return res.status(404).json({
          message:
            "Event not found"
        });
      }


      const [bookings] =
        await pool.query(
          `
          SELECT
            id,
            event_id,
            attendee_name,
            attendee_email,
            status,
            created_at
          FROM bookings
          WHERE event_id = ?
          ORDER BY created_at ASC
          `,
          [id]
        );


      res.json(bookings);


    } catch (error) {

      console.error(
        "Error fetching registrants:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch registrants"
      });
    }
  }
);


// =====================================================
// START SERVER
// =====================================================

if (require.main === module) {

  const PORT =
    process.env.PORT || 5000;

  app.listen(
    PORT,
    () => {

      console.log(
        `Server running on port ${PORT}`
      );

    }
  );
}


module.exports = app;