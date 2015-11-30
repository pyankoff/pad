FlowRouter.route('/', {
  name: 'home',
  triggersEnter: [function(context, redirect) {
    redirect('/note/general');
  }],
});

FlowRouter.route('/note/:note', {
  name: 'note',
  action: function () {
    BlazeLayout.render('chatLayout', {
      main: 'note'
    });
  }
});

FlowRouter.route('/search', {
  name: 'search',
  action: function () {
    BlazeLayout.render('chatLayout', {
      main: 'search'
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
