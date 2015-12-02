const authenticatedRedirect = function() {
  if ( !Meteor.loggingIn() && !Meteor.userId() ) {
    FlowRouter.go( 'atSignIn' );
  }
};

const authenticatedRoutes = FlowRouter.group({
  name: 'authenticated',
  triggersEnter: [ authenticatedRedirect ]
});

authenticatedRoutes.route('/', {
  name: 'home',
  action: function () {
    BlazeLayout.render('chatLayout', {
      main: 'home'
    });
  }
});

authenticatedRoutes.route('/note/:note', {
  name: 'note',
  action: function () {
    BlazeLayout.render('chatLayout', {
      main: 'note'
    });
  }
});

authenticatedRoutes.route('/search', {
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
