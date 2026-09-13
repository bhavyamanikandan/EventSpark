const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendBookingEmail(to, name, eventName, status) {

    let subject;
    let message;

    if (status === "confirmed") {

        subject = `EventSpark Booking Confirmed - ${eventName}`;

        message = `
Hello ${name},

Your booking for "${eventName}" has been confirmed successfully.

Thank you for registering with EventSpark.

Regards,
EventSpark Team
`;

    } else {

        subject = `EventSpark Waitlist Confirmation - ${eventName}`;

        message = `
Hello ${name},

The event "${eventName}" is currently full.

You have been added to the waitlist.

We will notify you if a seat becomes available.

Regards,
EventSpark Team
`;
    }

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: message
    });
}

module.exports = {
    sendBookingEmail
};