Template.home.helpers
  section: ->
    Points.findOne {noteId: Session.get('newNoteId')} if Session.get('newNoteId')
  newNote: ->
    Notes.findOne Session.get('newNoteId')
  home: ->
    {
      title: 'home'
    }

Template.stats.helpers
  stat: ->
    Meteor.user().profile?.stats

Template.recentPoints.helpers
  points: ->
    Points.find {section: {$ne: true}}, {sort: {createdAt: 1}, limit: 5}

Template.recentPoints.onCreated ->
  self = this
  @autorun ->
    self.subscribe 'recentPoints', new Date()

Template.home.onCreated ->
  self = this
  @autorun ->
    noteId = Session.get 'newNoteId'
    self.subscribe 'note', noteId
