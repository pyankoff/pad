Template.channelHeader.helpers({
  recipe: function(){
    if (!Session.get('new')) {
      return FlowRouter.getParam('channel');
    } else {
      return Session.get('keyword');
    }
  },
  notStarred: function() {
    var channel = FlowRouter.getParam('channel');
    var saved = Meteor.user() && Meteor.user().profile.channels;
    return _.contains(saved, channel) ? '' : '-o';
  }
});

Template.channelHeader.events({
  'keypress input.recipe-input': function (e) {
    if (e.which === 13) {
      FlowRouter.go('channel', {channel: e.target.value})
    }
  },
  'click .channel-star': function(e) {
    var channel = FlowRouter.getParam('channel');
    var saved = Meteor.user().profile.channels;

    if (_.contains(saved, channel)) {
      saved.splice(saved.indexOf(channel), 1);
    } else {
      saved.push(channel);
    };
    Meteor.users.update(Meteor.userId(), {$set:
      {'profile.channels': saved}
    });
  },
  'click .fa-plus': function(e) {
    Session.set('new', true);
    Session.set('keyword', '');
    FlowRouter.go('channel', {'channel': Random.id()});
  }
});
