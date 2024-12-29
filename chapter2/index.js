const fs = require("fs");
const path = require("path");

//file is read async
fs.readFile("./files/starter.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data.toString());
});

//if error is throw it will throw err and exit program
process.on("uncaughtException", err => {
  console.error(`There was an uncaught error: ${err}`);
  process.exit(1);
})




//instead to avoid hardcoding filepath
fs.readFile(path.join(__dirname, "files", "starter.txt"), "utf8", (err, data) => {
  if (err) throw err;
  console.log(data.toString());
});

//can write file
fs.writeFile(path.join(__dirname, "files", "reply.txt"), "Nice to meet you", (err) => {
  if (err) throw err;
  console.log("Write complete");
});

//append file
fs.appendFile(path.join(__dirname, "files", "test.txt"), "Testing text", (err) => {
  if (err) throw err;
  console.log("Append complete");
});

//to write and append file in order
fs.writeFile(path.join(__dirname, "files", "reply.txt"), "Nice to meet you", (err) => {
  if (err) throw err;
  console.log("Write complete");

  fs.appendFile(path.join(__dirname, "files", "reply.txt"), "\n\nYes it is", (err) => {
    if (err) throw err;
    console.log("Append complete");

    //can also rename file afterwards
    fs.rename(path.join(__dirname, "files", "reply.txt"), path.join(__dirname, "files", "newReply.txt"), (err) => {
      if (err) throw err;
      console.log("Rename complete");
    });
  });
});

//^^^this looks like callback hell
//instead....
//do things in an async await way, with promises
const fsPromises = require("fs").promises;
const fileOps = async () => {
  try {
    const data = await fsPromises.readFile(path.join(__dirname, "files", "starter.txt"), "utf8");
    console.log(data);
    //deleting starter.txt
    await fsPromises.unlink(path.join(__dirname, "files", "starter.txt"));

    await fsPromises.writeFile(path.join(__dirname, "files", "promiseWrite.txt"), data);
    await fsPromises.appendFile(path.join(__dirname, "files", "promiseWrite.txt"), "\n\nNice to meet you");
    await fsPromises.rename(path.join(__dirname, "files", "promiseWrite.txt"), path.join(__dirname, "files", "promiseComplete.txt"));
    const newData = await fsPromises.readFile(path.join(__dirname, "files", "promiseComplete.txt"), "utf8");
    console.log(newData);
  } catch (err) {
    console.error(err);
  }
}

fileOps();