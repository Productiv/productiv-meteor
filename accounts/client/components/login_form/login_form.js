
// TODO: use a session variable to add the name field to form
function synchronize(src, dest) {
  return function() {
    $('.nav-tabs > li').removeClass('active');
    $('.notice').html('');
    $(dest + '-link').addClass('active');
    $('form' + src).hide();
    $('form' + dest).show();
    var $src = $('form' + src);
    var email = $src.find('input.email').val();
    var password = $src.find('input.password').val();
    var $dest = $('form' + dest);
    $dest.find('input.email').val(email);
    $dest.find('input.password').val(password);
  };
};

Template.loginForm.events({
  'click .signup-link': synchronize('.login', '.signup'),

  'click .login-link': synchronize('.signup', '.login'),

  'click form.login button.login': function(e) {
    e.preventDefault();
    var email = $('.login .email').val();
    var password = $('.login .password').val();
    Meteor.loginWithPassword(email, password, function (error) {
      if (error) {
        console.log("Error authenticating user:", error);
        $('.notice').html(error.reason);
        return false;
      }

      console.log("User ID: " + user.uid + ", Provider: " + user.provider);
      Router.go('/');
    });
  },

  'click form.signup button.signup': function(e) {
    e.preventDefault();
    // create a new user
    var name = $('.signup .name').val();
    var email = $('.signup .email').val();
    var password = $('.signup .password').val();
    if(!password) {
      $('.notice').html('Password is a required field');
      return;
    }
    Accounts.createUser({
      password: password,
      email: email,
      profile: {
        name: name
      }
    }, function (error) {
      if (error) {
        console.log("Error authenticating user:", error);
        $('.notice').html(error);
      }
      else Router.go('/');
    });
  }
});
