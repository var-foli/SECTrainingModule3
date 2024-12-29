//NPM modules

//to install modules globally type "npm install (package) -g" ex. "npm install nodemon -g"
//to run file with nodemon type "nodemon (filename)"
//to run npm type "npm run dev"
//crtl-c to exit

console.log("testing!");

//to add package to project
//initialize npm with "npm init" or "npm init -y" to use defaults for questions
//"npm i date-fns" to install package as a regular dependency
//need to create a ".gitignore" file and type "node_modules" in it to ignore the modules
//to save module as a dev dependency type "npm i (module) -D" ex. "npm i nodemon -D"
//it will show up in package.json as a devDependency
//nodemon will restart server whenever saving file

const { format } = require("date-fns");
//importing v4 as uuid
const { v4: uuid } = require("uuid");
console.log(format(new Date(), "yyyyMMdd\tHH:mm:ss"));
console.log(uuid())

//to remove a module, npm rm (module) (include -g or -D depending on flag)
//will have to remove package from script afterwards