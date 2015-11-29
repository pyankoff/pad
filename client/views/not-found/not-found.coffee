Template.notFound.events
  "click .new-note": (event, template) ->
    noteId = Notes.insert {
      title: 'new note',
      suggestKeywords: true
    }
    FlowRouter.go 'note', {'note': noteId}
