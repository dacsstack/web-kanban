import Kanban from "./kanban.js";

const todo = document.querySelector(".cards.todo");
const pending = document.querySelector(".cards.pending");
const completed = document.querySelector(".cards.completed");
//reference for each task
const taskbox = [todo, pending, completed];

//task card function to add Card
function addTaskCard(task, index) {
    const element = document.createElement("form");
    element.className = "card";
    element.draggable = true;
    element.dataset.id = task.taskId;

    element.innerHTML = `
        <input value="${task.content}" type="text" name="task" autocomplete="off" disabled="disabled">
        <div>
            <span class="task-id">#${task.taskId}</span>
            <span>
                <button class="bi bi-pencil edit" data-id="${task.taskId}"></button>
                <button class="bi bi-check-lg update hide" data-id="${task.taskId}" data-column="${index}"></button>
                <button class="bi bi-trash3 delete" data-id="${task.taskId}"></button>
            </span>
        </div>
    `;
    taskbox[index].appendChild(element);
}
Kanban.getAllTasks().forEach((tasks, index) => {
    tasks.forEach(task => {
        //Add task Card function
        addTaskCard(task, index);
    })
});

//Add Form Function
const addForm = document.querySelectorAll(".add"); 
addForm.forEach(form => {
    form.addEventListener("submit", event => {
        event.preventDefault(); 
        if (form.task.value) { 
            const task = Kanban.insertTask(form.submit.dataset.id, form.task.value.trim());
            addTaskCard(task, form.submit.dataset.id);
            form.reset();
        }
    })
});

//Edit Update
taskbox.forEach(column => {
    column.addEventListener("click", event => {
        event.preventDefault();

        const formInput = event.target.parentElement.parentElement.previousElementSibling;

        //Show Edit icon
        if (event.target.classList.contains("edit")) {
            formInput.removeAttribute("disabled");
            //hide edit buton
            event.target.classList.add("hide");
            //access update button
            event.target.nextElementSibling.classList.remove("hide");
        }

        //Show Update icon
        if (event.target.classList.contains("update")) {
            //disabled from input
            formInput.setAttribute("disabled", "disabled");
            //hide the current button
            event.target.classList.add("hide");
            //access update button
            event.target.previousElementSibling.classList.remove("hide");

            //const taskId = event.target.dataset.id; // for readability purpose
            const columnId = event.target.dataset.column;
            const content = formInput.value;
            Kanban.updateTask(event.target.dataset.id, { // Proper
                columnId: columnId,
                content: content
            });

        }

        if (event.target.classList.contains("delete")) {
            formInput.parentElement.remove(); // only removing one task or specific task
            Kanban.deleteTask(event.target.dataset.id);
        }

    });

    //Drag Start
    column.addEventListener("dragstart", event => {
        if (event.target.classList.contains("card"));
        //add dragging opacity
        event.target.classList.add("dragging");
    });

    //Drag Over
    column.addEventListener("dragover", event => {
        const card = document.querySelector(".dragging");
        column.appendChild(card);
    });

    //Drag End
    column.addEventListener("dragend", event => {
        if (event.target.classList.contains("card")) {
            //remove the dragging opacity
            event.target.classList.remove("dragging");

            const taskId = event.target.dataset.id;
            const columnId = event.target.parentElement.dataset.id;
            const content = event.target.task.value;

            //update on local storage
            Kanban.updateTask(taskId, { // Calling kanban update function
                columnId: columnId,
                content: content
            });
        }
    });
});
