Meteor.publishComposite 'note', (noteId, limit) ->
	find: ->
		Notes.find {_id: noteId}
	children: [
		find: (note) ->
			Points.find {$or:
				[{_id: {$in: note.points}}
				{noteId: noteId}]
			},
			{sort: {createdAt: -1}, limit: limit}
	]
