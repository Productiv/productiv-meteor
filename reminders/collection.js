
Reminders = new Mongo.Collection('reminders');

insertReminder = function(reminder) {
  reminder.createdAt = reminder.createdAt || (new Date()).getTime();
  reminder.isDone    = reminder.isDone    || false;
  if(reminder.index === undefined || reminder.index === null) reminder.index = Infinity;
  Reminders.insert(reminder, function() {
    console.log('done!');
  });
};

Meteor.methods({

  insertReminderAtFirstIndex: function(reminder) {
    console.log('updating other reminders...')
    Reminders.update({}, { $inc: { index: 1 } }, { multi: true }, function() {
      console.log('done! inserting...')
      reminder.index = 0;
      insertReminder(reminder);
    });
  }

})

updateReminder = function(_id, newValues) {
  Reminders.update(_id, { $set: newValues });
};

removeReminder = function(_id) {
  Reminders.remove(_id);
};

reminder = function(_id) {
  return Reminders.findOne(_id);
};

reminders = function(selector, options) {
  selector = selector || {};
  options  = options  || {};
  return Reminders.find(selector, options);
};

allReminders = function() {
  return Reminders.find();
};

userReminders = function(uid) {
  return Reminders.find({ uid: uid });
};

doneUserReminders = function(uid) {
  return Reminders.find({ uid: uid, isDone: true });
};

userRemindersByIndex = function(uid) {
  return Reminders.find({ uid: uid }, { sort: { index: 'asc' } });
};

userRemindersByIndexByNotDone = function(uid) {
  return Reminders.find({ uid: uid, isDone: true }, {
    sort: [
      ['isDone', 'desc'],
      ['index', 'asc']
    ]
  });
};

userRemindersByIndexBy = function(uid, sortBy, orderBy) {
  return Reminders.find({ uid: Meteor.userId() }, {
    sort: [
      [sortBy, orderBy],
      ['index', 'asc']
    ]
  });
};

userRemindersByNewest = function(uid) {
  return Reminders.find({ uid: uid }, { sort: { createdAt: 'desc' } });
};

doneUserRemindersByNewest = function(uid) {
  return Reminders.find({ uid: uid, isDone: true }, { sort: { createdAt: 'desc' } });
};

userRemindersByNewestByNotDone = function(uid) {
  return Reminders.find({ uid: uid, isDone: true }, {
    sort: [
      ['isDone', 'desc'],
      ['createdAt', 'desc']
    ]
  });
};

userRemindersByNewestBy = function(uid, sortBy, orderBy) {
  return Reminders.find({ uid: Meteor.userId() }, {
    sort: [
      [sortBy, orderBy],
      ['createdAt', 'desc']
    ]
  });
};
