Template.search.helpers
  pointsIndex: -> PointsIndex
  inputAttributes: -> {class: "recipe-input"}
  loadMoreAttr: -> {class: "btn btn-default load-more"}

Template.search.onRendered ->
  $('.recipe-input').focus()

Template.search.events
  # "click .message-body": (e) ->
  #   FlowRouter.go 'note', {note: this.noteId}
