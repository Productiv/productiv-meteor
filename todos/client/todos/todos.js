
Template.todosPage.helpers({
  todos: function () {
    return userTodosByNewest(Meteor.userId());
  }
});

Template.todosPage.events({
  'keydown .add-todo': function (e) {
    if(e.which !== 13) return;

    var title = $(e.target).val();
    var uid = Meteor.userId();

    Meteor.call('insertTodoAtFirstIndex', { title: title, uid: uid });

    $(e.target).val();
  }
});
