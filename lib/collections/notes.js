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
  },
  remove: function (userId, doc) {
    if (userId === doc.userId) {
      return true;
    }
  }
});

NotesIndex = new EasySearch.Index({
  collection: Notes,
  fields: ['title'],
  engine: new EasySearch.MongoDB({
    selector(searchObject, options, aggregation) {
      // retrieve the default selector
      let selector = this
        .defaultConfiguration()
        .selector(searchObject, options, aggregation);

      // options.search.userId contains the userId of the logged in user
      selector.userId = options.search.userId;

      return selector;
    }
  }),
  permission(options) {
    return options.userId; // only allow searching when the user is logged in
  }
});
