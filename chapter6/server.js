const express = require("express");
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;

//specify to express that link must contain exactly / or /index.html with or without the .html
app.get("^/$|/index(.html)?", (req, res) => {
    //res.send("Hello World!");
    //res.sendFile("./views/index.html", {root: __dirname});
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
    res.redirect(301, "new-page.html"); //sends 302 (temporary redirect) by default, so we set it as a 301 (permanent redirect)
});

//Route handlers
//chaining functions to one another using next
app.get("/hello(.html)?", (req, res, next) => {
    console.log("attempted to load hello.html");
    next();
}, (req, res) => {
    res.send("Hello World!");
});

//also can chain this way
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

//use this if the url doesn't match any above
app.get("/*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html")); //redirecting and also telling express this is a 404 not a 200 (success)
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));