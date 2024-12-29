console.log("Hello World!");

//node js has global object instead of window object (in vanilla js)
console.log(global);

//uses CommonJS modules
//importing os and printing 
const os = require("os");
console.log(os.type());
console.log(os.version());
console.log(os.homedir());

console.log(__dirname);
console.log(__filename);
//importing path
const path = require("path");
console.log(path.dirname(__filename));
console.log(path.basename(__filename));
console.log(path.extname(__filename));

console.log(path.parse(__filename));

//can import self-made modules
const math = require("./math");
console.log(math.add(2,3));

const { add, subtract, multiply, divide } = require("./math");
console.log(add(2,3));
console.log(subtract(2,3));
console.log(multiply(2,3));
console.log(divide(2,3));

