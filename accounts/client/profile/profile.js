Template.profilePage.helpers({
  name: function () {
    return this && this.profile && this.profile.name;
  },

  primaryEmail: function () {
    return this && this.emails && this.emails[0] && this.emails[0].address;
  }
});