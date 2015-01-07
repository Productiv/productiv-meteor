
/*******************************************************************************
  Schema - Todo
  {
    _id       : String
    ownerId   : String
    title     : String
    tagIds    : String[]
    isDone    : Boolean
    createdAt : Number
    updatedAt : Number
  }
*******************************************************************************/

Todos = new Mongo.Collection('todos');

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

})

updateTodo = function(_id, newValues, callback) {
  Todos.update(_id, { $set: newValues }, callback);
};

removeTodo = function(_id) {
  Todos.remove(_id);
};

todo = function(_id) {
  return Todos.findOne(_id);
};

todos = function(selector, options) {
  selector = selector || {};
  options  = options  || {};
  return Todos.find(selector, options);
};

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
