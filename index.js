var express = require("express");
var bodyParser = require("body-parser");
var xmlparser = require("express-xml-bodyparser");
var session = require("express-session");
var path = require("path");
var dbUtils = require("./database.js");
var hash = require("./hash.js");

var app = express();
var conn = dbUtils.conn;
var pub = path.join(__dirname, "static");

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "static")));

app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    res.setHeader("Access-Control-Allow-Origin","*");
    next();
});

app.use(bodyParser.urlencoded({ extended: true, limit: "1gb" }));

app.use(bodyParser.json());

app.use(session({ secret: "ssshhhhh", saveUninitialized: true, resave: true }));

app.use(xmlparser());

app.get("/", function (req, res) {
    req.session.destroy();
    res.sendFile(path.join(pub, "/html/register.html"));
});

app.get("/login", function (req, res) {
    req.session.destroy();
    res.sendFile(path.join(pub, "/html/login.html"));
});

app.get("/homepage", (req, res) => {
    if (req.session.isValidated === undefined)
        res.sendFile(path.join(pub, "/html/404.html"));
    else res.sendFile(path.join(pub, "/html/homepage.html"));
});

app.get("/text", (req, res) => {
    if (req.session.isValidated === undefined)
        res.sendFile(path.join(pub, "/html/404.html"));
    else {
        promisedChats = dbUtils.returnChat(conn, req.session.emailId);

        promisedChats.then((chats) => {
            res.render("html/text-render.ejs", {
                firstName: req.session.firstName,
                chats: chats,
            });
        });
    }
});

app.get("/image", (req, res) => {
    if (req.session.isValidated === undefined)
        res.sendFile(path.join(pub, "/html/404.html"));
    else {
        let promisedImages = dbUtils.returnImage(conn, req.session.emailId);
        promisedImages.then((images) => {
            res.render("html/image-render.ejs", {
                firstName: req.session.firstName,
                images: images,
            });
        });
    }
});

app.post("/login", (req, res) => {
    data = req.body;
    data.password = hash(data.password);

    let validated = dbUtils.Validate(conn, data);

    validated.then((result) => {
        if (result[1] == true) {
            console.log("User validated");

            req.session.emailId = data.email;
            req.session.firstName = result[0];
            req.session.isValidated = true;
            req.session.status = result[2];

            res.json({ validated: "Accepted",status:result[2]});
        } else {
            console.log("User not validated");
            res.json({ validated: "Rejected" });
        }
    });
});

app.post("/", (req, res) => {
    data = req.body;
    data.password = hash(data.password);
    let numRows = dbUtils.isPresent(conn, data);
    
    numRows.then((result) => {
        console.log(result)
        if (result===undefined||result == 0) {
            console.log("User Added");
            let addPromise = dbUtils.Add(conn, data);

            addPromise.then(()=>{
                req.session.emailId = data.email;
                req.session.firstName = data.fname;
                req.session.isValidated = true;
    
                res.json({ status: "Accepted" });
            })
        } else {
            console.log("User Already Present");
            res.json({ status: "Rejected" });
        }
    });
});

app.post("/text", (req, res) => {
    data = {}
    data.text = req.body.text;
    data.email = req.session.emailId;

    if(req.body.id){
        let deletePromise = dbUtils.deleteChat(conn,req.body.id);
        deletePromise.then(()=>{
            res.redirect("/text");
        })
    }

    else{
    if (data.text != "") {
        let addPromise=dbUtils.addChat(conn, data);
        addPromise.then(()=>{
            res.redirect("/text");
        })
    }}
});

app.post("/image", (req, res) => {
    if(req.body.ids){
        let deletePromise = dbUtils.deleteImages(conn,req.body.ids);
        deletePromise.then(()=>{
            res.redirect("/image");
        })
    }

    else{
        req.on("data", (data) => {
            let addPromise = dbUtils.addImage(conn,{image:data.toString(),email:req.session.emailId})})

    }   
});

app.get("/manager/homepage",(req,res)=>{
    if(req.session.status=="MANAGER"){
    res.sendFile(path.join(pub,"/html/manager.html"));
    }
    else{
        res.sendFile(path.join(pub,"/html/404.html"));
    }
})

app.get("/manager/text",(req,res)=>{
    if(req.session.status=="MANAGER"){
        let promisedChats = dbUtils.returnAllChats(conn);
        promisedChats.then((chats)=>{
            res.render("html/text-manager.ejs",{chats:chats})
        })
    }
    else{
        res.sendFile(path.join(pub,"/html/404.html"));
    }
})

app.get("/manager/image",(req,res)=>{
    if(req.session.status=="MANAGER"){
        let promisedImages = dbUtils.returnAllImages(conn);
        promisedImages.then((images)=>{
            res.render("html/image-manager.ejs",{images:images})
        })
    }
    else{
        res.sendFile(path.join(pub,"/html/404.html"));
    }
})

app.post("/manager/image",(req,res)=>{
    //console.log("Here")
    console.log(req.body.ids)
    if(req.body.ids){
        let deletePromise = dbUtils.deleteImages(conn,req.body.ids);
        deletePromise.then(()=>{
            res.redirect("/manager/image");
        })
    }
})


app.listen(5000);

process.on('exit',()=>{
    app.close();
})
