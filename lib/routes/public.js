const publicRedirect = () => {
  if ( Meteor.userId() ) {
    FlowRouter.go('home');
  }
};

const publicRoutes = FlowRouter.group({
  name: 'public',
  triggersEnter: [publicRedirect]
});

publicRoutes.route( '/', {
  name: 'landing',
  action() {
    BlazeLayout.render('defaultLayout', {
      main: 'landing'
    });
  }
});
