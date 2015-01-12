
Template.todoTag.helpers({
  lead: function() {
    var type = this.itemType;
    return symbolForTagType[type];
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
    var tagText = symbolForTagType[this.itemType] + this.title;
    if(query.indexOf('tag:' + this.title) > -1) return false;
    if(query.length > 0) query += ' ' + tagText;
    else                 query += tagText;
    $('.filter').val(query);
    Session.setPersistent('filter', query);
    return false;
  }
});