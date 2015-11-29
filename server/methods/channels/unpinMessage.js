Meteor.methods({
  'notes.unpinMessage': function(noteId, messageId) {

    check(noteId, String);
    check(messageId, String);
    
    // Check user authenticated
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized access');
    }

    // Check note exists
    if (!Notes.find(noteId).count()) {
      throw new Meteor.Error(404, 'Channel does not exist');
    }

    // Check message exists
    if (!Points.find(messageId).count()) {
      throw new Meteor.Error(404, 'Message does not exist');
    }

    // Using Notes.direct to get around an issue with Collection Hooks
    // not allowing updates without a $set
    return Notes.direct.update(noteId,
      {
        $pull: {
          pinnedMessageIds: messageId
        }
      }
    ); 
  }
});
