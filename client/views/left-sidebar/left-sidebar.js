Template.leftSidebar.helpers({
  channels: function () {
    if (Meteor.user()) {
      return Meteor.user().profile.channels;
    }
  },
  allUsersExceptMe: function () {
    // TODO: add limit, autoscale to sidebar height
    return Meteor.users.find({ _id: { $ne: Meteor.userId() } });
  },
  teamUsers: function() {
    return Meteor.users.find({ _id: { $ne: Meteor.userId() } });
  },
  activeChannelClass: function () {
    return currentChannelId() === this ? 'active' : '';
  },
  directChannelName: function() {
    return "@" + this.currentData().username;
  }
});

Template.leftSidebar.events({
  'click .sign-out': function (event) {
    event.preventDefault();

    Meteor.logout(function (error) {
      if (!error) {
        FlowRouter.go('home');
      }
    });
  },

  'click .left-sidebar-user-show-dropdown': function (event) {
    event.preventDefault();

    $(".left-sidebar-user-dropdown").toggleClass("hidden");
    $(".left-sidebar-user-show-dropdown").toggleClass("visible");
  }
});

Template.leftSidebar.onCreated(function() {
  var self = this;
  self.autorun(function () {
    self.subscribe('channels');
  });
})
