const Listing = require("./models/listing.js");
const { reviewModel } = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!req.user || !listing.owner.equals(req.user._id)) {  // ✅ Check if req.user exists
        req.flash("error", "You are not the owner of this listing");
        return res.redirect("/listings");
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;
    let review = await reviewModel.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect("/listings/all");
    }

    if (!req.user || !review.author.equals(req.user._id)) {  // ✅ Check if req.user exists
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next(); 
};
