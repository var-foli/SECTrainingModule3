const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {this.employees = data}
}

const getAllEmployees = (req, res) => {
  res.json(data.employees);
}

const createNewEmployee = (req, res) => {
  const newEmployee = {
    //creating a new id using the last employee in json and adding 1 to it
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }

  //making sure a first and last name are sent
  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res.status(400).json({ "message": "First and last names are required."});
  }

  //setting the employees to new info
  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
}

const updateEmployee = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
  if (!employee) {
    return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
  }
  //setting employee to new parameter values
  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;
  //removing existing employee record for employee
  const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
  //unsorted bc in chronological order by id
  const unsortedArray = [...filteredArray, employee];
  //sort array by id column
  data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
  //puts json array back in order
  res.json(data.employees);
}

const deleteEmployee = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
  if (!employee) {
    return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
  }
  const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
  data.setEmployees([...filteredArray]);
  res.json(data.employees);
}

const getEmployee = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
  if (!employee) {
    return res.status(400).json({"message": `Employee ID ${req.params.id} not found`});
  }
  res.json(employee);
}

module.exports = {
  getAllEmployees, 
  createNewEmployee, 
  updateEmployee, 
  deleteEmployee, 
  getEmployee
}