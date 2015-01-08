
/*******************************************************************************
  Schema - User
  {
    _id       : String
    email     : String
    name      : String
    createdAt : Number
    updatedAt : Number
  }
*******************************************************************************/

findUser = function(uid) {
  return Meteor.users.findOne(uid);
};
