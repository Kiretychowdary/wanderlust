const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const cookie = require("cookie-parser");
const passport = require("passport");
const { isLoggedIn } = require("../middleware.js");
const multer = require('multer');
const { storage } = require("../cloudinary.js")
const upload = multer({ storage })
// 🛠️ If using image uploads, uncomment and fix this
// const multer = require("multer");
// const { storage } = require("../cloudinary.js");
// const upload = multer({ storage });

const listingControllers = require("../controllers/listings");

router.use(cookie());

// ✅ Middleware to validate the listing
const validateListing = (req, res, next) => {
    console.log("Received Data:", req.body); // Debugging incoming data

    const { error } = listingSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errMsg = error.details.map((e) => e.message).join(", ");
        return next(new ExpressError(400, errMsg));
    } else {
        next();
    }
};

// ✅ Test Route: Set a Cookie
router.get("/", wrapAsync((req, res) => {
    res.cookie("name", "ILOVERADHAKRISHNAPERMANENTLYUUUUUU", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });
    res.send("ILOVERADHAKRISHNAPERMANENTLYUUUUUU");
}));

// ✅ List all Listings
router.get("/all", wrapAsync(listingControllers.index));

// ✅ Show the New Listing Form
router.get("/new", isLoggedIn, wrapAsync(listingControllers.renderNewForm));

// ✅ Create a New Listing (with image upload support if enabled)
// router.post("/new", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingControllers.createList));
router.post("/new", isLoggedIn, upload.single('listing[image]'), wrapAsync(listingControllers.createList));
// router.post("/new",upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// });

// ✅ Edit Listing Form
router.get("/:id/edit", isLoggedIn, wrapAsync(listingControllers.editForm));
// ✅ Update Listing
router.put("/:id/edit", isLoggedIn, validateListing, wrapAsync(listingControllers.updateList));

// ✅ Show a Specific Listing and Handle Reviews
router.route("/:id")
    .get(wrapAsync(listingControllers.showForm))
    .post(isLoggedIn, wrapAsync(listingControllers.createReview));

// ✅ Delete a Review
router.delete("/:id/reviews/:reviewId", isLoggedIn, wrapAsync(listingControllers.review));



module.exports = router;
