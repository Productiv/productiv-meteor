
Template.todoTitleInput.rendered = function() {
  var $input = $('.title-input');
  var $todo = $input.parents('.todo');
  $input.val('').focus().val(decodeEntities($todo.data('title')));
};

Template.todo.helpers({

  done: function() {
    return this.isDone ? 'done' : '';
  },

  editing: function() {
    return Session.get('todo-' + this._id) === 'editing';
  },

  draggable: function() {
    return Session.get('todo-' + this._id) !== 'editing'
  }

});

Template.todo.events({

  'change .check': function(e) {
    e.preventDefault();

    var checkbox = e.target;
    var $todo = $(checkbox).parents('.todo');
    var isDone = checkbox.checked;
    var _id = $todo.attr('id');

    if($todo.parents('.todos').hasClass('hide-done')) {
      $todo.fadeOut('300', function(e) {
        updateTodo(_id, { isDone: isDone }, function() {
          $(this).attr('style', '');
        });
      });
    } else updateTodo(_id, { isDone: isDone });

    if(isDone && Session.get('isDoneHidden')) {
      showUndo('Todo completed.', function() {
        // do nothing
      }, function() {
        $todo.stop();
        updateTodo(_id, { isDone: !isDone });
      });
    }

    $todo.children('.title-input').focus();
  },

  'click .title': function(e) {
    $title = $(e.target);
    var title = $title.html();
    var $todo = $title.parents('.todo');
    $todo.data('title', title);
    Session.set('todo-' + $todo.attr('id'), 'editing');
    $todo.attr('draggable', false);
  },

  'keyup .title-input': function(e) {
    // Press Enter and Title Empty
    if(e.which === 13 && $(e.target).val() === '') {
      e.preventDefault();

      var $todo = $(e.target).parents('.todo');
      var id = this._id;

      $todo.fadeOut('300');

      showUndo('Task deleted.', function() {
        removeTodo(id);
        // updateIndexOfTodos();
      }, function() {
        $todo.show();
      });
    } else if(e.which === 13) { // Press Enter
      e.preventDefault();
      var title = $(e.target).val();
      var $todo = $(e.target).parents('.todo');
      var id = this._id;
      $todo.attr('draggable', true);
      updateTodo(id, { title: title });
      Session.set('todo-' + id, '');
    } else if(e.which === 27) { // Press Esc
      var $todo = $(e.target).parents('.todo');
      Session.set('todo-' + this._id, '');
    }
  },

  'focusout .title-input': function(e) {
    e.preventDefault();
    if(Session.get('todo-' + this._id) !== 'editing') return false;
    var $todo = $(e.target).parents('.todo');
    var title = $(e.target).val();
    updateTodo($todo.attr('id'), { title: title });
    $todo.attr('draggable', true);
    Session.set('todo-' + $todo.attr('id'), '');
  },

  'click .remove': function(e) {
    e.preventDefault();

    var $todo = $(e.target).parents('.todo');
    var id = this._id;

    $todo.fadeOut('300');

    showUndo('Task deleted.', function() {
      removeTodo(id);
      // updateIndexOfTodos();
    }, function() {
      $todo.show();
    });
  }

});
