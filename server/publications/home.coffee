Meteor.publish 'recentPoints', (date) ->
	Points.find {userId: @userId, createAt: {$lt: date}}, {sort: {createdAt: -1}, limit: 5}
