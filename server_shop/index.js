const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const upload = require("express-fileupload");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  express.json({
    limit: "50mb",
  }),
);

app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  }),
);

app.use(upload());

app.use("/", express.static("public"));

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const aiRouter = require("./API/Router/ai.router");

const productAPI = require("./API/Router/products.router");

const userAPI = require("./API/Router/users.router");

const cartAPI = require("./API/Router/carts.router");

const historiesAPI = require("./API/Router/histories.router");

const commentAPI = require("./API/Router/comment.router");

app.use("/ai", aiRouter);

app.use("/products", productAPI);

app.use("/users", userAPI);

app.use("/carts", cartAPI);

app.use("/histories", historiesAPI);

app.use("/comment", commentAPI);

app.get("/", (req, res) => {
  res.json({
    message: "Camera Shop API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
