Notes = new Mongo.Collection('notes');
Notes.friendlySlugs();

Notes.before.insert(function (userId, note) {
  note.createdAt = new Date();
  if (userId) {
    note.userId = userId;
  }
});

Notes.allow({
  insert: function() {
    return true;
  },
  update: function (userId, doc) {
    if (userId) {
      return true;
    }
  }
});
