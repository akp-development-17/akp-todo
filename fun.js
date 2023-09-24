
class Task {
    constructor(name, description, dueDate = null) {
        this.name = name;
        this.description = description;
        this.dueDate = dueDate;
        this.completed = false;
    }
}


const tasks = [];


const taskStates = [];
let statePointer = -1;
function viewTaskDetails(index) {
    const task = tasks[index];
    const modal = document.getElementById("taskDetailsModal");
    const modalContent = document.getElementById("taskDetails");
    
    modalContent.innerHTML = `
        <h3>${task.name}</h3>
        <p><strong>Description:</strong> ${task.description}</p>
        <p><strong>Due Date:</strong> ${task.dueDate || 'Not set'}</p>
        <p><strong>Status:</strong> ${task.completed ? 'Completed' : 'Pending'}</p>
    `;

    modal.style.display = "block";
}

function createTaskCard(task, index) {
    const taskList = document.getElementById("taskList");
    const taskCard = document.createElement("div");
    taskCard.className = `task-card ${task.completed ? 'completed' : ''}`;
    const randomColor = getRandomColor();
    taskCard.style.backgroundColor = randomColor;
    taskCard.innerHTML = `
        <div class = "box">
        <h3>${task.name}</h3>
        <p><strong>Description:</strong> ${task.description || 'None'}</p>
        <p><strong>Due Date:</strong> ${task.dueDate || 'Not set'}</p>
        <button class="view-btn" onclick="viewTaskDetails(${index})">&#x1F441</button>
        <button class="complete-btn" onclick="toggleCompleted(${index}, '${task.completed ? 'Undo' : '&check;'}')">${task.completed ? 'Undo' : '&check;'}</button>

        <button class="delete-btn" onclick="deleteTask(${index})">&#10006;</button>
        </div>
    `;
    taskList.appendChild(taskCard);
}


function getRandomColor() {
    const minValue = 200; // Minimum value for RGB components (light colors)
    const color = `rgb(${minValue + Math.floor(Math.random() * 56)}, ${minValue + Math.floor(Math.random() * 56)}, ${minValue + Math.floor(Math.random() * 56)})`;
    return color;
}

function updateTaskList() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        createTaskCard(task, index);
    });
}

function addTask() {
    const name = document.getElementById("taskName").value;
    const description = document.getElementById("taskDescription").value;
    const dueDate = document.getElementById("dueDate").value;

    if (name.trim() === ""){
        showToast("Please enter a task😅","error"); 
        return;
    }

    const task = new Task(name, description, dueDate);
    tasks.push(task);

    // Clear redo states
    taskStates.splice(statePointer + 1);

    // Update task states for undo/redo
    taskStates.push([...tasks]);
    statePointer++;

    document.getElementById("taskName").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("dueDate").value = "";

    updateTaskList();
    showToast("Task added successfully😄","success");
}

function toggleCompleted(index) {
    tasks[index].completed = !tasks[index].completed;

   
    taskStates.splice(statePointer + 1);
    taskStates.push([...tasks]);
    statePointer++;

    updateTaskList();
    if (action === 'Undo') {
        showToast("Task undone successfully!👍", "info");
    } else {
        showToast("Task completed successfully!👍", "success");
    }
}

//  delete a task
function deleteTask(index) {
    tasks.splice(index, 1);

    // Clear redo states
    taskStates.splice(statePointer + 1);

    // Update task states for undo/redo
    taskStates.push([...tasks]);
    statePointer++;

    updateTaskList();
    showToast("Task deleted successfully!⚡","success");
}

// Function to filter tasks based on completion status
function filterTasks() {
    const currentFilter = document.getElementById("taskFilter").value;

    if (currentFilter === "all") {
        updateTaskList();
    } else {
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === "completed") {
                return task.completed;
            } else if (currentFilter === "pending") {
                return !task.completed;
            }
        });

        const taskList = document.getElementById("taskList");
        taskList.innerHTML = "";

        filteredTasks.forEach((task, index) => {
            createTaskCard(task, index);
        });
    }
}

// Function to undo the last action
function undo() {
    if (statePointer > 0) {
        statePointer--;
        tasks.length = 0;
        tasks.push(...taskStates[statePointer]);
        updateTaskList();
        showToast("Undo successful!","info")
    }
    else{
        showToast("Nothing to undo😶","no")
    }
}

// Function to redo the last undone action
function redo() {
    if (statePointer < taskStates.length - 1) {
        statePointer++;
        tasks.length = 0;
        tasks.push(...taskStates[statePointer]);
        updateTaskList();
        showToast("Redo successful!","info");
    }
    else{
        showToast("Nothing to redo😶","no")
    }
}
// Function to display a toast notification
function showToast(message, type) {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }, 100);
}

// Event listeners
document.getElementById("addTaskBtn").addEventListener("click", addTask);
document.getElementById("undoBtn").addEventListener("click", undo);
document.getElementById("redoBtn").addEventListener("click", redo);
document.getElementById("taskFilter").addEventListener("change", filterTasks);

document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("taskDetailsModal").style.display = "none";
});

updateTaskList();
