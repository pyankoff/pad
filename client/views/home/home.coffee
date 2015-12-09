Template.home.helpers
  home: ->
    {
      title: 'home'
    }

Template.stats.helpers
  stat: ->
    Meteor.user().profile?.stats

Template.recentPoints.onCreated ->
  self = this
  @autorun ->
    self.subscribe 'recentPoints', new Date()

Template.home.onCreated ->
  self = this
  @autorun ->
    pointIds = Meteor.user().profile?.currentPoints
    self.subscribe 'home', pointIds, () ->
      scrollDown()
