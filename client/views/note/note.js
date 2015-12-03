var calculateNearBottom = function () {
  // You are near the bottom if you're at least 200px from the bottom
  Template.note.isNearBottom.set((window.innerHeight + window.scrollY) >= (
  Number(document.body.offsetHeight) - 200));
};

Template.note.helpers({
  points: function () {
    var pointIds = currentNote().points;
    var points = Points.find({_id: {$in: pointIds}}).fetch();
    points = _.sortBy(points, function(doc) {
      return pointIds.indexOf(doc._id)
    });
    return points;
  },
  note: function () {
    return Notes.findOne({
      _id: currentNoteId()
    });
  },
  user: function () {
    return Meteor.users.findOne({
      _id: this.currentData()._userId
    });
  },
  time: function () {
    return moment(this.timestamp).format('h:mm a');
  },
  date: function () {
    var dateNow = moment(this.currentData().timestamp).calendar();

    if (!this.date || this.date !== dateNow) {
      return this.date = dateNow;
    }
  },
  avatar: function () {
    var user = Meteor.users.findOne(this.currentData().userId);
    if (user && user.emails) {
      return Gravatar.imageUrl(user.emails[0].address);
    }
  }
});

Template.note.onCreated(function() {
  var self = this;
  self.isNearBottom = new ReactiveVar(false);

  self.autorun(function () {
    self.subscribe('notePoints', currentNoteId(), function () {
        scrollDown();

        if (currentNote().suggestKeywords) {
          var words = []
          Points.find({noteId: currentNoteId()}).forEach(function(point) {
            words = words.concat(point.message.toLowerCase().split(' '));
          });
          Session.set('words', words);
        }
    });
  });
});

Template.note.onRendered(function() {
  var self = this;
  $(window)
    .trigger('scroll');

  self.autorun(function () {
    if (currentNoteId()) {
      self.messageObserveHandle = Points.find({
        _id: {$in: currentNote().points}
      }).observeChanges({
        added: function (id, doc) {
          if (self.isNearBottom.get()) {
            // scrollDown();
          }
        }
      });
    }
  });

  setTimeout(function () {
    $('textarea[name=message]').autosize();
  }, 10);
});

Template.note.onDestroyed(function() {
  var self = this;
  self.messageObserveHandle && self.messageObserveHandle.stop();
});
