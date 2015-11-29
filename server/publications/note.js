Meteor.publish('note', function(noteId) {
  return Points.find({noteId: noteId});
});
