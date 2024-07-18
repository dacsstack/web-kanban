export default class Kanban {
    //Get Task
    static getTasks(columnId) {
        const data = read().find(column => {
            return column.columnId == columnId;
        });
        return data.tasks;
    }

    //Insert
    static insertTask(columnId, content){
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

    //UPDATE COLUMN AND DATA 
    static updateTask(taskId, updatedInformation) {
        //Reference the data
        const data = read();

        //Get Current column or Information
        function findColumnTask() {
            for (const column of data) {

                //find task
                const task = column.tasks.find(item => {
                    return item.taskId == taskId;
                });

                //Return the information
                if (task) {
                    return [task, column];
                }
            }
            //Turn it to function intead
            /* for (const column of data) {
                //find task
                const task = column.tasks.find(item => {
                    return item.taskId == taskId;
                });
                if (task) {
                    console.log(column, task);
                }
     */
            //=======End of Current Column================
        }
        //print element
        //console.log(findColumnTask());

        //Print endividual one task OR Reference the task
        const [task, currentColumn] = findColumnTask();
        //console.log(task); //print sample

        //Find new targeted column
        const targetColumn = data.find(column => {
            return column.columnId == updatedInformation.columnId;
        });

        //update task content
        task.content = updatedInformation.content;

        //detelete current column
        currentColumn.tasks.splice(currentColumn.tasks.indexOf(task), 1);

        //if find the targeted column Push/ Add
        targetColumn.tasks.push(task);

        //save the data
        save(data);
    }

    //Delete
    static deleteTask(taskId) {
        const data = read();

        for (const column of data) {//find all column
            const task = column.tasks.find(item => { //find all task item
                return item.taskId == taskId; // return
            });

            //put if condition if you want delete only a specific task
            if (task) {
                column.tasks.splice(column.tasks.indexOf(task), 1);
            }

            //Remove Elements from an array 
            //column.tasks.splice(column.tasks.indexOf(task), 1);
        }
        //save to local storage
        save(data);
    }

    static getAllTasks() {
        //Call Read function
        const data = read();
        //Add ColumnCount
        columnCount();
        //return data; //Object format
        return [data[0].tasks, data[1].tasks, data[2].tasks]; // Array Proper format

    }
}

function read() {
    //first Capture the data on local storage
    const data = localStorage.getItem("data");

    //If empty on local storage
    //JavaScript Format no need to JSON.parse 
    if (!data) {
        return [
            { colomnId: 0, tasks: [] },
            { colomnId: 1, tasks: [] },
            { colomnId: 2, tasks: [] }
        ];
    }
    //return it
    return JSON.parse(data);

}

function save(data) {
    localStorage.setItem("data", JSON.stringify(data));

    //Add Column Count function
    columnCount();
}

function columnCount() {
    const data = read();

    const todo = document.querySelector("span.todo");
    todo.textContent = data[0].tasks.length;

    const pending = document.querySelector("span.pending");
    pending.textContent = data[1].tasks.length;

    const completed = document.querySelector("span.completed");
    completed.textContent = data[2].tasks.length;
}
