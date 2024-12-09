const mongoose = require("mongoose");

const overviewSchema = new mongoose.Schema({
  employeeID: String,
  department: String,
  currentOfficeLocation: String,
  officeMobileNumber: String,
  emergencyContactName: String,
  emergencyContactNumber: String,
  hod: String,
  dateOfJoining: String,
  bloodGroup: String,
  company: String,
  businessUnit: String,
  employeeType: String,
  assignedPermission: String,
  hrbpRole: String,
  departmentCostCenterName: String,
  departmentCostCenterID: String,
});

const biographicalSchema = new mongoose.Schema({
  salutation: String,
  firstName: String,
  middleName: String,
  lastName: String,
  gender: String,
  dateOfBirth: String,
});

const contactSchema = new mongoose.Schema({
  personalEmailID: String,
  personalMobileNo: String,
});

const workflowSchema = new mongoose.Schema({
  groupCompany: String,
  designation: String,
  department: String,
  band: String,
  bandCode: String,
  grade: String,
  gradeCode: String,
  fromTo: String,
});

const locationSchema = new mongoose.Schema({
  country: String,
  state: String,
  city: String,
  fromTo: String,
});

const managerSchema = new mongoose.Schema({
  managerName: String,
  fromTo: String,
});

const employeeTypeSchema = new mongoose.Schema({
  employeeType: String,
  employeeSubType: String,
  fromTo: String,
});

const employeeSchema = new mongoose.Schema({
  overview: overviewSchema,
  biographical: biographicalSchema,
  contact: contactSchema,
  workflow: [workflowSchema],
  officeLocation: [locationSchema],
  manager: [managerSchema],
  employeeType: [employeeTypeSchema],
  emp_id: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("Employee", employeeSchema);
