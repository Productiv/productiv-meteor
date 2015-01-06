
showUndo = function(message, action, undoAction) {
  Session.set('notice', message);
  $('.notice').show();

  // Could cause race conditions, etc.
  setTimeout(function() { $('.notice').fadeOut(2000, function() {
    $(this).hide().attr('style', '');
  }); }, 3000);
  window.onbeforeunload = action;
  window.undo_timeout = setTimeout(function() {
    action();
    window.onbeforeunload = null;
  }, 5000);

  $('.undo').click(function(e) {
    e.preventDefault();
    window.onbeforeunload = null
    $('.notice').stop().hide();
    clearTimeout(window.undo_timeout);
    undoAction();
  });
};

setDoneStatus = function() {
  if(Session.get('isDoneHidden'))
    Session.set('doneStatus', 'Hidden');
  else
    Session.set('doneStatus', 'Showing');
};

Template.todosPage.helpers({

  todos: function () {
    return userTodosByNewest(Meteor.userId());
  },

  notice: function() {
    return Session.get('notice');
  },

  doneStatus: function() {
    return Session.get('doneStatus');
  },

  hideDone: function() {
    return Session.get('isDoneHidden') ? 'hide-done' : '';
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

  'change .check': function(e) {
    e.preventDefault();

    var checkbox = e.target;
    var $todo = $(checkbox).parents('.todo');
    var isDone = checkbox.checked;
    var _id = $todo.attr('id');

    if($todo.parents('.todos').hasClass('hide-done')) {
      $todo.fadeOut('300', function(e) {
        $(this).toggleClass('done').attr('style', '');
      });
    } else $todo.toggleClass('done');

    // updateTodo(id, { isDone: isDone });
    Todos.update({ _id: _id }, { $set: { isDone: isDone } });

    showUndo('Todo completed.', function() {
      // do nothing
    }, function() {
      // updateTodo(id, { isDone: !isDone });
      Todos.update({ _id: _id }, { $set: { isDone: !isDone } });
    });

    $todo.children('.title-input').focus();
  },

  'mouseenter .show-done-toggle': function(e) {
    if(Session.get('isDoneHidden'))
      Session.set('doneStatus', 'Show');
    else
      Session.set('doneStatus', 'Hide');
  },

  'mouseleave .show-done-toggle': setDoneStatus,

  'click .show-done-toggle': function(e) {
    var isHidden = Session.get('isDoneHidden');
    Session.set('isDoneHidden', !isHidden);
    setDoneStatus();
  }

});
