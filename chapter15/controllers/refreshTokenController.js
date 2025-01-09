const User = require("../model/User");
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies
  //checking if cookies and if there is a jwt property
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  //can put refreshToken instead of refreshToken: refreshToken bc property and variable name are the same
  const foundUser = await User.findOne({refreshToken}).exec();
  if (!foundUser) return res.sendStatus(403); //401 means forbidden
  //evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {"UserInfo": {
          "username": decoded.username,
          "roles": roles
        }
      },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "30s"}
      );
      res.json({accessToken})
    }
  );
}


module.exports = {handleRefreshToken};