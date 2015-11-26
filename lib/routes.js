FlowRouter.route('/', {
  name: 'home',
  subscriptions: function() {
    this.register('teams', Meteor.subscribe('myTeams'));
  },
  action: function () {
    FlowLayout.render('defaultLayout', {
      main: 'home'
    });
  }
});

FlowRouter.route('/channel/:channel', {
  name: 'channel',
  action: function () {
    FlowLayout.render('chatLayout', {
      main: 'channel'
    });
  }
});

FlowRouter.notFound = {
  action: function () {
    FlowLayout.render('chatLayout', {
      main: 'notFound'
    });
  }
};
