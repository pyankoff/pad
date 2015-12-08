var calculateNearBottom = function () {
  // You are near the bottom if you're at least 200px from the bottom
  Template.note.isNearBottom.set((window.innerHeight + window.scrollY) >= (
  Number(document.body.offsetHeight) - 200));
};

Template.note.helpers({
  note: function () {
    return Notes.findOne({
      _id: currentNoteId()
    });
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
    if (currentNote()) {
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
