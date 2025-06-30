// 🌟 Divine Blessings 🌟
console.log("🔥 RADHAKRISHNA ❤️ | SHIVAPARVATHIVINAYAKA ❤️ | SITARAMA ❤️");

require("dotenv").config();
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");

// Models & Utilities
const Listing = require("./models/listing.js");
const User = require("./models/user.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// Routers
const listingRoutes = require("./routers/listing.js");
const reviewRoutes = require("./routers/review.js");
const userRoutes = require("./routers/user.js");

const app = express();

// ✅ Load MongoDB URL from Environment
const db = "mongodb+srv://radhakrishna:NMKRSPVLIDATA@cluster0.u71xq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
if (!db) {
    console.error("❌ MONGO_URL is missing! Set it in .env or environment variables.");
    process.exit(1);
}

// ✅ Secure Session Store with MongoDB
const store = MongoStore.create({
    mongoUrl: db,
    crypto: { secret: process.env.SESSION_SECRET || "fallbackSecret" },
    touchAfter: 24 * 3600, // Reduce session updates
});
store.on("error", (err) => console.error("❌ MongoStore Error:", err));

// ✅ Connect to MongoDB
// ...existing code...
mongoose
    .connect(db) // Remove useNewUrlParser and useUnifiedTopology
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    });
// ...existing code...
// ✅ View Engine Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ✅ Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
// ✅ Session Configuration
const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET || "fallbackSecret",
    saveUninitialized: false,
    resave: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 Week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // Security: Prevents XSS attacks
    },
};
app.use(session(sessionOptions));
app.use(flash());

// ✅ Passport.js Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Flash Messages Middleware
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// ✅ Routes
app.use("/", userRoutes);
app.use("/listings", listingRoutes);
app.use("/reviews", reviewRoutes);

// filepath: c:\Users\cheth\Downloads\wanderlust\app.js
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});
// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
    const message = err.message || "Something went wrong!";
    if (res.headersSent) return next(err);
    res.status(statusCode).render("error.ejs", { message, statusCode });
});



// ✅ Start Server
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
    console.log("🔥 RADHAKRISHNA LOVE UUUUU ❤️ MERN APP RUNNING SMOOTHLY!");
    console.log(`🚀 Server running on port ${PORT}`);
});
