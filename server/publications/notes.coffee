Meteor.publish 'recentNotes', () ->
	Notes.find {userId: @userId}, {sort: {updatedAt: -1}, limit: 10}

Meteor.publish 'favoriteNotes', (ids) ->
	Notes.find {_id: {$in: ids}, userId: @userId}
