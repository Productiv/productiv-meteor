
setDoneStatus = function() {
  if(Session.get('isDoneHidden'))
    Session.set('doneStatus', 'Hidden');
  else
    Session.set('doneStatus', 'Showing');
};

toggleDoneHidden = function() {
  var isHidden = Session.get('isDoneHidden');
  Session.setPersistent('isDoneHidden', !isHidden);
};

Template.todosPage.rendered = function () {
  setDoneStatus();
  var $todos = document.getElementsByClassName('sortable')[0];
  var sortable = new Sortable($todos, {
    ghostClass: "sortable-placeholder",  // Class name for the drop placeholder
    onSort: function (e) { // Called by any change (add / update / remove)
      updateIndexOfTodos();
    }
  });
};

Template.todosPage.helpers({

  todos: function () {
    var uid = Meteor.userId();
    var sortBy = Session.get('sortBy');
    var sortOrder = Session.get('sortOrder');

    if(sortBy) {
      return userTodosByIndexBy(uid, sortBy, sortOrder);
    } else {
      return userTodosByIndex(uid);
    }
  },

  notice: function() {
    return Session.get('notice');
  },

  doneStatus: function() {
    return Session.get('doneStatus');
  },

  hideDone: function() {
    return Session.get('isDoneHidden') ? 'hide-done' : '';
  },

  doneToBottom: function() {
    return Session.get('sortBy') === 'isDone' ? 'active' : '';
  }

});

Template.todosPage.events({

  'keydown .add-todo': function (e) {
    if(e.which !== 13) return;

    var title = $(e.target).val();
    var uid = Meteor.userId();

    Meteor.call('insertTodoAtFirstIndex', { title: title, uid: uid });

    $(e.target).val();
  },

  'mouseenter .show-done-toggle': function(e) {
    if(Session.get('isDoneHidden'))
      Session.set('doneStatus', 'Show');
    else
      Session.set('doneStatus', 'Hide');
  },

  'mouseleave .show-done-toggle': setDoneStatus,

  'click .show-done-toggle': function(e) {
    toggleDoneHidden();
    setDoneStatus();
  },

  'click .done-to-bottom': function(e) {
    if(Session.get('sortBy') === 'isDone') {
      Session.setPersistent('sortBy', '');
      Session.setPersistent('sortOrder', '');
    } else {
      Session.setPersistent('sortBy', 'isDone');
      Session.setPersistent('sortOrder', 'asc');
    }
  },

  'click .logout': function(e) {
    Meteor.logout();
    Router.go('accounts.login');
  }

});
