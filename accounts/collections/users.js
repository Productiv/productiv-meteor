
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

// Meteor.users.helpers({
//   email: function() {
//     return this.emails[0] && this.emails[0].address;
//   },

//   name: function() {
//     return this.profile && this.profile.name;
//   }
// });

findUser = function(uid) {
  return Meteor.users.findOne(uid);
};
