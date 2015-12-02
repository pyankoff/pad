Meteor.publish 'recentNotes', () ->
	Notes.find {userId: this.userId}, {sort: {updatedAt: -1}, limit: 10}

Meteor.publish 'favoriteNotes', (ids) ->
	Notes.find {_id: {$in: ids}}
