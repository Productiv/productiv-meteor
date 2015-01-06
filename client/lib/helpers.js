
showUndo = function(message, action, undoAction) {
  Session.set('notice', message);
  $('.notice').show();

  // Could cause race conditions, etc.
  setTimeout(function() { $('.notice').fadeOut(2000, function() {
    $(this).hide().attr('style', '');
  }); }, 3000);
  window.onbeforeunload = action;
  window.undo_timeout = setTimeout(function() {
    action();
    window.onbeforeunload = null;
  }, 5000);

  $('.undo').click(function(e) {
    e.preventDefault();
    window.onbeforeunload = null
    $('.notice').stop().hide();
    clearTimeout(window.undo_timeout);
    undoAction();
  });
};
