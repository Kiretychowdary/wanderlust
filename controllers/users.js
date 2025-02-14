const User = require("../models/user.js");


module.exports.addUser = async (req, res) => {
    try {
        let { username, email, password } = req.body
        let newregister = new User({ email, username });
        let register = await User.register(newregister, password);


        req.login(register, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wandelust");
            res.redirect("/listings/all");
        });

    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/user");
    }
}

module.exports.userdetails = (req, res) => {

    res.render("users/login.ejs");
}

module.exports.userAuth = async (req, res) => {
    console.log(req.user._id);
    req.flash("success", "welcome back to Wandelust");
    let url = res.locals.redirectUrl || "/listings"
    res.redirect(url);
}

module.exports.userLogout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            next(err);
        }
        if (!req.isAuthenticated()) {
            req.flash("error", "You must be loggedIn");
            return res.redirect("/login");
        }
        req.flash("success", "You have successfully Logout");
        res.redirect("/listings/all")
    });
}