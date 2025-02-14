const express = require("express");
const app = express();
const session = require("express-session");
app.use(session({ secret: "ILOVERADHAKRISHNA", 
    resave: false, saveUninitialized: true }));
// const Cookie-parser=require("cookie-parser");

// app.use(Cookie-parser("secretcode"));

// app.get("/",(req,res)=>
// {
//     console.log(req.Cookie-parser);
//     res.cookie("truelove","ILOVERADHAKRISHNA",{signed:true});
//     res.cookie("hapylove","shivaparavthivinayaka",{signed:true});
//     res.send("ILOVERADHAKRISHNA");
// });
app.get("/", (req, res) => {
    // console.log("RADHARKRISHNAKSVIDSUCEESFUL");
    res.send("ILOVERADHAKRISHNA");
});

app.get("/radha", (req, res) => {
    if(req.session.count){
        req.session.count++;
    }
    else
    {
        req.session.count=1;
    }
    res.send(`ILOVERADHAKRISHNA ${req.session.count}`);
    console.log(req.session);
});


app.get("/shivaparvathi", (req, res) => {
    // res.send("ILOVESHIVAPARVATHI");  
    let {name="ILOVERADHAKRISHNA"}=req.query;
    res.send(`ILOVERADHAKRISHNA ${name}`);
});


app.listen(3000, () => {
    console.log("RADHAKRISHNA SERVER GOING ON    3000");
});