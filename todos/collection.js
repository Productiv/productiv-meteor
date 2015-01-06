
Todos = new Mongo.Collection('todos');

insertTodo = function(todo) {
  todo.createdAt = todo.createdAt || (new Date()).getTime();
  todo.isDone    = todo.isDone    || false;
  if(todo.index === undefined || todo.index === null) todo.index = Infinity;
  Todos.insert(todo, function() {
    console.log('done!');
  });
};

Meteor.methods({

  insertTodoAtFirstIndex: function(todo) {
    console.log('updating other todos...')
    Todos.update({}, { $inc: { index: 1 } }, { multi: true }, function() {
      console.log('done! inserting...')
      todo.index = 0;
      insertTodo(todo);
    });
  }

})

updateTodo = function(_id, newValues) {
  Todos.update(_id, { $set: newValues });
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
  return Todos.find({ uid: uid });
};

doneUserTodos = function(uid) {
  return Todos.find({ uid: uid, isDone: true });
};

userTodosByIndex = function(uid) {
  return Todos.find({ uid: uid }, { sort: { index: 'asc' } });
};

userTodosByIndexByNotDone = function(uid) {
  return Todos.find({ uid: uid, isDone: true }, {
    sort: [
      ['isDone', 'desc'],
      ['index', 'asc']
    ]
  });
};

userTodosByIndexBy = function(uid, sortBy, orderBy) {
  return Todos.find({ uid: Meteor.userId() }, {
    sort: [
      [sortBy, orderBy],
      ['index', 'asc']
    ]
  });
};

userTodosByNewest = function(uid) {
  return Todos.find({ uid: uid }, { sort: { createdAt: 'desc' } });
};

doneUserTodosByNewest = function(uid) {
  return Todos.find({ uid: uid, isDone: true }, { sort: { createdAt: 'desc' } });
};

userTodosByNewestByNotDone = function(uid) {
  return Todos.find({ uid: uid, isDone: true }, {
    sort: [
      ['isDone', 'desc'],
      ['createdAt', 'desc']
    ]
  });
};

userTodosByNewestBy = function(uid, sortBy, orderBy) {
  return Todos.find({ uid: Meteor.userId() }, {
    sort: [
      [sortBy, orderBy],
      ['createdAt', 'desc']
    ]
  });
};
