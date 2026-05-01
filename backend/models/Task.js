const mongoose = require("mongoose");
 
const taskSchema = new mongoose.Schema({
  title: String,
  assignedTo: String,   // stores email or name of assigned member
  status: {
    type: String,
    default: "To Do"
  },
  projectId: String
});
 
module.exports = mongoose.model("Task", taskSchema);