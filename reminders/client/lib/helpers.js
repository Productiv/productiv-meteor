
updateIndexOfReminders = function() {
  setTimeout(function() {
    var reminders = $('.reminder').toArray().reverse();
    console.log(reminders);
    var ids = reminders.map(function(reminder, index, ary) {
      var ind = $(reminder).data('index');
      console.log('reminder: ', reminder, ', index: ', index, ', old index: ', ind);
      var id = $(reminder).attr('id');
      return id;
    });
    console.log(ids)
    ids.forEach(function(id, index, ary) {
      console.log('id: ', id, ', index: ', index);
      updateReminder(id, { index: index });
    });
  }, 100);
};
