var activeChannelClass = function () {
  return currentNoteId() === this._id ? 'active' : '';
}

Template.leftSidebar.helpers({
  notesIndex: function(){
    return NotesIndex;
  },
  searching: function() {
    return Session.get('searching');
  },
  inputAttributes: function() {
    return {class: 'note-search', placeholder: 'Search notes'}
  }
});

Template.favoriteNotes.helpers({
  notes: function () {
    if (Meteor.user() && Meteor.user().profile) {
      return Notes.find({_id: {$in: Meteor.user().profile.favoriteNotes}});
    }
  },
  activeChannelClass: activeChannelClass
});

Template.recentNotes.helpers({
  notes: function () {
    if (Meteor.user() && Meteor.user().profile) {
      return Notes.find({$and: [
        {userId: Meteor.userId()},
        {_id: {$not: {$in: Meteor.user().profile.favoriteNotes}}}]},
              {sort: {updatedAt: -1}, limit: 10});
    }
  },
  activeChannelClass: activeChannelClass
});

Template.leftSidebar.events({
  'click .sign-out': function (event) {
    event.preventDefault();

    Meteor.logout(function (error) {
      if (!error) {
        swal({
          title: "Bye!",
          timer: 1000,
          showConfirmButton: true
        });
        Meteor.setTimeout(function(){
           FlowRouter.go('landing');
        }, 1000);
      }
    });
  },
  'click .fa-star-o': function(e) {
    Meteor.users.update(Meteor.userId(), {
      $addToSet: {'profile.favoriteNotes': this._id}
    });
  },
  'click .fa-star': function(e) {
    Meteor.users.update(Meteor.userId(), {
      $pull: {'profile.favoriteNotes': this._id}
    });
  },
  'click li > a': function(e) {
    menu.close();
  },
  'click .new-note-item': function(e) {
    var noteId = Notes.insert({
      title: 'new note'
    });
    FlowRouter.go('note', {'note': noteId});
  },
  'click .side-nav-user-show-dropdown': function (event) {
    event.preventDefault();

    $(".side-nav-user-dropdown").toggleClass("hidden");
    $(".side-nav-user-show-dropdown").toggleClass("visible");
  },
  'blur .side-nav-user-show-dropdown': function (e) {
    e.preventDefault();

    Meteor.setTimeout(function(){
      $(".side-nav-user-dropdown").addClass("hidden");
      $(".side-nav-user-show-dropdown").removeClass("visible");
    }, 100);
  },
  'focus input': function(e) {
    Session.set('searching', true);
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
  Session.set('searching', false);
  self.autorun(function () {
    if (Meteor.user()) {
      self.subscribe('favoriteNotes', Meteor.user().profile.favoriteNotes);
    }
  });
});

Template.leftSidebar.onRendered(function() {
  menu.init();
});
