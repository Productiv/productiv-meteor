
/*******************************************************************************
  Schema - Tag
  {
    _id       : String
    ownerId   : String
    todoIds   : String[]
    itemId    : String
    itemType  : String<user, reminder, topic>
    title     : String
    createdAt : Number
    updatedAt : Number
  }
*******************************************************************************/

Tags = new Mongo.Collection('tags');

Tags.helpers({

  owner: function () {
    return findUser(this.ownerId);
  },

  todos: function () {
    return Todos.find({ _id : { $in: this.todoIds } });
  },

  item: function () {
    switch(itemType) {
      case "topic":
        return this.title;
      case "reminder":
        return findReminder(this.itemId);
      default:
        return "itemType unknown";
    }
  },

  // input: single or array of todoIds or todos
  addTodos: function (todos) {
    if(typeof todos === 'string' || typeof todos === 'object') todos = [todos];
    if(typeof todos[0] === 'object') todos = _.pluck(todos, '_id');
    updateTag(this._id, { $addToSet: { todoIds: { $each: todos } } });
  },

  // input: single or array of todoIds or todos
  removeTodos: function (todos) {
    if(typeof todos === 'string' || typeof todos === 'object') todos = [todos];
    if(typeof todos[0] === 'object') todos = _.pluck(todos, '_id');
    updateTag(this._id, { $pull: { $each: { todoIds: todos } } });
  }

});

// TODO: add hook to create or update associated item
insertTag = function(tag, callback) {
  tag.createdAt = tag.createdAt || (new Date()).getTime();
  Tags.insert(tag, callback);
};

// TODO: add hook to create or update associated item
updateTag = function(_id, modifier, callback) {
  Tags.update(_id, modifier, callback);
};

// TODO: add hook to create or update associated item
setTag = function(_id, newValues, callback) {
  newValues.updatedAt = (new Date()).getTime();
  Tags.update(_id, { $set: newValues }, callback);
};

// TODO: add hook to create or update associated item
addTagToTodo = function(tagId, todoId) {
  Tags.update(tagId, { todoIds: { $addToSet: todoId } });
};

// TODO: add hook to create or update associated item
removeTagFromTodo = function(tagId, todoId) {
  Tags.update(tagId, { $pull: { todoIds: todoId } });
  var tag = Tags.find(tagId);
  if(!tag.todoIds || tag.todoIds.length === 0) removeTag(tagId);
};

// TODO: add hook to create or update associated item
removeTag = function(_id) {
  Tags.remove(_id);
};

Meteor.methods({

//   // TODO: add hook to create or update associated item
//   upsertTag: function(selector, modifier, callback) {
//     // tag.createdAt = tag.createdAt || (new Date()).getTime();
//     var res = Tags.upsert(selector, modifier);
//     console.log('res: ', res);
//     if(callback) callback(res);
//   }

   removeTag: removeTag

});

findTag = function(_id) {
  return Tags.findOne(_id);
};

userTagByTitle = function(ownerId, title) {
  return Tags.find({
    ownerId: ownerId,
    title: title
  }).fetch()[0];
};

findTags = function(ids) {
  if(!ids) return;
  return Tags.find({ _id: { $in: ids } });
};

allTags = function() {
  return Tags.find();
};

todoTags = function(todoId) {
  return Tags.find({ todoIds: todoId });
};

userTags = function(uid) {
  return Tags.find({ ownerId: uid });
};

userTodoTags = function(uid, todoId) {
  return Tags.find({ ownerId: uid, todoIds: todoId });
};

userItemTags = function(uid, itemId) {
  return Tags.find({ ownerId: uid, itemId: itemId });
};

userTagsByNewest = function(uid) {
  return Tags.find({ ownerId: uid }, { sort: { createdAt: 'desc' } });
};

doneUserTagsByNewest = function(uid) {
  return Tags.find({ ownerId: uid, isDone: true }, { sort: { createdAt: 'desc' } });
};

userTagsByNewestBy = function(uid, sortBy, orderBy) {
  return Tags.find({ ownerId: uid }, {
    sort: [
      [sortBy, orderBy],
      ['createdAt', 'desc']
    ]
  });
};
