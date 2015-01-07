
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
  },

  tags: function() {
    return tags(this.tagIds);
  }

});

function parseTags(str, todo) {
  // inverse of map in todoTag.js
  var map = {
    '~' : 'user',
    '@' : 'reminder',
    '#' : 'topic'
  };

  var newTags = str.match(/([\@\~\&\#][\w\-]+)/g);

  newTags = newTags.map(function(tag, index) {
    console.log('tag: ', tag);
    var obj = {}
    obj.title = tag.substring(1);
    obj.itemType = map[tag.substring(0, 1)];
    console.log('obj: ', obj);
    obj.ownerId = Meteor.userId();
    return obj;
  });

  var tags = todo.tags();

  // get all old tags
  var oldTags = _.reject(tags, function(tag) {
    _.contains(_.pluck(newTags, title), tag.title);
  });

  // remove old tags
  todo.removeTags(oldTags);

  // filter by brand new tags
  var brandNewTags = _.reject(newTags, function(tag) {
    _.contains(_.pluck(tags, title), tag.title);
  });

  // add new tags
  todo.addTags(brandNewTags);

  return str;
}

function updateTitle(e, todo) {
  var title = parseTags($(e.target).val(), todo);
  var $todo = $(e.target).parents('.todo');
  var id = todo._id;
  $todo.attr('draggable', true);
  updateTodo(id, { title: title });
  Session.set('todo-' + id, '');
}

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
    var $todo = $(e.target).parents('.todo');
    $todo.data('title', this.title);
    Session.set('todo-' + this._id, 'editing');
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
      updateTitle(e, this);
    } else if(e.which === 27) { // Press Esc
      var $todo = $(e.target).parents('.todo');
      Session.set('todo-' + this._id, '');
    }
  },

  'focusout .title-input': function(e) {
    e.preventDefault();
    if(Session.get('todo-' + this._id) !== 'editing') return false;
    updateTitle(e, this);
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
