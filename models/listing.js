const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  review: [{ type: Schema.Types.ObjectId, ref: "Review" }], // ✅ Fixed reference name
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      requires: true,
    },
  },

});

// ✅ Prevent model redeclaration error
const Listing = mongoose.models.Listing || mongoose.model("Listing", listingSchema);
module.exports = Listing;
