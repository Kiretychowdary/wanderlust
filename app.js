// RADHAKRISHNA❤️❤️❤️❤️
// SHIVAPARVATHIVINAYAKA❤️❤️❤️❤️❤️❤️
// SITARAMA❤️❤️❤️❤️❤️❤️
require("dotenv").config();
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");  // ✅ Fixed typo
const Listing = require("./models/listing.js");
const User = require("./models/user.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const listingRoutes = require("./routers/listing.js");
const reviewRoutes = require("./routers/review.js");
const userRoutes = require("./routers/user.js");
const MongoStore = require('connect-mongo');
const app = express();

// ✅ Use environment variable for MongoDB URL
// const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

const db=process.env.MONGO_URL


const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    crypto: {
        secret: 'squirrel'
    },
    touchAfter: 24 * 3600
});
store.on("error",()=>{
    console.log(err)
})

// ✅ Connect to MongoDB
mongoose.connect(db)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// ✅ Set View Engine
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
    secret: "ILOVERADHAKRISHNA",
    saveUninitialized: true,   // ✅ Fixed typo
    resave: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 Week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,  // Security: Prevents XSS attacks
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
    res.locals.currentUser = req.user;  // ✅ Ensure currentUser is available
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

// ✅ Error Handling Middleware (Improved)
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    if (res.headersSent) return next(err);

    console.error(err.stack);  // ✅ Log error for debugging
    res.status(statusCode).render("error.ejs", { message, statusCode });
});

// ✅ Start Server
const PORT = process.env.PORT || 8090;


app.listen(8090, () => {
    console.log("radhakrishnaloveuuuuumapemrnlatyyyyyyuuuuuuuu");
    console.log(`Server running on port 8090`);
});