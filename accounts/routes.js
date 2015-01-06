
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

// Users Public API

Router.route('/api/users/:_id', {where: 'server', name: 'api/users'})
  .get(function() {
    var _id = this.params._id;
    var user = Meteor.users.findOne({ _id: _id });
    sendJson(this.response, { success: true, data: user });
  })
  .put(function() {
    var _id = this.params._id;
    var user = this.request.body;
    var obj = {
      emails: [ {address: user.email} ],
      profile: user.profile
    }
    Meteor.users.update({ _id: _id }, { $set: obj });
    if(user.password) Accounts.setPassword(_id, user.password);
    sendJson(this.response, { success: true });
  })
  .delete(function() {
    var _id = this.params._id;
    var res = this.response;
    var user = Meteor.users.remove({ _id: _id }, function(err) {
      if(err) sendError(res, err);
      sendJson(res, { success: true });
    });
  });

Router.route('/api/users', {where: 'server'})
  .post(function() {
    var user = this.request.body;
    var res = this.response;
    Accounts.createUser({
      email: user.email,
      password: user.password,
      profile: {
        name: user.name
      }
    }, function() {
      sendJson(res, { success: true });
    });
  });