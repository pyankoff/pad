Meteor.methods({

  'notes.updateTopic': function (id, topic) {
    check(id, String);
    check(topic, String);

    // Check user authenticated
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized access');
    }

    // Check note exists
    if (!Notes.find(id).count()) {
      throw new Meteor.Error(404, 'Channel does not exist');
    }

    Notes.update(id, {
      $set: {topic: topic}
    });
  },
  'notes.updatePurpose': function (id, purpose) {
    check(id, String);
    check(purpose, String);
    
    // Check user authenticated
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized access');
    }

    // Check note exists
    if (!Notes.find(id).count()) {
      throw new Meteor.Error(404, 'Channel does not exist');
    }

    return Notes.update(id, {
      $set: {purpose: purpose}
    });
  }
});
