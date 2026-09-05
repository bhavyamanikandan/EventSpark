const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "EventSpark API is running successfully!"
  });
});

app.get("/api/events", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Tech Conference 2026",
      date: "20 September 2026",
      location: "Delhi",
      status: "Available"
    },
    {
      id: 2,
      name: "Music Festival",
      date: "5 October 2026",
      location: "Delhi",
      status: "Available"
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`EventSpark backend running at http://localhost:${PORT}`);
});