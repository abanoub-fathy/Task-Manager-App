require('../src/db/mongoose')
const Task = require('../src/models/task')
const User = require('../src/models/user')

// define function update and count
const updateAgeAndCount = async (id, age) => {
  await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age })
  return count;
}

updateAgeAndCount('616584e1a91f04f50f6287a3', 14).then(count => {
  console.log(count);
}).catch(e => {
  console.log(e);
})

// define function that delete by id and returns the number of incomplete tasks
const deleteByIdAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);

  if(!task) {
    throw new Error("no task with this id: " + id);
  }

  const count = await Task.countDocuments( {completed: false} );
  return count;
}

deleteByIdAndCount('6169f56c976ecef013c6a344').then(c => {
  console.log(`The numbers of incompleted tasks: ${c}`);
}).catch(e => {
  console.log(e);
})