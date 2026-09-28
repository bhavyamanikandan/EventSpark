const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});


// ==========================================
// SEND BOOKING CONFIRMATION
// ==========================================

async function sendBookingConfirmation(
    attendeeEmail,
    attendeeName,
    eventName
) {

    await transporter.sendMail({

        from: `"EventSpark" <no-reply@eventspark.test>`,

        to: attendeeEmail,

        subject: `Booking Confirmed - ${eventName}`,

        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">

                <h2 style="color: #7c3aed;">
                    EventSpark
                </h2>

                <h3>
                    Booking Confirmed
                </h3>

                <p>
                    Hello ${attendeeName},
                </p>

                <p>
                    Your booking for
                    <strong>${eventName}</strong>
                    has been confirmed successfully.
                </p>

                <p>
                    Thank you for using EventSpark!
                </p>

            </div>
        `
    });
}


// ==========================================
// SEND WAITLIST EMAIL
// ==========================================

async function sendWaitlistNotification(
    attendeeEmail,
    attendeeName,
    eventName
) {

    await transporter.sendMail({

        from: `"EventSpark" <no-reply@eventspark.test>`,

        to: attendeeEmail,

        subject: `Waitlisted - ${eventName}`,

        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">

                <h2 style="color: #7c3aed;">
                    EventSpark
                </h2>

                <h3>
                    Added to Waitlist
                </h3>

                <p>
                    Hello ${attendeeName},
                </p>

                <p>
                    <strong>${eventName}</strong>
                    is currently full.
                </p>

                <p>
                    You have been added to the waitlist.
                    We will notify you if a seat becomes available.
                </p>

            </div>
        `
    });
}


// ==========================================
// SEND WAITLIST PROMOTION EMAIL
// ==========================================

async function sendPromotionNotification(
    attendeeEmail,
    attendeeName,
    eventName
) {

    await transporter.sendMail({

        from: `"EventSpark" <no-reply@eventspark.test>`,

        to: attendeeEmail,

        subject: `Seat Available - ${eventName}`,

        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">

                <h2 style="color: #7c3aed;">
                    EventSpark
                </h2>

                <h3>
                    Your Booking is Confirmed
                </h3>

                <p>
                    Hello ${attendeeName},
                </p>

                <p>
                    A seat has become available for
                    <strong>${eventName}</strong>.
                </p>

                <p>
                    Your waitlisted booking has now been
                    <strong>confirmed</strong>.
                </p>

                <p>
                    Thank you for using EventSpark!
                </p>

            </div>
        `
    });
}


module.exports = {
    sendBookingConfirmation,
    sendWaitlistNotification,
    sendPromotionNotification
};