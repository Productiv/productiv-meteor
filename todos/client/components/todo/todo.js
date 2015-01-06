
Template.todoTitleInput.rendered = function() {
  var $input = $('.title-input');
  var $todo = $input.parents('.todo');
  $input.focus().val($todo.data('title'));
};

Template.todo.helpers({

  done: function() {
    return this.isDone ? 'done' : '';
  },

  editing: function() {
    return Session.get('todo-' + this._id) === 'editing';
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

  'click .title': function(e) {
    var title = $(e.target).html();
    var $todo = $(e.target).parents('.todo');
    $todo.data('title', title);
    Session.set('todo-' + $todo.attr('id'), 'editing');
    $todo.attr('draggable', false);
  },

  'keyup .title-input': function(e) {
    // Press Enter
    if(e.which === 13 && $(e.target).val() === '') {
      e.preventDefault();

      var $todo = $(e.target).parents('.todo');

      $todo.fadeOut('300');

      showUndo('Task deleted.', function() {
        removeTodo($todo.attr('id'));
        $todo.remove();
      }, function() {
        $todo.show();
      });
    }
    else if(e.which === 13) {
      e.preventDefault();
      var title = $(e.target).val();
      var $todo = $(e.target).parents('.todo');
      var id = $todo.attr('id');
      $todo.attr('draggable', true);
      updateTodo(id, { title: title });
      Session.set('todo-' + id, '');
    }

    // Pres Esc
    if(e.which === 27) {
      var $todo = $(e.target).parents('.todo');
      $todo.attr('draggable', true);
      Session.set('todo-' + $todo.attr('id'), '');
    }
  },

  'focusout .title-input': function(e) {
    e.preventDefault();
    var $todo = $(e.target).parents('.todo');
    var title = $(e.target).val();
    $todo.attr('draggable', true);
    updateTodo($todo.attr('id'), { title: title });
  }

});
