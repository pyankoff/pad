Notes = new Mongo.Collection('notes');
Notes.friendlySlugs();

Notes.before.insert(function (userId, note) {
  note.points = [];
  note.createdAt = new Date();
  note.updatedAt = note.createdAt;
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

NotesIndex = new EasySearch.Index({
  collection: Notes,
  fields: ['title'],
  engine: new EasySearch.MongoDB()
});
