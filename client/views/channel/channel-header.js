Template.channelHeader.helpers({
  recipe: function(){
    return FlowRouter.getParam('channel');
  }
});

Template.channelHeader.events({
  'keypress input.recipe-input': function (e) {
    if (e.which === 13) {
      FlowRouter.go('channel', {channel: e.target.value})
    }
  }
});
