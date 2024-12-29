const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = require("./logEvents");
const EventEmitter = require("events");
class Emitter extends EventEmitter {};
//initialize object
const myEmitter = new Emitter();

//listening for messages
myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));

//hosting server locally so we're just giving it port 3500
const PORT = process.env.PORT || 3500;

//function for serving the data
const serveFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(filePath, 
      //if contentType include image, include empty string
      !contentType.includes("image") ? "utf8" : ""
    );
    const data = contentType === "application/json"
      ? JSON.parse(rawData) : rawData;
    response.writeHead(
      filePath.includes("404.html") ? 404 : 200,
       {"Content-Type": contentType});
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.log(err);
    myEmitter.emit("log", `${err.name}: ${err.message}`, `errLog.txt`);
    response.statusCode = 500;
    response.end();
  }
}

//creating server, takes a request (req) and a response(res)
const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  //emmitting a log message
  myEmitter.emit("log", `${req.url}\t${req.method}`, `reqLog.txt`);

  //getting path extension
  const extension = path.extname(req.url);

  let contentType;

  //using switch statement to indicate content type
  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "applicationt/json";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    //covers cases of / or .html
    default:
      contentType = "text/html";
  }

  let filePath = 
    contentType === 'text/html' && req.url === "/"
      //pathname will be made using this info if the above is true
      ? path.join(__dirname, "views", "index.html")
      //otherwise checks if there are subdirectories included in the url
      : contentType === "text/html" && req.url.slice(-1) === "/"
        //then it includrs the url subdirectory in the pathname
        ? path.join(__dirname, "views", req.url, "index.html")
        //just check if content is just html
        : contentType === "text/html"
          //then just includes the subdirectory in pathname
          ? path.join(__dirname, "views", req.url)
          //otherwise just uses the request url because it could just be asking for css or png etc.
          : path.join(__dirname, req.url);
  
  //if there was just a / and no file extension and there was no / at the end (could be ex. if just about page and not indicating html)
  //will just add .html to the end to fix user error
  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    serveFile(filePath, contentType, res);
  } else {
    //base is the end of the url ex. "old.html"
    switch(path.parse(filePath).base) {
      case "old-page.html" :
        //redirecting using code 301 to new-page.html
        res.writeHead(301, {"Location": "/new-page.html"});
        res.end();
        break;
      case "www-page.html":
        //redirecting to home page
        res.writeHead(301, {"Location": "/"});
        res.end();
        break;
      default:
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }
});

//listening for a request
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));