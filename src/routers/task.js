const express = require('express');
const Task = require('../models/task');
const { isValidObjectId } = require('mongoose');
const auth = require('../middleware/auth');


const router = new express.Router();

// create new task
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
      ...req.body,
      owner: req.user._id
  });
  
  try {
      await task.save();
      res.status(201).send(task);
  } catch(e) {
      res.status(400).send(e);
  }
      
})

// read all tasks
// GET /tasks
// GET /tasks?completed=true   --> Filtering
// GET /tasks?limit=2&skip=0   --> pagination
// GET /tasks?sortBy=createdAt:asc || createdAt:desc
router.get('/tasks', auth, async (req, res) => {

    // configure match object that will be responsible for filtering the data
    const match = {};

    // filtering by completed value
    if(req.query.completed === 'true' || req.query.completed === 'false') {
        match.completed = req.query.completed === 'true';
    }

    // configure sort object that will be responsible for sorting data
    const sort = {};
    let sortCriteria,
        order;

    // GET /tasks?sortBy=createdAt:asc || createdAt:desc
    if(req.query.sortBy && req.query.sortBy.includes(':')) {
        // get the first part
        sortCriteria = req.query.sortBy.slice(0, req.query.sortBy.indexOf(':'))

        // get the second part
        order = req.query.sortBy.slice(req.query.sortBy.indexOf(':') + 1)

        sort[sortCriteria] = order === 'desc' ?  -1 : 1;   
    }

    try {
        // populate the user tasks
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });

        // send the poulated tasks
        res.send(req.user.tasks);
    } catch(e) {
        res.status(500).send();
    }
})


// Find [read] a task by its id
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  if(!isValidObjectId(_id)) { // not valid id
      return res.status(400).send("The request is bad")
  }

  try {
    const task = await Task.findOne({_id, owner: req.user._id});

    if(!task) {
        // no task with this id null value
        res.status(404).send("No task with this id")
    }

    res.send(task)
  } catch(e) {
    res.status(500).send();
  }
})

// update task
router.patch('/tasks/:id', auth, async (req, res) => {
  // validate updates
  const validUpdates = ['description', 'completed'];
  const updates = Object.keys(req.body);

  const isValidOperation = updates.every(update => {
      return validUpdates.includes(update)
  })

  if(!isValidOperation) {
      res.status(400).send( {errors: "Invalid Updates!!"} )
  }

  try {
     // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

      // find the task
      const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

      // no task with this id
      if(!task) {
          res.status(404).send("no task with this id")
      }

      // update the task
      updates.forEach((update) => {
          task[update] = req.body[update];
      })

      // save the task to the database
      await task.save();

      // there is a task to send
      res.send(task)
  } catch(e) {
      // maybe validation error
      res.status(400).send()
  }
})

// Delete task route handler
router.delete('/tasks/:id', auth, async (req, res) => {

  // get the id
  const _id = req.params.id;

  if(!isValidObjectId(_id)) {
      res.status(400).send({ Error: "Invalid Id was sent!!!" })
  }

  try {
      const task = await Task.findOneAndDelete({ _id, owner:req.user._id });

      // no task with id
      if(!task) {
          res.status(404).send({ Error: "No task is found!!" })
      }

      // sending the task that is deleted
      res.send(task)
  } catch(e) {
      res.status(500).send()
  }
})

module.exports = router;