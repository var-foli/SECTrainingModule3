const express = require("express");
const router = express.Router();
const data = {};
data.employees = require("../../data/employees.json");

//chains different http request methods together
router.route("/")
  .get((req, res) => {
    res.json(data.employees);
  })
  //posting a new employee
  .post((req, res) => {
    res.json({
      "firstname": req.body.firstname,
      "lastname": req.body.firstname
    });
  })
  .put((req, res) => {
    res.json({
      "firstname": req.body.firstname,
      "lastname": req.body.firstname
    });
  })
  .delete((req, res) => {
    res.json({
      "id": req.body.id,
    });
  })

//when id param directly in url
router.route("/:id")
  .get((req, res) => {
    //pulling id parameter from url
    res.json({"id": req.params.id})
  });

module.exports = router;