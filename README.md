# 🎟️ EventSpark — Event Ticketing Platform

EventSpark is a full-stack event ticketing and registration platform that allows organizers to create and manage events while attendees can discover events, register for available seats, join waitlists, view their bookings, and cancel registrations.

The platform also handles automatic waitlist promotion, email notifications, database persistence, and concurrent booking requests.

---

## ✨ Features

### 👥 Attendee Features

* Browse available events
* Search events by name, category, description, or venue
* View event date, venue, category, price, and seat availability
* Register for an event
* Automatically join the waitlist when an event is full
* Maximum of 2 active registrations per attendee
* View personal bookings using email address
* Cancel confirmed or waitlisted bookings
* Receive booking confirmation emails
* Receive waitlist notification emails
* Receive promotion emails when a waitlisted attendee gets a seat

### 🧑‍💼 Organizer / Admin Features

* Create new events
* Set event name and description
* Set event date and venue
* Set seat limits
* Set event category
* Set ticket price
* View event registrants
* View confirmed, waitlisted, and cancelled bookings

### ⚙️ Backend Features

* REST API using Express.js
* MySQL database persistence
* Transaction-based event registration
* Row locking using `SELECT ... FOR UPDATE`
* Race-condition protection during seat booking
* Automatic waitlist handling
* Automatic waitlist promotion after cancellation
* Email notifications using Nodemailer
* Input validation
* API error handling

### 🧪 Testing

* Jest unit/API tests
* Supertest API testing
* Tests for API availability
* Tests for event retrieval
* Tests for missing event handling

---

## 🛠️ Technology Stack

### Frontend

* React
* React Router
* HTML5
* CSS3
* JavaScript ES6+

### Backend

* Node.js
* Express.js
* MySQL2
* Nodemailer
* CORS
* dotenv

### Testing

* Jest
* Supertest

### Development Tools

* Visual Studio Code
* Git
* GitHub
* MySQL

---

## 📁 Project Structure

```text
EventSpark/
│
├── backend/
│   ├── tests/
│   │   └── events.test.js
│   │
│   ├── db.js
│   ├── email.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Admin.jsx
│   │   │   └── MyBookings.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

## 🗄️ Database

EventSpark uses MySQL with two main tables.

### Events

Stores event information such as:

* Event ID
* Event name
* Description
* Event date
* Venue
* Seat limit
* Seats booked
* Category
* Price
* Creation date

### Bookings

Stores attendee registration information:

* Booking ID
* Event ID
* Attendee name
* Attendee email
* Booking status
* Creation date

Booking statuses:

```text
confirmed
waitlisted
cancelled
```

---

## 🔌 API Endpoints

### Events

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | `/`               | Check API status   |
| GET    | `/api/events`     | Get all events     |
| GET    | `/api/events/:id` | Get a single event |
| POST   | `/api/events`     | Create an event    |

### Registration

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| POST   | `/api/events/:id/register` | Register for an event |
| GET    | `/api/bookings?email=...`  | Get attendee bookings |
| DELETE | `/api/bookings/:id`        | Cancel a booking      |

### Admin

| Method | Endpoint                         | Description            |
| ------ | -------------------------------- | ---------------------- |
| GET    | `/api/admin/events/:id/bookings` | View event registrants |

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend` folder:

```env
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_google_app_password
```

The `.env` file is excluded from GitHub using `.gitignore`.

Do not upload your Gmail password or Google App Password to GitHub.

---

## ▶️ How to Run the Project

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Start MySQL

Make sure your MySQL server is running.

Create the database:

```sql
CREATE DATABASE eventspark;
```

Select it:

```sql
USE eventspark;
```

Create the required `events` and `bookings` tables according to the project database schema.

---

## 🚀 Start Backend

Open a terminal:

```bash
cd backend
npm install
npm start
```

Backend runs on:

```text
http://localhost:5000
```

Test the API:

```text
http://localhost:5000/api/events
```

---

## 💻 Start Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 🧪 Run Tests

From the backend folder:

```bash
npm test
```

The project uses Jest and Supertest to verify API functionality.

---

## 🔄 Booking Workflow

```text
Attendee
   │
   ▼
Browse Events
   │
   ▼
Select Event
   │
   ▼
Register
   │
   ├── Seats Available
   │       │
   │       ▼
   │    Confirmed
   │
   └── Event Full
           │
           ▼
        Waitlisted
```

When a confirmed attendee cancels:

```text
Confirmed Booking
        │
        ▼
    Cancellation
        │
        ├── Waitlist exists
        │       │
        │       ▼
        │   Promote oldest
        │   waitlisted attendee
        │
        └── No waitlist
                │
                ▼
          Release the seat
```

---

## 🔒 Concurrency Handling

EventSpark protects seat availability from race conditions during simultaneous registrations.

The backend uses a database transaction and row-level locking:

```sql
SELECT *
FROM events
WHERE id = ?
FOR UPDATE;
```

This ensures that concurrent registration requests cannot incorrectly increase the number of confirmed bookings beyond the event's seat limit.

---

## 📧 Email Notifications

EventSpark uses Nodemailer for email notifications.

Emails are sent for:

* Confirmed registrations
* Waitlist registrations
* Waitlist promotion after cancellation

---

## 📱 Responsive Design

The frontend is designed to work across:

* Desktop
* Tablet
* Mobile

The interface includes responsive navigation, event cards, registration forms, admin forms, and booking pages.

---

## 🎨 User Interface

The EventSpark interface uses:

* Blue and purple gradients
* Event photography
* Animated cards
* Responsive layouts
* Search functionality
* Modern navigation
* Event status badges
* Booking status indicators

---

## 📌 Project Status

**Status:** Completed

EventSpark implements the core requirements of an event ticketing platform, including event management, attendee registration, waitlisting, cancellation, automatic waitlist promotion, email notifications, database persistence, and concurrency-safe booking.

---

## 👨‍💻 Developer

**Bhavya Manikandan**

Computer Science Student
Full Stack Development Intern

---

## 📄 License

This project was developed as part of a full-stack development internship project.
