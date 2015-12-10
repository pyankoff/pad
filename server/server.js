Meteor.startup(function() {
  SyncedCron.start();
});

Accounts.onCreateUser(function(options, user) {
  if (options.profile) {
    user.profile = options.profile;
  } else {
    user.profile = {}
  }

  user.profile.currentPoints = [];
  user.profile.favoriteNotes = [];
  user.profile.stats = {
    "wordsDay": 0,
    "wordsTotal": 0,
    "points": 0
  }

  return user;
});

Kadira.connect('DHiTLAtSQorGFqDbw', '5f13c0f2-80a0-4e4f-bcbe-f9dcdfed5c71');
