Template.section.helpers
  isEditing: ->
    Template.instance().isEditing.get()

Template.section.events
  'click .section-title': (e, tmp) ->
    tmp.isEditing.set(true)
  'keydown input': (e, tmp) ->
    if e.keyCode is 27 and !event.shiftKey
      e.preventDefault()
      tmp.isEditing.set(false)
    else if event.keyCode is 13
      e.preventDefault()
      tmp.isEditing.set(false)


Template.section.onCreated ->
  @isEditing = new ReactiveVar(false)
