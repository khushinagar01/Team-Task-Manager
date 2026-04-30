const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Task = require("./models/Task");
const Project = require("./models/Project");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

// DB CONNECT
mongoose.connect("mongodb+srv://khushinagar112003_db_user:Khushi11@cluster0.nxky1at.mongodb.net/teamtaskdb?retryWrites=true&w=majority")
.then(() => console.log("Database Connected ✅"))
.catch(err => console.log(err));

// JWT SECRET (IMPORTANT FIX)
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

// ---------------- SIGNUP ----------------
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists ❌" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
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

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful ✅",
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- PROJECT (PROTECTED) ----------------
app.post("/project", auth, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json({ message: "Project created ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- TASK (PROTECTED) ----------------
app.post("/task", auth, async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json({ message: "Task created ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- GET TASKS ----------------
app.get("/tasks/:projectId", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- UPDATE TASK ----------------
app.put("/task/:id", auth, async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Task updated ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ---------------- START SERVER ----------------
app.listen(5000, () => {
  console.log("Server started on port 5000 🚀");
});