// Student Task Manager - simple client-side app using localStorage
const USERS_KEY = "stm_users";
const SESSION_KEY = "stm_session";

let signupMode = false;

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function tasksKey(email) {
  return "stm_tasks_" + email;
}
function getTasks(email) {
  return JSON.parse(localStorage.getItem(tasksKey(email)) || "[]");
}
function saveTasks(email, tasks) {
  localStorage.setItem(tasksKey(email), JSON.stringify(tasks));
}

// ---------- Validation ----------
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------- Auth ----------
function signup(email, password) {
  email = email.trim().toLowerCase();
  if (!validEmail(email)) return { ok: false, msg: "Please enter a valid email." };
  if (password.length < 6) return { ok: false, msg: "Password must be at least 6 characters." };
  const users = getUsers();
  if (users[email]) return { ok: false, msg: "This email is already registered." };
  users[email] = { password: password };
  saveUsers(users);
  return { ok: true, msg: "Account created. Please login." };
}

function login(email, password) {
  email = email.trim().toLowerCase();
  if (!email || !password) return { ok: false, msg: "Email and password are required." };
  const users = getUsers();
  if (!users[email] || users[email].password !== password) {
    return { ok: false, msg: "Invalid email or password." };
  }
  localStorage.setItem(SESSION_KEY, email);
  return { ok: true, msg: "Login successful." };
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
}

function currentUser() {
  return localStorage.getItem(SESSION_KEY);
}

// ---------- Tasks ----------
function addTask(title) {
  const email = currentUser();
  title = title.trim();
  if (!title) return { ok: false, msg: "Task title cannot be empty." };
  const tasks = getTasks(email);
  tasks.push({ id: Date.now() + Math.random(), title: title, done: false });
  saveTasks(email, tasks);
  return { ok: true, msg: "" };
}

function deleteTask(id) {
  const email = currentUser();
  saveTasks(email, getTasks(email).filter(t => t.id !== id));
}

function toggleTask(id) {
  const email = currentUser();
  const tasks = getTasks(email);
  tasks.forEach(t => { if (t.id === id) t.done = !t.done; });
  saveTasks(email, tasks);
}

// ---------- UI ----------
const $ = id => document.getElementById(id);

function render() {
  const email = currentUser();
  $("auth").classList.toggle("hidden", !!email);
  $("tasks").classList.toggle("hidden", !email);
  if (!email) return;
  $("welcome").textContent = "Logged in as " + email;
  const list = $("task-list");
  list.innerHTML = "";
  getTasks(email).forEach(t => {
    const li = document.createElement("li");
    if (t.done) li.classList.add("done");
    const span = document.createElement("span");
    span.textContent = t.title;
    const actions = document.createElement("div");
    const doneBtn = document.createElement("button");
    doneBtn.textContent = t.done ? "Undo" : "Complete";
    doneBtn.className = "complete-btn";
    doneBtn.onclick = () => { toggleTask(t.id); render(); };
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete-btn secondary";
    delBtn.onclick = () => { deleteTask(t.id); render(); };
    actions.append(doneBtn, delBtn);
    li.append(span, actions);
    list.appendChild(li);
  });
}

function setMode(isSignup) {
  signupMode = isSignup;
  $("auth-title").textContent = isSignup ? "Sign Up" : "Login";
  $("auth-btn").textContent = isSignup ? "Sign Up" : "Login";
  $("switch-text").textContent = isSignup ? "Already have an account?" : "No account?";
  $("switch-link").textContent = isSignup ? "Login" : "Sign up";
  $("auth-msg").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
  $("switch-link").onclick = e => { e.preventDefault(); setMode(!signupMode); };
  $("auth-btn").onclick = () => {
    const email = $("email").value;
    const pass = $("password").value;
    const res = signupMode ? signup(email, pass) : login(email, pass);
    $("auth-msg").textContent = res.msg;
    if (res.ok && signupMode) setMode(false), ($("auth-msg").textContent = res.msg);
    if (res.ok && !signupMode) { $("password").value = ""; render(); }
  };
  $("add-btn").onclick = () => {
    const res = addTask($("task-input").value);
    $("task-msg").textContent = res.msg;
    if (res.ok) $("task-input").value = "";
    render();
  };
  $("logout-btn").onclick = () => { logout(); render(); };
  render();
});
