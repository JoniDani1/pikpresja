const express = require("express");
const cors = require("cors");
const path = require("path");

const { corsMiddleware, jsonMiddleware, limiter } = require("./middleware");

const app = express();

// --- Middleware ---
// Serve the static frontend
const frontendPath = path.join(__dirname, "../../docs");
app.use(express.static(frontendPath));

app.use(corsMiddleware);
app.use(jsonMiddleware);
app.use(limiter);


app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Placeholder for grammar routes which we will add next
const grammarRoutes = require('./routes/grammar');
app.use(grammarRoutes);



module.exports = app;
