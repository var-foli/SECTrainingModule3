const User = require("../model/User");
//bcrypt used to hash out password
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({"message": "Username and password are required."});
  //check for duplicate usersnames in db, use .exec() bc we are doing it async
  const duplicate = await User.findOne({username: user}).exec();
  if (duplicate) return res.sendStatus(409); //409 means conflict

  try {
    //encrypt password
    //hashing and salting *10 pwd to keep pwd from being compromised in the db
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create and store the new user
    const result = await User.create({
      "username": user, 
      "password": hashedPwd
    });

    

    console.log(result);
    
    res.status(201).json({"success": `New user ${user} created!`});
  } catch (err) {
    res.status(500).json({"message": err.message});
  }
}

module.exports = { handleNewUser }