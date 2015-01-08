
/*******************************************************************************
  Schema - Todo
  {
    _id       : String
    ownerId   : String
    title     : String
    isDone    : Boolean
    createdAt : Number
    updatedAt : Number
  }
*******************************************************************************/

Todos = new Mongo.Collection('todos');

// Todos.helpers({

//   owner: function() {
//     return findUser(this.ownerId);
//   },

//   tags: function() {
//     return userTodoTags(this.ownerId, this._id);
//   },

//   removeTags: function(tags) {
//     //TODO: optionally accept tags or tagIds
//     tags.forEach(function(tag, index) {
//       tag.removeTodoIds(this._id);
//     });
//   },

//   addTags: function(tags) {
//     tags.forEach(function(tag, index) {
//       Tags.upsert(tag._id, { $set: tag, $push: { todoIds: this._id } });
//     });
//   }

// });

insertTodo = function(todo) {
  todo.createdAt = todo.createdAt || (new Date()).getTime();
  todo.isDone    = todo.isDone    || false;
  if(todo.index === undefined || todo.index === null) // index might be 0
    todo.index = 0;
  Todos.insert(todo);
};

Meteor.methods({

  insertTodoAtFirstIndex: function(todo) {
    Todos.update({}, { $inc: { index: 1 } }, { multi: true }, function() {
      todo.index = 0;
      insertTodo(todo);
    });
  }

});

updateTodo = function(_id, modifier, callback) {
  var keys = _.keys(modifier);
  if(!_.every(keys, isFirstChar('$'))) modifier = { $set: modifier };
  if(!modifier.$set) modifier.$set = { updatedAt: (new Date()).getTime() };
  else modifier.$set.updatedAt = (new Date()).getTime();
  Todos.update(_id, modifier, callback);
};

setTodo = function(_id, newValues, callback) {
  newValues.updatedAt = (new Date()).getTime();
  Todos.update(_id, { $set: newValues }, callback);
};

removeTodo = function(_id) {
  Todos.remove(_id);
};

findTodo = function(_id) {
  return Todos.findOne(_id);
};

findTodos = function(ids) {
  if(!ids) return;
  return Todos.find({ _id: { $in: ids } });
};

// findTodos = function(selector, options) {
//   selector = selector || {};
//   options  = options  || {};
//   return Todos.find(selector, options);
// };

allTodos = function() {
  return Todos.find();
};

userTodos = function(uid) {
  return Todos.find({ ownerId: uid });
};

doneUserTodos = function(uid) {
  return Todos.find({ ownerId: uid, isDone: true });
};

userTodosByIndex = function(uid) {
  return Todos.find({ ownerId: uid }, { sort: [[ 'index', 'asc' ]] });
};

userTodosByIndexByNotDone = function(uid) {
  return Todos.find({ ownerId: uid, isDone: true }, {
    sort: [
      ['isDone', 'desc'],
      ['index', 'asc']
    ]
  });
};

userTodosByIndexBy = function(uid, sortBy, sortOrder) {
  return Todos.find({ ownerId: uid }, {
    sort: [
      [sortBy, sortOrder],
      ['index', 'asc']
    ]
  });
};

userTodosByNewest = function(uid) {
  return Todos.find({ ownerId: uid }, { sort: { createdAt: 'desc' } });
};

doneUserTodosByNewest = function(uid) {
  return Todos.find({ ownerId: uid, isDone: true }, { sort: { createdAt: 'desc' } });
};

userTodosByNewestByNotDone = function(uid) {
  return Todos.find({ ownerId: uid, isDone: true }, {
    sort: [
      ['isDone', 'desc'],
      ['createdAt', 'desc']
    ]
  });
};

userTodosByNewestBy = function(uid, sortBy, orderBy) {
  return Todos.find({ ownerId: uid }, {
    sort: [
      [sortBy, orderBy],
      ['createdAt', 'desc']
    ]
  });
};
