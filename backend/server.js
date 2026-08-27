const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const projectRoutes = require("./routes/projectRoutes");
const contactRoutes = require("./routes/contactRoutes");


// ==========================================
// CONFIG
// ==========================================

dotenv.config();

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ==========================================
// ROUTES
// ==========================================

app.use(
    "/api/projects",
    projectRoutes
);

app.use(
    "/api/contact",
    contactRoutes
);


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.json({
        message: "Portfolio backend is running"
    });

});


// ==========================================
// MONGODB
// ==========================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log("MongoDB Connected");

    })
    .catch((error) => {

        console.error(
            "MongoDB Connection Error:",
            error
        );

    });


// ==========================================
// SERVER
// ==========================================

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