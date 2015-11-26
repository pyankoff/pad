Meteor.publishComposite('channel', function(channel) {
  return {
    find: function() {
      return Channels.find({slug: channel});
    },
    children: [
      {
        find: function(item) {
          return Messages.find({
            channelId: item._id
          });
        }
      }
    ]
  }
});
