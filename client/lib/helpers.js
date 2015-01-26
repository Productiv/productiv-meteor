
decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();

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

/* http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html */
function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
};

function toUrlParamString(obj) {
  var str = "";
  R.keys(obj).forEach(function(key) {
    var val = obj[key];
    str += "&";
    str += key;
    str += "=";
    str += val;
  });
  return str.substring(1);
};
