
Template.todoTag.helpers({
  link: function() {
    var type = this.itemType;
    var itemId = this.itemId;
    return '#?=tag:' + this.title;
  },

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
    e.stopPropagation();
  }
});