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
const db = process.env.MONGO_URL;
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
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    });

// ✅ View Engine Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ✅ Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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

// ✅ Handle 404 Errors
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    if (res.headersSent) return next(err);
    console.error(err.stack);
    res.status(statusCode).render("error.ejs", { message, statusCode });
});

// ✅ Start Server
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
    console.log("🔥 RADHAKRISHNA LOVE UUUUU ❤️ MERN APP RUNNING SMOOTHLY!");
    console.log(`🚀 Server running on port ${PORT}`);
});
