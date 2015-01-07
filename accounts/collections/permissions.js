
/*******************************************************************************
  Schema - Permission
  {
    _id       : String
    userId    : String
    itemId    : String
    itemType  : String<todo, tag, reminder>
    read      : Boolean
    write     : Boolean
    collabs   : Boolean
    createdAt : Number
    updatedAt : Number
  }
*******************************************************************************/

Permissions = new Mongo.Collection('permissions');

insertPermission = function(permission) {
  permission.itemType  = permission.itemType  || 'todo';
  permission.access    = permission.access    || 'read';
  permission.createdAt = permission.createdAt || (new Date()).getTime();
  Permissions.insert(permission);
};

updatePermission = function(_id, newValues, callback) {
  Permissions.update(_id, { $set: newValues }, callback);
};

removePermission = function(_id) {
  Permissions.remove(_id);
};

permission = function(_id) {
  return Permissions.findOne(_id);
};

permissions = function(selector, options) {
  selector = selector || {};
  options  = options  || {};
  return Permissions.find(selector, options);
};

allPermissions = function() {
  return Permissions.find();
};

userPermissions = function(userId) {
  return Permissions.find({ userId: userId });
};

itemPermissions = function(itemId) {
  return Permissions.find({ itemId: itemId });
};

userItemPermissions = function(userId, itemId) {
  return Permissions.find({ userId: userId, itemId: itemId });
};
