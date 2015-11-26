Meteor.publish("channels", function(argument){
  return Channels.find();
});
