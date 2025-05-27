let tasks = [];

document.getElementById('addTaskBtn').addEventListener('click', () => {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const priority = document.getElementById('taskPriority').value;
    const category = document.getElementById('taskCategory').value;
    const dueDate = document.getElementById('taskDate').value;

    if (!title || !dueDate) {
        alert("Please fill in the title and due date.");
        return;
    }

    tasks.push({
        title,
        description,
        priority,
        category,
        dueDate,
        done: false
    });

    renderTasks();
    clearForm();
});

function clearForm() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskPriority').value = 'Low';
    document.getElementById('taskCategory').value = 'health';
    document.getElementById('taskDate').value = '';
}

function renderTasks(filter = "all") {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const now = new Date();

    tasks.forEach((task, index) => {
        const taskDate = new Date(task.dueDate);
        let show = true;

        if (filter === 'day') {
            show = taskDate.toDateString() === now.toDateString();
        } else if (filter === 'week') {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            show = taskDate >= weekStart && taskDate <= weekEnd;
        } else if (filter === 'month') {
            show = taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
        } else if (filter === 'year') {
            show = taskDate.getFullYear() === now.getFullYear();
        }

        if (filter !== "all" && !show) return;

        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.done) li.classList.add('done');

        li.innerHTML = `
            <strong>${task.title}</strong>
            <div>${task.description}</div>
            <div class="meta">Priority: ${task.priority} | Category: ${task.category} | Due: ${task.dueDate}</div>
            <div class="actions">
                <button onclick="markDone(${index})">Mark as Done</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function markDone(index) {
    tasks[index].done = !tasks[index].done;
    renderTasks(currentFilter);
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks(currentFilter);
}

let currentFilter = "all";
document.querySelectorAll('.filters button').forEach(button => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.view;
        renderTasks(currentFilter);
    });
});

// Display current date
document.getElementById("currentDate").textContent = new Date().toDateString();

// Initial render
renderTasks();

