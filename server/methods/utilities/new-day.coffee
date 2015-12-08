SyncedCron.add
  name: 'Reset users daily writing stats',
  schedule: (parser) ->
    parser.text 'at 0:00 am'
  job: ->
    Meteor.users.find().forEach (user) ->
      Meteor.users.update user._id, {$set:
        {'profile.stats.wordsDay': 0}
    }
