FlowRouter.route('/', {
  name: 'home',
  triggersEnter: [function(context, redirect) {
    redirect('/channel/general');
  }],
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
