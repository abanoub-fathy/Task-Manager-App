require('../src/db/mongoose')
const Task = require('../src/models/task');

Task.findByIdAndUpdate("6169f56c976ecef013c6a344", {
    completed: false
}).then(task => {
    console.log(task)
    return Task.find({completed: true})
}).then(taskArr => {
    console.log(taskArr.length);
}).catch(e => {
    console.log(e);
})