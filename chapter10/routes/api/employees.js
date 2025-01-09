const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");

//model-view-controller design patterns separates these functions into a controller file to clean up the routes file
router.route("/")
  .get(employeesController.getAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee)

router.route("/:id")
  .get(employeesController.getEmployee);

module.exports = router;