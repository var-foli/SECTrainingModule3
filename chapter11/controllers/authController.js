const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) { this.users = data}
}

const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({"message": "Username and password are required."});
  const foundUser = usersDB.users.find(person => person.username === user);
  if (!foundUser) return res.sendStatus(401); //401 means unauthorized
  //evaluate password with bcrypt
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    //would also create other JWTs here
    const accessToken = jwt.sign(
      {"username": foundUser.username},
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: "30s"}
    );
    const refreshToken = jwt.sign(
      {"username": foundUser.username},
      process.env.REFRESH_TOKEN_SECRET,
      {expiresIn: "1d"}
    );
    //Saving refreshToken with current user - allows us to invalidate the access token when user logs out
    const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
    const currentUser = {...foundUser, refreshToken};
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    //accessToken would need to be stored in memory to keep it from being vulnerable
    //setting refreshToken to 1d (the maxAge) and sending at an httpOnly cookie which isn't accessible to JS
    res.cookie("jwt", refreshToken, {httpOnly: true, samesite: "None", secure: true, maxAge: 24*60*60*1000});
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
}


module.exports = {handleLogin};