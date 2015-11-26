FlowRouter.route('/', {
  name: 'home',
  subscriptions: function() {
    this.register('teams', Meteor.subscribe('myTeams'));
  },
  action: function () {
    BlazeLayout.render('defaultLayout', {
      main: 'home'
    });
  }
});

FlowRouter.route('/channel/:channel', {
  name: 'channel',
  action: function () {
    BlazeLayout.render('chatLayout', {
      main: 'channel'
    });
  }
});

FlowRouter.notFound = {
  action: function () {
    BlazeLayout.render('chatLayout', {
      main: 'notFound'
    });
  }
};
