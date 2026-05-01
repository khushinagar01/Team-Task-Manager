const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Task = require("./models/Task");
const Project = require("./models/Project");
const User = require("./models/user");

const app = express();

app.use(cors());
app.use(express.json());
console.log("SERVER STARTING...");
// DB CONNECT
console.log("Mongo URL:", process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL)

const SECRET = "teamtask_secret_key";

// ---------------- AUTH MIDDLEWARE ----------------
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided ❌" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token ❌" });
  }
}

// ---------------- MANAGER ONLY MIDDLEWARE ----------------
// Blocks access if the logged-in user is not a manager
function managerOnly(req, res, next) {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Access denied ❌ Only managers can perform this action." });
  }
  next();
}

// ---------------- SIGNUP ----------------
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists ❌" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Only allow "manager" or "member"; default to "member" if not provided or invalid
    const assignedRole = role === "manager" ? "manager" : "member";

    const user = new User({ name, email, password: hashedPassword, role: assignedRole });
    await user.save();

    res.json({ message: "User created ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- LOGIN ----------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found ❌" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password ❌" });

    // Include role and name in the JWT token so middleware can check it
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      role: user.role,     // send role to frontend so UI can adapt
      name: user.name,
      email: user.email
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- CREATE PROJECT (MANAGER ONLY) ----------------
app.post("/project", auth, managerOnly, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json({ message: "Project created ✅", projectId: project._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- GET ALL PROJECTS ----------------
app.get("/projects", auth, async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- CREATE TASK (MANAGER ONLY) ----------------
app.post("/task", auth, managerOnly, async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json({ message: "Task created ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- GET TASKS ----------------
// Managers see ALL tasks for a project.
// Members see ONLY tasks assigned to them.
app.get("/tasks/:projectId", auth, async (req, res) => {
  try {
    let query = { projectId: req.params.projectId };

    if (req.user.role === "member") {
      // Members can only see tasks assigned to them (matched by email)
      query.assignedTo = req.user.email;
    }

    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- UPDATE TASK STATUS ----------------
// Members can ONLY update the status of tasks assigned to them.
// Managers can update any field of any task.
app.put("/task/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found ❌" });

    if (req.user.role === "member") {
      // Verify this task is actually assigned to this member
      if (task.assignedTo !== req.user.email) {
        return res.status(403).json({ message: "Access denied ❌ You can only update tasks assigned to you." });
      }
      // Members can only change the status field — strip everything else
      await Task.findByIdAndUpdate(req.params.id, { status: req.body.status });

      // If the member just marked it Done, send back a congratulations flag
      if (req.body.status === "Done") {
        return res.json({
          message: "Task updated ✅",
          taskCompleted: true,
          memberName: req.user.name,
          taskTitle: task.title
        });
      }
    } else {
      // Managers can update any field
      await Task.findByIdAndUpdate(req.params.id, req.body);
    }

    res.json({ message: "Task updated ✅", taskCompleted: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});