Meteor.startup(function() {
  SyncedCron.start();
});

Accounts.onCreateUser(function(options, user) {
  if (options.profile) {
    user.profile = options.profile;
  } else {
    user.profile = {}
  }

  user.profile.favorites = [];
  user.profile.stats = {
    "wordsDay": 0,
    "wordsTotal": 0,
    "points": 0
  }

  return user;
});
