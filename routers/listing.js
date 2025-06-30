const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const cookie = require("cookie-parser");
const passport = require("passport");
const { isLoggedIn } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudinary.js");
const upload = multer({ storage });
const qs = require("qs");

const listingControllers = require("../controllers/listings");

// ✅ Middleware to parse cookies
router.use(cookie());

// ✅ Validate listing middleware
const validateListing = (req, res, next) => {
    // Convert flat body (listing[title]) into nested object (listing.title)
    req.body = qs.parse(req.body);

    console.log("Parsed Listing:", req.body); // You can keep or remove this later

    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(e => e.message).join(", ");
        return next(new ExpressError(400, errMsg));
    }
    next();
};


// ✅ Test route to set a cookie
router.get("/", wrapAsync((req, res) => {
    res.cookie("name", "ILOVERADHAKRISHNAPERMANENTLYUUUUUU", {
        httpOnly: true,
        sameSite: "Strict",
    });
    res.send("ILOVERADHAKRISHNAPERMANENTLYUUUUUU");
}));

// ✅ Show all listings
router.get("/all", wrapAsync(listingControllers.index));

// ✅ Create New Listing Form — MUST come before `/:id`
router.get("/new", isLoggedIn, wrapAsync(listingControllers.renderNewForm));

// ✅ Create Listing (POST /listings)
router.post(
    "/",
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControllers.createList)
);

// ✅ Edit Listing Form
router.get("/:id/edit", isLoggedIn, wrapAsync(listingControllers.editForm));

// ✅ Update Listing
router.put(
    "/:id/edit",
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControllers.updateList)
);

// ✅ Show listing & add review — this MUST come after static routes
router.route("/:id")
    .get(wrapAsync(listingControllers.showForm))
    .post(isLoggedIn, wrapAsync(listingControllers.createReview));

// ✅ Delete Review
router.delete("/:id/reviews/:reviewId", isLoggedIn, wrapAsync(listingControllers.review));

module.exports = router;
