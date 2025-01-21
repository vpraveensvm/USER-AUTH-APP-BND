const express = require("express");
const errorHandler = require("./middlewares/ErrorHandler");
const connectDb = require("./config/dbConnect");
const cors = require("cors");
const corsOptions = require("./config/corsConfig");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

app.use(express.json());
//middleware for cookies
app.use(cookieParser());

connectDb();

mongoose.connection.once("open", () => {
  console.log("MongoDB connection established successfully");
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

app.use(cors(corsOptions));

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

//custom error handler middleware
//default error-handling middleware function is added at the end of the middleware function stack
// app.use(errorHandler);
