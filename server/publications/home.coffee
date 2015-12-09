Meteor.publish 'home', (pointIds) ->
	Points.find {
		_id: {$in: pointIds},
		userId: @userId
	}
