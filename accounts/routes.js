
Router.route('/accounts', function() {
  this.redirect('/accounts/profile');
});

Router.route('/accounts/profile', function() {
  this.render('profilePage', {
    data: function() {
      return Meteor.user();
    }
  });
}, {
  name: 'accounts.profile'
});

Router.route('/accounts/login', function() {
  this.render('loginPage');
}, {
  name: 'accounts.login'
});