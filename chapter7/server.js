const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
//importing logEvents and a custom middleware logger to log what is being requested
const {logger, logEvents} = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

app.use(logger);

//cors stands for cross origin resource sharing
//allows to fetch this server data from another site like https://www.yoursite.com or LiveServer (http://127.0.0.1:5500) or localhost
const whitelist = ['https://www.yoursite.com', "http://127.0.0.1:5500", "http://localhost:3500"]
const corsOptions = {
    //origin is accepting an anonymous fxn that takes in two parameters: origin(unrealted to origin function) and callback
    origin: (origin, callback) => {
        //if the domain is in the whitelist, will pass with a no error callback, setting origin to true
        //OR if origin is undefined - this needs to be removed after development
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        //otherwise will return an error
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

//built-in middleware to handle urlencoded data aka form data
//built-in doesn't need the next call
//ex. "content-type: application/x-www-form-urlencoded"
app.use(express.urlencoded({extended: false}));

//built-in middleware for json
app.use(express.json());

//bultin in middleware for serving static files
//need to manually create the public folder first
//express will search the public folder before looking at any routes below because it works sequentially
app.use(express.static(path.join(__dirname, "/public")));



app.get("^/$|/index(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
    res.redirect(301, "new-page.html"); 
});

app.get("/hello(.html)?", (req, res, next) => {
    console.log("attempted to load hello.html");
    next();
}, (req, res) => {
    res.send("Hello World!");
});


const one = (req, res, next) => {
    console.log("one");
    next();
};

const two = (req, res, next) => {
    console.log("two");
    next();
};

const three = (req, res) => {
    console.log("three");
    res.send("Finished!");
};

app.get("/chain(.html)?", [one, two, three]);

//app.use("/") is for middleware
//but app.all is more for routing
//everything else that made it to this point will get the 404
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")){
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({error: "404 Not Found"});
    } else {
        res.type("txt").send("404 Not Found");
    }
});

//custom error handling
app.use(errorHandler);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));