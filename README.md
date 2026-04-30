 🚀 Team Task Manager (Full Stack Project)

 Overview
 
 A full-stack Team Task Management System built using Node.js, Express, MongoDB, and JavaScript. It allows users to register, login, create projects, assign tasks, and track task progress with a clean and responsive dashboard.

 Problem Statement
 
 Managing team tasks manually leads to confusion, missed deadlines, and poor tracking. This platform solves that by providing a centralized system to create projects, assign tasks, and monitor progress in real time.

 ✨ Features

👤 User Authentication (Signup/Login)
🔐 Secure password hashing (bcrypt)
🪪 JWT-based login system
📁 Project creation & management
📝 Task creation under projects
👥 Task assignment to users
📊 Task status tracking (Pending → Done)
🎨 Clean UI with Tailwind CSS
🌙 Dark / Light mode support
⚠️ Form validation & error handling

🧠 Approach / Design

Backend: Node.js + Express handles APIs and business logic
Database: MongoDB stores users, projects, and tasks
Authentication: JWT tokens for secure login sessions
Password Security: bcryptjs for hashing passwords
Frontend: HTML, Tailwind CSS, JavaScript (Fetch API)
State Flow: User → Project → Task → Status Update

🛠️ Tech Stack

Frontend

HTML5
Tailwind CSS (CDN)
JavaScript (Fetch API)

Backend

Node.js
Express.js
MongoDB Atlas
Mongoose

Security

bcryptjs
JSON Web Token (JWT)

⚙️ How to Run

1️⃣ Clone Repository
git clone https://github.com/khushinagar01/Team-Task-Manager.git

2️⃣ Backend Setup
cd backend
npm install
node index.js
Server runs at:
http://localhost:5000

3️⃣ Frontend Setup
Open frontend/index.html in browser
OR
Use VS Code Live Server

📡 API Endpoints

🔐 Auth
POST /signup → Create user
POST /login → Login user (returns JWT)

📁 Project
POST /project → Create project

📝 Task
POST /task → Create task
GET /tasks/:projectId → Get tasks
PUT /task/:id → Update task status

🎨 UI Highlights

📱 Responsive dashboard layout
🌙 Dark / Light mode toggle
🧩 Card-based clean UI
⚠️ Inline validation messages
🔄 Real-time task updates

Screenshots

<img width="1895" height="821" alt="Screenshot 2026-05-01 015006" src="https://github.com/user-attachments/assets/d7cf19f6-9b06-4661-b84d-87c4eb717378" />
<img width="1904" height="884" alt="Screenshot 2026-05-01 014940" src="https://github.com/user-attachments/assets/c709ad56-b65c-4fc6-af1e-5ada113a537d" />
<img width="1844" height="861" alt="Screenshot 2026-05-01 014950" src="https://github.com/user-attachments/assets/1a0ee70d-e304-497d-b1f7-1c6087128978" />



