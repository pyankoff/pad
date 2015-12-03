Meteor.publishComposite 'notePoints', (noteId) ->
	find: ->
		Notes.find {_id: noteId}
	children: [
		find: (note) ->
			Points.find {_id: {$in: note.points}}
	]
