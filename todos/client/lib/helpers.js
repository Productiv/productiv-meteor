
parseTags = function(str, todo) {

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

  var tags = userTodoTags(todo.ownerId, todo._id).fetch(); // todo.tags();

  if(tags) {
    // get all old tags
    var oldTags = _.reject(tags, function(tag) {
      return _.contains(_.pluck(newTags, 'title'), tag.title);
    });

    // remove old tags
    // todo.removeTags(oldTags);
    oldTags.forEach(function(tag, index) {
      // tag.removeTodoIds(this._id);
      updateTag(tag._id, { $pull: { todoIds: todo._id } });
    });

    // filter by brand new tags
    var brandNewTags = _.reject(newTags, function(tag) {
      return _.contains(_.pluck(tags, 'title'), tag.title);
    });
  } else {
    var brandNewTags = newTags;
  }

  // add new tags
  // todo.addTags(brandNewTags);
  brandNewTags.forEach(function(tag, index) {
    Meteor.call('upsertTag', tag, { $set: tag, $push: { todoIds: todo._id } });
  });

  return str;
}
