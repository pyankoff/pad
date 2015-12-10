Meteor.publishComposite 'note', (noteId, limit) ->
	find: ->
		Notes.find {_id: noteId, userId: @userId}
	children: [
		find: (note) ->
			Points.find {
				_id: {$in: note.points},
				userId: @userId
			},
			{sort: {createdAt: -1}, limit: limit}
	]
