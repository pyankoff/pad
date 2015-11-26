Template.registerHelper('currentChannel', function () {
  return currentChannel();
});

Template.registerHelper('isSubReady', function (subName) {
  return isSubReady(subName);
});
