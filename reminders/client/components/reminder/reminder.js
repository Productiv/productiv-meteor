
Template.reminderTitleInput.rendered = function() {
  var $input = $('.title-input');
  var $reminder = $input.parents('.reminder');
  $input.val('').focus().val($reminder.data('title'));
};

Template.reminder.helpers({

  done: function() {
    return this.isDone ? 'done' : '';
  },

  editing: function() {
    return Session.get('reminder-' + this._id) === 'editing';
  },

  draggable: function() {
    return Session.get('reminder-' + this._id) !== 'editing'
  }

});

Template.reminder.events({

  'change .check': function(e) {
    e.preventDefault();

    var checkbox = e.target;
    var $reminder = $(checkbox).parents('.reminder');
    var isDone = checkbox.checked;
    var _id = $reminder.attr('id');

    if($reminder.parents('.reminders').hasClass('hide-done')) {
      $reminder.fadeOut('300', function(e) {
        $(this).toggleClass('done').attr('style', '');
      });
    } else $reminder.toggleClass('done');

    // updateReminder(id, { isDone: isDone });
    Reminders.update({ _id: _id }, { $set: { isDone: isDone } });

    showUndo('Reminder completed.', function() {
      // do nothing
    }, function() {
      // updateReminder(id, { isDone: !isDone });
      Reminders.update({ _id: _id }, { $set: { isDone: !isDone } });
    });

    $reminder.children('.title-input').focus();
  },

  'click .title': function(e) {
    $title = $(e.target);
    var title = $title.html();
    var $reminder = $title.parents('.reminder');
    $reminder.data('title', title);
    Session.set('reminder-' + $reminder.attr('id'), 'editing');
    $reminder.attr('draggable', false);
  },

  'keyup .title-input': function(e) {
    // Press Enter and Title Empty
    if(e.which === 13 && $(e.target).val() === '') {
      e.preventDefault();

      var $reminder = $(e.target).parents('.reminder');
      var id = this._id;

      $reminder.fadeOut('300');

      showUndo('Task deleted.', function() {
        removeReminder(id);
        // updateIndexOfReminders();
      }, function() {
        $reminder.show();
      });
    } else if(e.which === 13) { // Press Enter
      e.preventDefault();
      var title = $(e.target).val();
      var $reminder = $(e.target).parents('.reminder');
      var id = this._id;
      $reminder.attr('draggable', true);
      updateReminder(id, { title: title });
      Session.set('reminder-' + id, '');
    } else if(e.which === 27) { // Press Esc
      var $reminder = $(e.target).parents('.reminder');
      Session.set('reminder-' + this._id, '');
    }
  },

  'focusout .title-input': function(e) {
    e.preventDefault();
    if(Session.get('reminder-' + this._id) !== 'editing') return false;
    var $reminder = $(e.target).parents('.reminder');
    var title = $(e.target).val();
    updateReminder($reminder.attr('id'), { title: title });
    $reminder.attr('draggable', true);
    Session.set('reminder-' + $reminder.attr('id'), '');
  },

  'click .remove': function(e) {
    e.preventDefault();

    var $reminder = $(e.target).parents('.reminder');
    var id = this._id;

    $reminder.fadeOut('300');

    showUndo('Task deleted.', function() {
      removeReminder(id);
      // updateIndexOfReminders();
    }, function() {
      $reminder.show();
    });
  }

});
