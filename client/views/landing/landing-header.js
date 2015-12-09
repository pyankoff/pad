Template.landingHeader.onRendered(() => {
  /* ======= Scrollspy ======= */
  $('body').scrollspy({ target: '#header', offset: 400});

  /* ======= Fixed header when scrolled ======= */
  $(window).bind('scroll', function() {
    if ($(window).scrollTop() > 50) {
     $('#header').addClass('navbar-fixed-top');
    }
    else {
     $('#header').removeClass('navbar-fixed-top');
    }
  });

});

Template.landingHeader.events({
  "click a.scrollto": function(e){
    e.preventDefault();
    var target = e.target.hash;

    if (FlowRouter.current().path === '/') {
      $('body').scrollTo(target, 600, {offset: -70, 'axis':'y'});
          //Collapse mobile menu after clicking
      if ($('.navbar-collapse').hasClass('in')){
        $('.navbar-collapse').removeClass('in').addClass('collapse');
      }
    } else {
      FlowRouter.go('/');
    }
  },
  'click .nav-sign': function(e){
    $('.nav-item').removeClass('active');
  }
});
