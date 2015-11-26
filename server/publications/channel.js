Meteor.publish('channel', function(recipe) {
  if (recipe === 'general') {
    return Messages.find({userId: this.userId});
  } else {
    return Messages.find({recipe: recipe});
  }
});
