Meteor.methods({
  'notes.add': function (teamId, noteName, options) {
    check(teamId, String);
    check(options, Match.Optional({ direct: Boolean, allowedUsers: [String] }));

    // Check user authenticated
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized access');
    }

    // Check team exist
    if (!Teams.find(teamId).count()) {
      throw new Meteor.Error(404, 'Team does not exist');
    }

    // Insert direct note
    if (options && options.direct) {
      // Create the note name like userId-userId
      if (!Notes.find({ direct: true, teamId: teamId, allowedUsers: { $all: options.allowedUsers } }).count()) {
        var directChannel = {
          direct: true,
          teamId: teamId,
          allowedUsers: options.allowedUsers,
          name: null
        };

        return Notes.insert(directChannel);
      } else {
        return 1;
      }
    }

    check(noteName, String);

    // Get rid of extra spaces in names, lower-case it
    // (like Slack does), and trim it
    noteName = noteName.replace(/\s{2,}/g, ' ').toLowerCase().trim();

    // Insert the new note
    if (!Notes.findOne({ teamId: teamId, name: noteName })) {
      return Notes.insert({
        teamId: teamId,
        name: noteName
      });
    } else {
      throw new Meteor.Error(422, 'Channel name exists');
    }
  }
});

