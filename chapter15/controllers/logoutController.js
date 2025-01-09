const User = require("../model/User");

const handleLogout = async (req, res) => {
  //on client, also delete the accessToken (done in front end)

  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204); //no content to send back
  const refreshToken = cookies.jwt;

  //checking if refreshToken in db
  const foundUser = await User.findOne({refreshToken}).exec();
  if (!foundUser) {
    res.clearCookie("jwt", {httpOnly: true, sameSite: "None", secure: true});
    return res.sendStatus(204); //401 means forbidden
  }
  
  //delete refreshToken in db by zeroing it out and updating DB with that
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", {httpOnly: true, sameSite: "None", secure: true});
  res.sendStatus(204);
}


module.exports = {handleLogout};