const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  }
});

//mongoose will authomatically look for plural, lowercase version of model name (employee)
module.exports = mongoose.model("Employee", employeeSchema);