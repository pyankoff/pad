Meteor.publishComposite 'note', (noteId) ->
	find: ->
		Notes.find {_id: noteId}
	children: [
		find: (note) ->
			Points.find {$or:
				[{_id: {$in: note.points}}
				{noteId: noteId}]
			}
	]
