Router.configure({
  layoutTemplate: 'layout'
});

Router.onBeforeAction(function () {
  if (!Meteor.userId() && !Meteor.loggingIn()) {
    this.redirect('accounts.login');
  } else {
    this.next();
  }
}, {
  where: 'client',
  except: ['accounts.login']
});

Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});

Router.route('/', function() {
  this.redirect('/dashboard');
});

Router.route('/dashboard', function() {
  this.render('dashboardPage', {
    data: function () {
      console.log(Meteor.user());
      return Meteor.user();
    }
  });
});
