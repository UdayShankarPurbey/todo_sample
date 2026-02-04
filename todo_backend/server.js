const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/todos", require("./src/routes/todo.route"));
// Test route
app.get("/", (req, res) => {
  res.send("Todo API is running");
});

const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`Server running on port ${PORT}`)
// );


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`)
});

