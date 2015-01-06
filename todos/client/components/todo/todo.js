
Template.todo.helpers({
  done: function () {
    return this.isDone ? 'done' : '';
  }
});