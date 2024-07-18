export default class Kanban {

    //Get The Data
    static getTasks(columnId) {
        const data = read().find(column => {
            return column.columnId == columnId;
        });

        return data.tasks;
    }

    //Insert Data
    static insertTask(columnId, content) {
        const data = read();
        const column = data.find(column => {
            return column.columnId == columnId;
        });
        const task = {
            taskId: Math.floor(Math.random() * 100000),
            content: content
        };

        column.tasks.push(task);
        console.log(data);
        save(data); // Calling Save Data Function

        return task;
    }

    //Update Data
    static updateTask(taskId, updatedInformation) {
        const data = read();

        function findColumnTask() {
            for (const column of data) {
                const task = column.tasks.find(item => {
                    return item.taskId == taskId;
                });

                if (task) {
                    return [task, column];
                }
            }
        }

        //Current Task and Column 
        const [task, currentColumn] = findColumnTask(); //Calling FindColumnTask function

        //Target Information
        const targetColumn = data.find(column => {
            return column.columnId == updatedInformation.columnId;
        });

        //updated current task
        task.content = updatedInformation.content;
        //Remove current task from current column
        currentColumn.tasks.splice(currentColumn.tasks.indexOf(task), 1);
        //Add to New Column
        targetColumn.tasks.push(task);

        save(data); // Calling Save Data Function
    }

    //Delete Data
    static deleteTask(taskId) {
        const data = read();

        for (const column of data) {
            const task = column.tasks.find(item => {
                return item.taskId == taskId;
            });

            if (task) {
                column.tasks.splice(column.tasks.indexOf(task), 1);
            }
        }

        save(data); // Calling Save Data Function
    }

    static getAllTasks() {
        const data = read();
        columnCount();
        return [data[0].tasks, data[1].tasks, data[2].tasks];
    }
}

//FUNCTION READ TO LOCAL STORAGE
function read() {
    const data = localStorage.getItem("data");

    //If Empty
    if (!data) {
        return [
            { columnId: 0, tasks: [] },
            { columnId: 1, tasks: [] },
            { columnId: 2, tasks: [] }
        ];
    }

    //In Not Empty
    return JSON.parse(data);
}

//FUNCTION SAVE TO LOCAL STORAGE
function save(data) {
    localStorage.setItem("data", JSON.stringify(data));
    columnCount();
}


//FUNCTION COLUMN TO LOCAL STORAGE
function columnCount() {
    const data = read();

    const todo = document.querySelector("span.todo");
    todo.textContent = data[0].tasks.length;

    const pending = document.querySelector("span.pending");
    pending.textContent = data[1].tasks.length;

    const completed = document.querySelector("span.completed");
    completed.textContent = data[2].tasks.length;
}


// console.log(Kanban.getAllTasks());
// console.log(Kanban.getTasks(1));


// console.log(Kanban.getTasks(1));
// console.log(Kanban.insertTask(0, "Record Kanban Lectures"));
// console.log(Kanban.getTasks(1));


// console.log(Kanban.getAllTasks());
// Kanban.deleteTask(11822);
// console.log(Kanban.getAllTasks());


// console.log(Kanban.getAllTasks());
// Kanban.updateTask(97522, {
//     columnId: 2,
//     content: "Record JavaScript Preview"
// });
// console.log(Kanban.getAllTasks());