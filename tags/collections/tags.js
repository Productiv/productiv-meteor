
/*******************************************************************************
  Schema - Tag
  {
    _id       : String
    ownerId   : String
    itemId    : String
    itemType  : String<user, todo, reminder, null(topic)>
    title     : String
    createdAt : Number
    updatedAt : Number
  }
*******************************************************************************/

Tags = new Mongo.Collection('tags');

insertTag = function(tag) {
  tag.createdAt = tag.createdAt || (new Date()).getTime();
  Tags.insert(tag);
};

updateTag = function(_id, newValues, callback) {
  Tags.update(_id, { $set: newValues }, callback);
};

removeTag = function(_id) {
  Tags.remove(_id);
};

tag = function(_id) {
  return Tags.findOne(_id);
};

tags = function(selector, options) {
  selector = selector || {};
  options  = options  || {};
  return Tags.find(selector, options);
};

allTags = function() {
  return Tags.find();
};

userTags = function(uid) {
  return Tags.find({ ownerId: uid });
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
