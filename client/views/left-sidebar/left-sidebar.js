var activeChannelClass = function () {
  return currentNoteId() === this._id ? 'active' : '';
}

Template.favoriteNotes.helpers({
  notes: function () {
    return Notes.find({_id: {$in: Meteor.user().profile.favorites}});
  },
  activeChannelClass: activeChannelClass
});

Template.recentNotes.helpers({
  notes: function () {
    return Notes.find({$and: [
      {userId: Meteor.userId()},
      {_id: {$not: {$in: Meteor.user().profile.favorites}}}]},
            {sort: {createdAt: -1}, limit: 10});
  },
  activeChannelClass: activeChannelClass
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

Template.recentNotes.onCreated(function() {
  var self = this;
  self.autorun(function () {
    self.subscribe('recentNotes');
  });
});

Template.favoriteNotes.onCreated(function() {
  var self = this;
  self.autorun(function () {
    self.subscribe('favoriteNotes', Meteor.user().profile.favorites);
  });
})
