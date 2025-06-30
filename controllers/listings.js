// NMRKSVIDATA
//RADHAKRISHNAPERMANENT
// SHIVAPARVATHIVINAYAKA

const ExpressError = require("../utils/ExpressError");
// VINAYAKAPERMANENT
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { listingSchema } = require("../schema");
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN })

module.exports.index = async (req, res) => {
    let lists = await Listing.find({});
  
    res.cookie("love", "RADHAKRISHNASHIVAPAVATHIVINAYAKA", { httpOnly: true });
    res.render("index.ejs", { lists });
}

module.exports.renderNewForm = async (req, res) => {
    res.render("new.ejs");
}

module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    let post = await Listing.findById(id);
    let posts = await Listing.findById(id).populate({ path: "review" }).populate({ path: "owner" });
 
    if (!post) {
        req.flash("error", "Cannot Find the Listing to Edit");
        return res.redirect("/listings/all");
    }
    if (!post.owner.equals(req.user._id)) {
        req.flash("error", "You are not authorized to edit this listing");
        return res.redirect("/listings/all");

    }
    res.render("edit.ejs", { post });
}


module.exports.showForm = async (req, res) => {
    let { id } = req.params;
    let post = await Listing.findById(id).populate({ path: "review", populate: { path: "author" } }).populate("owner");
     
    if (!post) {
        req.flash("error", "Cannot Find the Listing");
        return res.redirect("/listings/all");
    }

    var currentUser = 0
    try {
        currentUser = req.user._id;
    }
    catch (er) {

    }
 
    res.render("show.ejs", { post, currentUser });
}


module.exports.createList = async (req, res) => {
    try {
        const { listing } = req.body;
        console.log(listing);
        
        if (!listing.location || listing.location.trim() === "") {
            req.flash("error", "Location is required.");
            return res.redirect("/listings/new");
        }

        // Fetch geocoding data based on submitted location
        let response = await geocodingClient.forwardGeocode({
            query: listing.location,
            limit: 1
        }).send();

        if (!response.body.features.length) {
            req.flash("error", "Invalid location. Please try again.");
            return res.redirect("/listings/new");
        }

        // Extract image details
        let url = req.file.path;
        let filename = req.file.filename;

        // Create a new listing
        const newListing = new Listing(listing);
        newListing.owner = req.user._id; // Assign the logged-in user
        newListing.image = { url, filename };
        newListing.geometry = response.body.features[0].geometry; // Use geocoded coordinates

        console.log("Geocoded location:", newListing.geometry);

        // Save to DB
        await newListing.save();
        req.flash("success", "Successfully created a new listing!");

        res.redirect("/listings/all");
    } catch (error) {
        console.error("Error in createList:", error);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/listings/new");
    }
};

 
module.exports.updateList = async (req, res) => {
    try {
        const { id } = req.params;
        const { listing } = req.body;

     
        let updatedListing = await Listing.findByIdAndUpdate(id, { ...listing }, { new: true });

      
        if (req.file) {
            updatedListing.image = {
                url: req.file.path,
                filename: req.file.filename,
            };
        }
        console.log(req.file);
        await updatedListing.save();

        req.flash("success", "Your listing has been updated!");
        res.redirect(`/listings/${id}`);

    } catch (error) {
        console.error("❌ Error in updateList:", error);
        req.flash("error", "Could not update listing. Please try again.");
        res.redirect(`/listings/${id}/edit`);
    }
};

module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings/all");
    }
    const review = new Review(req.body.review);
    listing.reviews.push(review);
    await listing.save();
    req.flash("success", "Review added!");
    res.redirect(`/listings/${id}`);
}

module.exports.review = async (req, res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings/all");
    }
    listing.reviews.pull(reviewId);
    await listing.save();
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}