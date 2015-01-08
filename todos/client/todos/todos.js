
setDoneStatus = function() {
  if(Session.get('isDoneHidden'))
    Session.set('doneStatus', 'Hidden');
  else
    Session.set('doneStatus', 'Showing');
};

toggleDoneHidden = function() {
  var isHidden = Session.get('isDoneHidden');
  Session.setPersistent('isDoneHidden', !isHidden);
  if(isHidden) $('.todo').show();
};

Template.todosPage.rendered = function () {
  setDoneStatus();
  var $todos = document.getElementsByClassName('sortable')[0];
  var sortable = new Sortable($todos, {
    ghostClass: "sortable-placeholder",  // Class name for the drop placeholder
    onEnd: function (e) {
      el = e.item;
      before = $(e.item).prev().get(0);
      after = $(e.item).next().get(0);

      var newIndex;
      if(!before) {
        newIndex = Blaze.getData(after).index - 1;
      } else if(!after) {
        newIndex = Blaze.getData(before).index + 1;
      } else {
        newIndex = (Blaze.getData(after).index + Blaze.getData(before).index)/2;
      }

      Todos.update({_id: Blaze.getData(el)._id}, {$set: {index: newIndex}});
    }
  });
};

Template.todosPage.helpers({

  todos: function () {
    var uid = Meteor.userId();
    var sortBy = Session.get('sortBy');
    var sortOrder = Session.get('sortOrder');
    var isDoneHidden = Session.get('isDoneHidden');
    if(sortBy === 'isDone' && isDoneHidden) sortBy = false;

    if(sortBy) return userTodosByIndexBy(uid, sortBy, sortOrder);
    else       return userTodosByIndex(uid);

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
  },

  doneToBottomHidden: function() {
    return Session.get('isDoneHidden') ? 'hidden' : '';
  },

  noRender: function(){
    return Session.get("noRender");
  }

});

Template.todosPage.events({

  'keydown .add-todo': function (e) {
    if(e.which !== 13) return;

    var title = $(e.target).val();
    var uid = Meteor.userId();

    Meteor.call('insertTodoAtFirstIndex', { title: title, ownerId: uid });

    $(e.target).val('');
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
