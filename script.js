document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskDueDateInput = document.getElementById('task-due-date');
    const addTaskBtn = document.getElementById('add-task-btn');
    const todoList = document.getElementById('todo-list');

    // Initialize Flatpickr and store the instance
    const flatpickrInstance = flatpickr(taskDueDateInput, {
        dateFormat: "Y-m-d",
        altInput: true, // Human-friendly date format
        altFormat: "F j, Y", // How it will be displayed to the user
        allowInput: true, // Allow manual typing of date
    });

    // Load tasks from local storage
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        // Get the date from Flatpickr instance, not directly from taskDueDateInput.value
        // as it might be in the altFormat. We need the YYYY-MM-DD format.
        const selectedDates = flatpickrInstance.selectedDates;
        const taskDueDate = selectedDates.length > 0 ? flatpickr.formatDate(selectedDates[0], "Y-m-d") : "";


        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        const task = {
            id: Date.now(), // Unique ID for each task
            text: taskText,
            dueDate: taskDueDate,
            completed: false
        };

        createTaskElement(task);
        saveTask(task);

        taskInput.value = '';
        flatpickrInstance.clear(); // Use Flatpickr's clear method
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        if (task.completed) {
            li.classList.add('completed');
        }

        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = task.text + (task.dueDate ? ` (Due: ${formatDate(task.dueDate)})` : '');
        li.appendChild(taskTextSpan);

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('task-actions');

        const completeBtn = document.createElement('button');
        completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
        completeBtn.classList.add('complete-btn');
        completeBtn.addEventListener('click', () => toggleComplete(task.id));
        actionsDiv.appendChild(completeBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(actionsDiv);
        todoList.appendChild(li);
    }

    function toggleComplete(taskId) {
        const tasks = getTasks();
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    }

    function deleteTask(taskId) {
        const taskElement = document.querySelector(`li[data-id='${taskId}']`);
        if (taskElement) {
            taskElement.classList.add('removing'); // Add class for animation
            // Wait for animation to complete before removing from DOM and localStorage
            taskElement.addEventListener('animationend', () => {
                let tasks = getTasks();
                tasks = tasks.filter(t => t.id !== taskId);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks(); // Re-render to ensure DOM is clean
            });
        } else { // Fallback if element not found immediately (should not happen often)
            let tasks = getTasks();
            tasks = tasks.filter(t => t.id !== taskId);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    }

    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function loadTasks() {
        renderTasks();
    }

    function renderTasks() {
        todoList.innerHTML = ''; // Clear existing tasks
        const tasks = getTasks();
        tasks.forEach(task => createTaskElement(task));
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Adjust for timezone offset to display the selected date correctly
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
        return adjustedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
});
