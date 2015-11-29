Template.leftSidebar.helpers({
  favorite: function () {
    return Meteor.user() && Meteor.user().profile.favorites;
  },
  recent: function () {
    return Notes.find({userId: Meteor.userId()},
            {sort: {createdAt: -1}, limit: 10});
  },
  activeChannelClass: function () {
    return currentNoteId() === this._id ? 'active' : '';
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
  'click .fa-star-o': function(e) {
    Meteor.users.update(Meteor.userId(), {
      $addToSet: {'profile.favorites': this._id}
    });
  },
  'click .fa-star': function(e) {
    Meteor.users.update(Meteor.userId(), {
      $pull: {'profile.favorites': String(this)}
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
    self.subscribe('notes');
  });
})
