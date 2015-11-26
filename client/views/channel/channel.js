var calculateNearBottom = function () {
  // You are near the bottom if you're at least 200px from the bottom
  Template.channel.isNearBottom.set((window.innerHeight + window.scrollY) >= (
  Number(document.body.offsetHeight) - 200));
};

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
  usersTyping: function () {
    var users = [];

    Presences.find({
      userId: { $exists: true },
      state: { typingInChannel: currentChannelId() }
    }).forEach(function (presence) {
      if (presence.userId !== Meteor.userId()) {
        users.push(Meteor.users.findOne(presence.userId).username);
      }
    });

    if (users.length === 1) {
      return users[0] + ' is typing';
    } else if (users.length > 1) {
      var initial = users.slice(0, users.length - 1);
      var last = users[users.length - 1];
      return initial.join(', ') + ' and ' + last + ' are typing';
    }
  }
});

Template.channel.events({

});



Template.channel.onCreated(function() {
  var self = this;

  self.clearTypingTimeoutId = null;

  // Used to indicate that the user's scroll position
  // is near the bottom, see `calculateNearBottom` method
  self.isNearBottom = new ReactiveVar(false);

  // Listen for changes to reactive variables (such as FlowRouter.getParam()).
  self.autorun(function () {
    var channelSlug = FlowRouter.getParam('channel');
    self.subscribe('channel', channelSlug, function () {
      // On channel load, scroll page to the bottom
      scrollDown();
    });
  });
});

Template.channel.onRendered(function() {
  var self = this;

  // Listen to scroll events to see if we're near the bottom
  // This is used to detect whether we should auto-scroll down
  // when a new message arrives
  $(window)
    // .on('scroll', self.calculateNearBottom.bind(self))
    // And also trigger it initially
    .trigger('scroll');

  // We need to do this in an autorun because
  // for some reason the currentChannelId is not
  // available until a bit later
  self.autorun(function () {
    if (currentChannelId()) {
      // Note: this scrollDown does work
      // Observe the changes on the messages for this channel
      self.messageObserveHandle = Messages.find({
        channelId: currentChannelId()
      }).observeChanges({
        // When a new message is added
        added: function (id, doc) {
          // Trigger the scroll down method which determines whether to scroll down or not
          if (self.isNearBottom.get()) {
            scrollDown();
          }
        }
      });
    }
  });

  // Make the textarea resize it self.
  setTimeout(function () {
    $('textarea[name=message]').autosize();
  }, 10);
});

Template.channel.onDestroyed(function() {
  var self = this;
  // Prevents memory leaks!
  self.messageObserveHandle && self.messageObserveHandle.stop();
  // Stop listening to scroll events
  // $(window).off(self.calculateNearBottom);
});
