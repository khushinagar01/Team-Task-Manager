const Task = require("../models/Task");

async function checkOwnership(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (req.user.role === "admin" || req.user.role === "manager") return next();
    if (task.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your task" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = checkOwnership;