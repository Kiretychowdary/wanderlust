const express = require("express");
const Router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewModel } = require("../models/review.js");
const Listing = require("../models/listing.js");
const  {reviewSchema}  = require('../schema.js');
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const listingControllers=require("../controllers/reviews.js")
// Middleware to validate the review
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(e => e.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// POST route to add a review
Router.post("/listings/:id/reviews", isLoggedIn, validateReview, wrapAsync(listingControllers.addReview));


Router.delete("/listings/:id/reviews/:reviewId", isReviewAuthor, wrapAsync(listingControllers.reviews));

module.exports = Router;
