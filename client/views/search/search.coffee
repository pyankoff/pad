Template.search.helpers
  pointsIndex: -> PointsIndex
  inputAttributes: -> {class: "recipe-input"}

Template.search.onRendered ->
  $('.recipe-input').focus()

Template.search.events
  "click .message-body": (e) ->
    FlowRouter.go 'note', {note: this.noteId}
