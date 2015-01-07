
Template.todoTag.helpers({
  link: function() {
    var type = this.itemType;
    var itemId = this.itemId;
    return '/' + type + 's/' + itemId;
  },

  lead: function() {
    var map = {
      'user'    : '~',
      'todo'    : '&',
      'reminder': '@',
      ''        : '#',
      null      : '#',
      undefined : '#'
    };

    var type = this.itemType;
    return map[type];
  }
});