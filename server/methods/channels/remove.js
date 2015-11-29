Meteor.methods({
  'notes.remove': function (noteId) {
    check(noteId, String);

    // XXX TODO - Need to check if the user can remove the note
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized access');
    }

    // Check note exists
    if (!Notes.find(noteId).count()) {
      throw new Meteor.Error(404, 'Channel does not exist');
    }
    
    Points.remove({ noteId: noteId });
    Notes.remove({ _id: noteId });
  }
});
