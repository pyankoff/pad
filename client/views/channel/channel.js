var ITEMS_INCREMENT = 20;

var calculateNearBottom = function () {
  // You are near the bottom if you're at least 200px from the bottom
  Template.channel.isNearBottom.set((window.innerHeight + window.scrollY) >= (
  Number(document.body.offsetHeight) - 200));
};

// whenever #showMoreResults becomes visible, retrieve more results
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

Template.channel.helpers({
  messages: function () {
    return Messages.find({
      channelId: currentChannelId()
    }, {sort: {createdAt: 1}});
  },
  channel: function () {
    return Channels.findOne({
      _id: currentChannelId()
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
  },
  morePoints: function() {
    return !(Messages.find().count() < Session.get("pointsLimit"));
  }
});

Template.channel.events({
  'scroll': function(e) {
    showMoreVisible();
  }
});



Template.channel.onCreated(function() {
  var self = this;
  self.isNearBottom = new ReactiveVar(false);

  Session.set('pointsLimit', ITEMS_INCREMENT);

  self.autorun(function () {
    var channelSlug = FlowRouter.getParam('channel');
    self.subscribe('channel', channelSlug, Session.get('pointsLimit'), function () {
      if (Session.equals("pointsLimit", ITEMS_INCREMENT)) {
        scrollDown();
      }
    });
  });
});

Template.channel.onRendered(function() {
  var self = this;
  $(window)
    .trigger('scroll');

  self.autorun(function () {
    if (currentChannelId()) {
      self.messageObserveHandle = Messages.find({
        channelId: currentChannelId()
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

Template.channel.onDestroyed(function() {
  var self = this;
  // Prevents memory leaks!
  self.messageObserveHandle && self.messageObserveHandle.stop();
});
