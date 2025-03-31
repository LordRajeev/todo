// Wait for the DOM to load before executing scripts
document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    loadTasks();
    loadBucketItems();
    setupEventListeners();
}

// Set up event listeners for buttons and actions
function setupEventListeners() {
    document.getElementById("themeButton").addEventListener("click", toggleTheme);

    // Add event listeners for the choice buttons
    document.querySelector(".choice-btn[onclick=\"showSection('todo')\"]").addEventListener("click", () => showSection('todo'));
    document.querySelector(".choice-btn[onclick=\"showSection('bucket')\"]").addEventListener("click", () => showSection('bucket'));

    // Add event listeners for the back buttons
    document.querySelectorAll(".back-btn").forEach(button => {
        button.addEventListener("click", goBack);
    });

    // Add event listeners for the "Add" buttons
    document.getElementById("addTaskButton").addEventListener("click", addTask);
    document.getElementById("addBucketButton").addEventListener("click", addBucketItem);
}

// Show a specific section and hide others
function showSection(section) {
    // Hide all sections
    document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
    // Show the selected section
    document.getElementById(`${section}-section`).classList.remove("hidden");
}

// Go back to the welcome section
function goBack() {
    // Hide all sections
    document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
    // Show the welcome section
    document.getElementById("welcome-section").classList.remove("hidden");
}

// Add a new task to the task list
function addTask() {
    const taskInput = document.getElementById("taskInput").value.trim();
    const taskDeadline = document.getElementById("taskDeadline").value;

    if (!taskInput) {
        alert("Please enter a task!");
        return;
    }

    const taskList = document.getElementById("taskList");
    const li = createListItem(taskInput, taskDeadline || "No deadline", removeTask);
    taskList.appendChild(li);

    saveTasks();
    clearInput("taskInput");
    clearInput("taskDeadline");
}

// Remove a task from the task list
function removeTask(li) {
    if (confirm("Are you sure you want to delete this task?")) {
        li.remove();
        saveTasks();
    }
}

// Add a new item to the bucket list
function addBucketItem() {
    const bucketInput = document.getElementById("bucketInput").value.trim();

    if (!bucketInput) {
        alert("Please enter a bucket list item!");
        return;
    }

    const bucketList = document.getElementById("bucketList");
    const li = createListItem(bucketInput, null, removeBucketItem);
    bucketList.appendChild(li);

    saveBucketItems();
    clearInput("bucketInput");
}

// Remove an item from the bucket list
function removeBucketItem(li) {
    if (confirm("Are you sure you want to delete this bucket list item?")) {
        li.remove();
        saveBucketItems();
    }
}

// Toggle between light and dark themes
function toggleTheme() {
    document.body.classList.toggle("light-mode");
}

// Create a reusable list item with a delete button
function createListItem(content, extraInfo, deleteCallback) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span><strong>${content}</strong>${extraInfo ? ` | ⏳ ${extraInfo}` : ""}</span>
        <button class="delete-btn">🗑</button>
    `;
    li.querySelector(".delete-btn").addEventListener("click", () => deleteCallback(li));
    return li;
}

// Clear input field by ID
function clearInput(inputId) {
    document.getElementById(inputId).value = "";
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = Array.from(document.querySelectorAll("#taskList li")).map(li => ({
        content: li.querySelector("span").innerText,
        deadline: li.dataset.deadline || null,
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskList = document.getElementById("taskList");
    tasks.forEach(task => {
        const li = createListItem(task.content, task.deadline, removeTask);
        taskList.appendChild(li);
    });
    console.log("Tasks loaded.");
}

// Save bucket items to localStorage
function saveBucketItems() {
    const bucketItems = Array.from(document.querySelectorAll("#bucketList li")).map(li => ({
        content: li.querySelector("span").innerText,
    }));
    localStorage.setItem("bucketItems", JSON.stringify(bucketItems));
}

// Load bucket items from localStorage
function loadBucketItems() {
    const bucketItems = JSON.parse(localStorage.getItem("bucketItems")) || [];
    const bucketList = document.getElementById("bucketList");
    bucketItems.forEach(item => {
        const li = createListItem(item.content, null, removeBucketItem);
        bucketList.appendChild(li);
    });
    console.log("Bucket items loaded.");
}