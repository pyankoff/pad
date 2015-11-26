var calculateNearBottom = function () {
  // You are near the bottom if you're at least 200px from the bottom
  Template.channel.isNearBottom.set((window.innerHeight + window.scrollY) >= (
  Number(document.body.offsetHeight) - 200));
};

Template.channel.helpers({
  messages: function () {
    return Messages.find({
      channelId: currentChannelId()
    });
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
  'keydown textarea[name=message]': function (event) {
    if (isEnter(event) && ! event.shiftKey) { // Check if enter was pressed (but without shift).
      event.preventDefault();
      var _id = currentRouteId();
      var value = $('textarea[name=message]').val();
      // Markdown requires double spaces at the end of the line to force line-breaks.
      value = value.replace(/([^\n])\n/g, "$1  \n");

      // Prevent accepting empty message
      if ($.trim(value) === "") return;

      $('textarea[name=message]').val(''); // Clear the textarea.
      Messages.insert({
        // TODO: should be checked server side if the user is allowed to do this
        channelId: currentChannelId(),
        message: value
      });
      // Restore the autosize value.
      $('textarea[name=message]').css({
        height: 37
      });
      scrollDown();

      Session.set('typingInChannel', undefined);
    } else {
      Session.set('typingInChannel', currentChannelId());
      this.clearTypingTimeoutId && clearTimeout(this.clearTypingTimeoutId);
      this.clearTypingTimeoutId = setTimeout(function () {
        Session.set('typingInChannel', undefined);
      }, 5000);
    }
  },
  'keyup textarea[name=message]': function (event) {
    $("textarea").textcomplete([ {
      match: /\B:([\-+\w]*)$/,
      search: function (term, callback) {
        var results = [];
        var results2 = [];
        var results3 = [];
        $.each(emojiStrategy,function(shortname,data) {
          if(shortname.indexOf(term) > -1) { results.push(shortname); }
          else {
            if((data.aliases !== null) && (data.aliases.indexOf(term) > -1)) {
              results2.push(shortname);
            }
            else if((data.keywords !== null) && (data.keywords.indexOf(term) > -1)) {
              results3.push(shortname);
            }
          }
        });

        if(term.length >= 3) {
          results.sort(function(a,b) { return (a.length > b.length); });
          results2.sort(function(a,b) { return (a.length > b.length); });
          results3.sort();
        }
        var newResults = results.concat(results2).concat(results3);

        callback(newResults);
      },
      template: function (shortname) {
        return '<img class="emojione" src="//cdn.jsdelivr.net/emojione/assets/png/'+emojiStrategy[shortname].unicode+'.png"> :'+shortname+':';
      },
      replace: function (shortname) {
        return ':'+shortname+': ';
      },
      index: 1,
      maxCount: 10,
    }
    ]);

    $('.dropdown-menu').prependTo('.message-tab-content');
    $('.dropdown-menu').css({
      "position": "static",
    });
  },

  'keydown textarea[name=channel-purpose]': function (event) {
    if (isEnter(event) && ! event.shiftKey) {
      event.preventDefault();
      var textarea = $('textarea[name=channel-purpose]');
      // Markdown requires double spaces at the end of the line to force line-breaks.
      value = textarea.value.replace(/([^\n])\n/g, "$1  \n");
      // Prevent accepting empty channel purpose
      if ($.trim(value) === "") return;

      Meteor.call('channels.updatePurpose', currentChannelId(), value, function (error, result) {
        if (result) {
          self.$(".channel-purpose-form").toggleClass("hidden");
        } else if (error) {
          switch(error.error) {
            case 401: // Not authorized
            displayUnauthorizedError();
            break;
            case 404: // No channel found
            swal({
              title: 'Yikes! Something went wrong',
              text: "We can't find the channel",
              type: 'error'
            });
            break;
          }
        }
      });
    }
  },

  'keydown input[name=channel-topic]': function (event) {

    if (isEnter(event)) {
      var content = $('input[name=channel-topic]').value;
      Meteor.call('channels.updateTopic', currentChannelId(), content);
      // Hide the dropdown.
      this.$(".channel-dropdown").toggleClass("hidden");
      this.$(".channel-title").toggleClass("visible");
    }

  }
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
