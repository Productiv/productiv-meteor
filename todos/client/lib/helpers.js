
parseTags = function(str, todo) {
  var ownerId = todo.ownerId || Meteor.userId();
  var todoId = todo._id || todo;

  var newTags = str.match(/([\@\~\&\#][\w\-]+)/g);

  if(!newTags) return str;

  newTags.forEach(function(tag) {
    str = str.replace(tag, '');
  });

  str = str.replace(/\s*^/, '');

  newTags = newTags.map(function(tag, index) {
    var obj = {}
    obj.title = tag.substring(1);
    obj.itemType = tagTypeForSymbol[tag.substring(0, 1)];
    obj.ownerId = Meteor.userId();
    return obj;
  });

  console.log('newTags: ', newTags)

  var tags
  if(todoId && ownerId) {
    tags = userTodoTags(ownerId, todoId).fetch(); // todo.tags();
  }

  if(tags) {
    // get all old tags
    var oldTags = _.reject(tags, function(tag) {
      return _.contains(_.pluck(newTags, 'title'), tag.title);
    });

    console.log('oldTags: ', oldTags)

    // remove old tags
    // todo.removeTags(oldTags);
    oldTags.forEach(function(tag, index) {
      // tag.removeTodoIds(this._id);
      updateTag(tag._id, { $pull: { todoIds: todoId } });
    });

    // filter by brand new tags
    var brandNewTags = _.reject(newTags, function(tag) {
      return _.contains(_.pluck(tags, 'title'), tag.title);
    });
  } else {
    var brandNewTags = newTags;
  }

  console.log('brandNewTags: ', brandNewTags)
  // add new tags
  // todo.addTags(brandNewTags);
  brandNewTags.forEach(function(tag, index) {
    var oldTag = findTag(tag);
    console.log('oldTag: ', oldTag)
    if(oldTag) {
      console.log("true")
      updateTag(oldTag._id, { $push: { todoIds: todoId } });
    } else {
      tag.todoIds = [ todoId ];
      console.log("tag: ", tag)
      insertTag(tag, function(err, id) {
        if(err) console.log('err: ', err)
        else    console.log('new tagId: ', id)
      });
    }
  });

  return str;
}
