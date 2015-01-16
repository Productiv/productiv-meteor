
function parseTags(str) {
  return title.match(/([\@\~\&\#][\w\-]+)/g);
};

function removeTags(str) {
  var tags = parseTags(str);
  tags.forEach(function(tag) {
    str = str.replace(tag, '');
  });
  return str.trim();
};

parseTodoTitleTags = function(title, todo) {
  var ownerId = todo.ownerId || Meteor.userId();
  var todoId;
  if(typeof todo === 'string') todoId = todo;
  else if(typeof todo === 'object') todoId = todo._id;
  else console.log('error: todo is neither object nor string.');

  var newTags = parseTags(title);

  if(!newTags) return title;

  title = removeTags(title);
  title = title.replace(/\s*^/, '');

  newTags = newTags.map(function(tag, index) {
    var obj = {}
    obj.title = tag.substring(1);
    obj.itemType = tagTypeForSymbol[tag.substring(0, 1)];
    obj.ownerId = Meteor.userId();
    return obj;
  });

  console.log('newTags: ', newTags)

  var currentTags
  if(todoId && ownerId) {
    currentTags = userTodoTags(ownerId, todoId).fetch(); // todo.tags();
  } else if(ownerId) {
    currentTags = userTags(ownerId).fetch();
  }

  console.log('currentTags: ', currentTags)

  function tagIn(col) {
    return function(tag) {
      return _.contains(_.pluck(col, 'title'), tag.title);
    };
  };

  if(currentTags) {
    // get all old tags
    var oldTags = _.reject(currentTags, tagIn(newTags));

    console.log('oldTags: ', oldTags)

    // remove old tags
    // todo.removeTags(oldTags);
    oldTags.forEach(function(tag, index) {
      removeTagFromTodo(tag._id, todoId);
      // updateTag(tag._id, { $pull: { todoIds: todoId } });
    });

    // filter by brand new tags
    var brandNewTags = _.reject(newTags, tagIn(currentTags));
  } else {
    var brandNewTags = newTags;
  }

  console.log('brandNewTags: ', brandNewTags)
  // add new tags
  // todo.addTags(brandNewTags);
  brandNewTags.forEach(function(tag, index) {
    var currentTag = findTag(tag);
    console.log('currentTag: ', currentTag)
    if(currentTag) {
      console.log("tag is current")
      addTagToTodo(currentTag._id, todoId)
      // updateTag(currentTag._id, { $push: { todoIds: todoId } });
    } else {
      tag.todoIds = [ todoId ];
      console.log("tag: ", tag)
      insertTag(tag, function(err, id) {
        if(err) console.log('err: ', err)
        else    console.log('new tagId: ', id)
      });
    }
  });

  return title;
}
