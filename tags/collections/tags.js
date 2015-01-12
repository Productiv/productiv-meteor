
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

// // TODO: add hook to create or update associated item
// addTagToTodo = function(tagId, modifier, callback) {
//   Tags.update(_id, modifier, callback);
// };

// Meteor.methods({

//   // TODO: add hook to create or update associated item
//   upsertTag: function(selector, modifier, callback) {
//     // tag.createdAt = tag.createdAt || (new Date()).getTime();
//     var res = Tags.upsert(selector, modifier);
//     console.log('res: ', res);
//     if(callback) callback(res);
//   }

// });

// TODO: add hook to create or update associated item
// removeTag = function(_id) {
//   Tags.remove(_id);
// };

findTag = function(_id) {
  return Tags.findOne(_id);
};

// findTags = function(selector, options) {
//   selector = selector || {};
//   options  = options  || {};
//   return Tags.find(selector, options);
// };

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
