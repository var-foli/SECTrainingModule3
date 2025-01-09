//... allows to pass in any number of variables, all called allowedRoles
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req.roles);
    //mapping matches and finding the values that are true matches
    const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
    if (!result) return res.sendStatus(401);
    next();
  }
}

module.exports = verifyRoles