const Listing = require("../models/listing.js");
const { reviewModel } = require("../models/review.js");



module.exports.addReview=async (req, res) => {
    const { id } = req.params; // Fixed destructuring
    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    const review = new reviewModel(req.body.review);
    review.author = req.user._id;
    console.log(review)
    await review.save();

    listing.review.push(review);
    await listing.save();
    req.flash("success", "Successfully added a review");

    res.redirect(`/listings/${id}`);
}

module.exports.reviews=async (req, res) => {
    const { id, reviewId } = req.params;
    // const { reviewId } = req.parms;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await reviewModel.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}