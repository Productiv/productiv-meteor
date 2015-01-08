
Template.todoTag.helpers({
  lead: function() {
    // inverse of map in todo.js
    var map = {
      'user'    : '~',
      'reminder': '@',
      'topic'   : '#'
    };

    var type = this.itemType;
    return map[type];
  }
});

Template.todoTag.events({
  'click a': function (e) {
    // e.preventDefault();
    // var url = window.location.href;
    // var type = this.itemType;
    // var itemId = this.itemId;
    // if(url.indexOf('?') === url.length - 1 ||
    //    url.indexOf('&') === url.length - 1)
    //   window.location.href = url + 'tags[]=' + this.title;
    // else if(url.indexOf('?') > -1)
    //   window.location.href = url + '&tags[]=' + this.title;
    // else
    //   window.location.href = url + '?tags[]=' + this.title;
    e.stopPropagation();
    var query = $('.filter').val();
    if(query.indexOf('tag:' + this.title) > -1) return false;
    if(query.length > 0) query = query + ' tag:' + this.title;
    else                 query = 'tag:' + this.title;
    $('.filter').val(query);
    Session.setPersistent('filter', query);
    return false;
  }
});