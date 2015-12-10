Template.note.helpers({
  note: function () {
    return Notes.findOne({
      _id: currentNoteId()
    });
  },
  morePoints: function() {
    return !(Points.find().count() < Session.get("pointsLimit"));
  }
});

Template.note.events({
  'scroll': function() {
    showMoreVisible();
  }
});

Template.note.onCreated(function() {
  var self = this;
  self.isNearBottom = new ReactiveVar(false);

  Session.set('pointsLimit', ITEMS_INCREMENT);

  self.autorun(function () {
    self.subscribe('note', currentNoteId(), Session.get('pointsLimit'), function () {
        scrollDown();
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

var ITEMS_INCREMENT = 20;

function calculateNearBottom() {
  // You are near the bottom if you're at least 200px from the bottom
  Template.note.isNearBottom.set((window.innerHeight + window.scrollY) >= (
  Number(document.body.offsetHeight) - 200));
};

function showMoreVisible() {
    var threshold, target = $("#showMoreResults");
    if (!target.length) return;

    if (target.offset().top > 0) {
        if (!target.data("visible")) {
            target.data("visible", true);
            Session.set("pointsLimit",
                Session.get("pointsLimit") + ITEMS_INCREMENT);
        }
    } else {
        if (target.data("visible")) {
            target.data("visible", false);
        }
    }
}
