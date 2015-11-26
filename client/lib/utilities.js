currentRouteId = function () {
  return FlowRouter.getParam('_id');
};

currentChannel = function () {
  var search = currentChannelSlug();
  var channel = Channels.findOne({ $or: [{ _id: search }, { slug: search }] });
  
  return channel;
};

currentChannelId = function () {
  var channel = currentChannel();
  return channel ? channel._id : null;
};

currentChannelSlug = function () {
  return FlowRouter.getParam('channel');
};

isSubReady = function (subName) {
  return FlowRouter.subsReady(subName);
};

isEnter = function (e) {
  return e.keyCode === 13;
};

displayUnauthorizedError = function() {
  swal({
    title: 'Yikes! Something went wrong',
    text: "We can't complete your request at the moment, are you still online?",
    type: 'error'
  });
};
