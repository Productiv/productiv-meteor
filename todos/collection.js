Todos = new Mongo.Collection('todos');

insertTodo = function(todo) {
  todo.createdAt = new Date();
  todo.isDone = false;
  todo.index = todo.index || Infinity;
  Todo.insert(todo);
};

updateTodo = function(_id, newTodo) {
  Todo.update({ _id: _id }, { $set: newTodo });
};

removeTodo = function(_id) {
  Todo.remove({ _id: _id });
};

todo = function(_id) {
  return Todo.findOne({ _id: _id });
};

Query = function(query) {
  query = query || {};
  query.selector = query.selector || {};
  query.options = query.options || {};
  return query;
};

todos = function(query) {
  query = Query(query);
  return Todo.find(query.selector, query.options);
};

allTodos = todos;

userQuery = function(uid, query) {
  query = Query(query);
  query.selector.uid = uid;
  return query;
};

userTodos = function(uid) {
  return todos(userQuery(uid))
};

isDoneQuery = function(isDone, query) {
  query = Query(query);
  query.selector.isDone = isDone || true;
  return query;
};

isDoneUserQuery = function(uid, query) {
  query = Query(query);
  return userQuery(uid, isDoneQuery());
};

doneUserTodos = function(query) {
  return todos(isDoneUserQuery());
};

userTodosByNewest = function(selector, options) {
  return userTodos(uid, { $sort: { createdAt: 'asc' } });
};

doneUserTodosByNewest = function(selector, options) {
  return doneUserTodos(uid, { $sort: { createdAt: 'asc' } });
};
