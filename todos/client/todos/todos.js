
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
  $('.filter').val(Session.get('filter'));
  var $todos = document.getElementsByClassName('sortable')[0];
  var sortable = new Sortable($todos, {
    ghostClass: "sortable-placeholder",  // Class name for the drop placeholder
    onEnd: function (e) {
      var todoId = e.item.id;
      var oldIndex = e.oldIndex;
      var newIndex = e.newIndex;

      console.log('todoId: ', todoId);
      console.log('old: ', oldIndex);
      console.log('new: ', newIndex);

      function update() {
        updateTodo(todoId, { $set: { index: newIndex } });
      };

      if(oldIndex < newIndex) {
        var start = oldIndex + 1;
        var end = newIndex;
        console.log('-1 start, end: ', start,
                    ',', end);
        Meteor.call('decrementTodoIndices',
                    start,
                    end,
                    update);
      } else if(oldIndex > newIndex) {
        var start = newIndex;
        var end = oldIndex - 1;
        console.log('+1 start, end: ', start,
                    ',', end);
        Meteor.call('incrementTodoIndices',
                    start,
                    end,
                    update);
      } else { // same place
        return;
      }
    }
  });
};

function getTags(str) {
  var tags = str.match(/(?:#([^ #]+))/g);
  var tagTitles = _.map(tags, function(s) {
    return s.substring(1);
  });
  return tagTitles;
};

function removeTags(str) {
  _.each(str.match(/(?:#([^ #]+))/g), function(s) {
    str = str.replace(s, '');
  });
  return str;
};

Template.todosPage.helpers({

  todos: function () {
    var uid = Meteor.userId();
    var sortBy = Session.get('sortBy');
    var sortOrder = Session.get('sortOrder');
    var isDoneHidden = Session.get('isDoneHidden');
    if(sortBy === 'isDone' && isDoneHidden) sortBy = false;

    var query = Session.get('filter');
    if(!query || query.length === 0) {
      if(sortBy && sortBy.length !== 0) {
        return userTodosByIndexBy(uid, sortBy, sortOrder);
      } else {
        return userTodosByIndex(uid);
      }
    }

    // console.log('==== query: ', query)

    var tagTitles  = getTags(query);
    var title = removeTags(query);
    // console.log('title: ', title)
    if(tagTitles.length > 0)
      var todos = userTodosByTagTitles(uid, tagTitles);
    else
      var todos = userTodos(uid)

    // console.log('todos: ', todos.fetch())

    if(title) {
      var options = {
        keys: ['title'],   // keys to search in
        id: '_id'          // return a list of identifiers only
      }

      var wTags = titlesWithTags(todos.fetch());

      // console.log('wTags: ', wTags)

      var f = new Fuse(wTags, options);
      // console.log('title: ', title)
      var result = f.search(title);
      // console.log('result: ', result)
      return todosByIndex({ _id: { $in: result } });
    } else {
      return todos;
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

    var wTags = $(e.target).val();
    var titleNoTags = removeTags(wTags);
    var uid = Meteor.userId();
    var todo = { title: titleNoTags, ownerId: uid };

    Meteor.call('incrementTodoIndices', function() {
      insertTodo(todo, function(err, id) {
        // TODO: not rely on todoId.
        parseTags(wTags, id);
      });
    });

    $(e.target).val('');
  },

  'input .filter': function(e) {
    Session.setPersistent('filter', $(e.target).val());
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
