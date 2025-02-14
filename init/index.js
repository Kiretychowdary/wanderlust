const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const Initdata = require("./data.js");

main()
    .then(() => {
        console.log("RAHDAKRIHSNSHIVAPARVATHIVINAYAKALOVEIGREATET")
        console.log("MONGODB IS CONNECTED");
    })
    .catch(() => {
        console.log("check The Mongodb Connection");
    });


async function main() {

    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


const InitDb = async () => {
    await Listing.deleteMany({});
    let updated=Initdata.data.map((obj)=>({ ...obj,owner:"67a190f3847ba12f97e70a02"}));
    
    await Listing.insertMany(updated);

}


InitDb();