
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

Template.remindersPage.rendered = function () {
  setDoneStatus();
  var $reminders = document.getElementsByClassName('sortable')[0];
  var sortable = new Sortable($reminders, {
    ghostClass: "sortable-placeholder",  // Class name for the drop placeholder
    onSort: function (e) { // Called by any change (add / update / remove)
      updateIndexOfReminders();
    }
  });
};

Template.remindersPage.helpers({

  reminders: function () {
    var uid = Meteor.userId();
    return userRemindersByIndex(uid);

    // var sortBy = Session.get('sortBy');
    // var sortOrder = Session.get('sortOrder');
    // if(sortBy) {
    //   return userRemindersByIndexBy(uid, sortBy, sortOrder);
    // } else {
    //   return userRemindersByIndex(uid);
    // }
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

Template.remindersPage.events({

  'keydown .add-reminder': function (e) {
    if(e.which !== 13) return;

    var title = $(e.target).val();
    var uid = Meteor.userId();

    Meteor.call('insertReminderAtFirstIndex', { title: title, uid: uid });

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
