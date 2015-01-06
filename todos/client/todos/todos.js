
setDoneStatus = function() {
  if(Session.get('isDoneHidden'))
    Session.set('doneStatus', 'Hidden');
  else
    Session.set('doneStatus', 'Showing');
};

toggleDoneHidden = function() {
  var isHidden = Session.get('isDoneHidden');
  Session.set('isDoneHidden', !isHidden);
};

Template.todosPage.rendered = function () {
  setDoneStatus();
};

Template.todosPage.helpers({

  todos: function () {
    var uid = Meteor.userId();
    var sortBy = Session.get('sortBy');
    var sortOrder = Session.get('sortOrder');
    if(sortBy) {
      return userTodosByNewestBy(uid, sortBy, sortOrder);
    } else {
      return userTodosByNewest(uid);
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
      Session.set('sortBy', '');
      Session.set('sortOrder', '');
    } else {
      Session.set('sortBy', 'isDone');
      Session.set('sortOrder', 'asc');
    }
  },

  'click .logout': function(e) {
    Meteor.logout();
    Router.go('accounts.login');
  }

});
