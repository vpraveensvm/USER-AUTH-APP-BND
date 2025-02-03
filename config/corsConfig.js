const allowedOrigins = ["http://localhost:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow requests with no 'origin' (e.g., mobile apps, Postman)
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies and credentials
};

module.exports = corsOptions;
