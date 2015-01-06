Template.todosPage.events({
  'keydown .add-todo': function (e) {
    if(e.which !== 13) return;

    var title = $(e.target).val();
    var uid = Meteor.userId();

    Meteor.call('insertTodo', { title: title, uid: uid });

    saveTodoOrder();
    $('.sortable').sortable('reload');
  }
});