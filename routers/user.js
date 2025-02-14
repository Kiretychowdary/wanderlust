const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user.js");
const { savedRedirectUrl } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listingControllers = require("../controllers/users.js")



router.route("/signup")
   .get((req, res) => {
      // res.send("ILOVERADHAKRISHNA");
      res.render("users/signup.ejs");
   })
   .post(wrapAsync(listingControllers.addUser))
// router.get("/signup", (req, res) => {
//    // res.send("ILOVERADHAKRISHNA");
//    res.render("users/signup.ejs");
// });

// router.post("/signup", wrapAsync(listingControllers.addUser));

//

router.route("/login")
   .get(listingControllers.userdetails)
   .post(savedRedirectUrl,
      passport.authenticate("local",
         { failureRedirect: "/login", failureFlash: true }),
      listingControllers.userAuth)
// router.get("/login", listingControllers.userdetails);


// router.post("/login", savedRedirectUrl,
//    passport.authenticate("local",
//       { failureRedirect: "/login", failureFlash: true }),
//    listingControllers.userAuth);


router.get("/logout", listingControllers.userLogout);

module.exports = router;