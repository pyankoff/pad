Meteor.publish('notePoints', function(noteId) {
  return Points.find({noteId: noteId});
});

Meteor.publish('note', function(noteId) {
  return Notes.find({_id: noteId});
});
