document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');

    const loadTasks = () => {
        taskList.innerHTML = '';
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToDOM(task));
    };

    const saveTasks = () => {
        const tasks = Array.from(document.querySelectorAll('.task-item')).map(item => ({
            title: item.querySelector('strong').textContent,
            description: item.querySelector('em').textContent,
            category: item.querySelector('small').textContent.replace('Category: ', ''),
            date: item.getAttribute('data-date'),
            priority: item.querySelector('.priority').textContent,
            status: item.getAttribute('data-status')
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const addTaskToDOM = ({ title, description, category, date, priority, status }) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        if (status === 'completed') taskItem.classList.add('completed');
        taskItem.setAttribute('data-status', status || 'pending');
        taskItem.setAttribute('data-date', date);

        taskItem.innerHTML = `
            <div>
                <strong>${title}</strong><br>
                <em>${description}</em><br>
                <small>Category: ${category}</small><br>
                <small>Due: ${date}</small><br>
                <span class="priority ${priority.toLowerCase()}">${priority}</span>
            </div>
            <div class="actions">
                <button class="done-btn">✔️</button>
                <button class="delete-btn">🗑️</button>
            </div>
        `;

        taskItem.querySelector('.done-btn').addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            taskItem.setAttribute(
                'data-status',
                taskItem.classList.contains('completed') ? 'completed' : 'pending'
            );
            saveTasks();
        });

        taskItem.querySelector('.delete-btn').addEventListener('click', () => {
            taskItem.remove();
            saveTasks();
        });

        taskList.appendChild(taskItem);
    };

    addTaskBtn.addEventListener('click', () => {
        const title = document.getElementById('taskName').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const category = document.getElementById('taskCategory').value.trim();
        const date = document.getElementById('taskDate').value;
        const priority = document.getElementById('taskPriority').value;

        if (!title || !date) {
            alert('Please enter at least a title and due date.');
            return;
        }

        const newTask = {
            title,
            description,
            category,
            date,
            priority,
            status: 'pending'
        };

        addTaskToDOM(newTask);
        saveTasks();

        document.getElementById('taskName').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskCategory').value = 'Health';
        document.getElementById('taskDate').value = '';
        document.getElementById('taskPriority').value = 'Medium';
    });

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            const tasks = document.querySelectorAll('#taskList .task-item');
            const today = new Date().toISOString().split('T')[0];

            tasks.forEach(task => {
                const taskDate = task.getAttribute('data-date');
                const status = task.getAttribute('data-status');
                let show = false;

                switch (filter) {
                    case 'all':
                        show = true;
                        break;
                    case 'today':
                        show = taskDate === today;
                        break;
                    case 'pending':
                        show = status === 'pending';
                        break;
                    case 'completed':
                        show = status === 'completed';
                        break;
                    case 'upcoming':
                        show = taskDate > today && status !== 'completed';
                        break;
                }

                task.style.display = show ? '' : 'none';
            });
        });
    });

    // Show current date in header
    const currentDate = new Date();
    document.getElementById('currentDate').textContent = currentDate.toDateString();

    // Load existing tasks
    loadTasks();
});
