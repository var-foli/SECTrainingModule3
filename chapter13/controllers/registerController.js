const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) { this.users = data}
}
const fsPromises = require("fs").promises;
const path = require("path");
//bcrypt used to hash out password
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({"message": "Username and password are required."});
  //check for duplicate usersnames in db
  const duplicate = usersDB.users.find(person => person.username === user);
  if (duplicate) return res.sendStatus(409); //409 means conflict
  try {
    //encrypt password
    //hashing and salting *10 pwd to keep pwd from being compromised in the db
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //store the new user
    const newUser = {
      "username": user, 
      "roles": {"User": 2001},
      "password": hashedPwd
    };
    //creating a new array and setting it equal to that
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    console.log(usersDB.users);
    res.status(201).json({"success": `New user ${user} created!`});
  } catch (err) {
    res.status(500).json({"message": err.message});
  }
}

module.exports = { handleNewUser }