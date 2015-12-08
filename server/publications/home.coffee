Meteor.publish 'recentPoints', (date) ->
	Points.find {
		userId: @userId,
		createdAt: {$lt: date}
	}, {sort: {createdAt: -1}, limit: 5}
