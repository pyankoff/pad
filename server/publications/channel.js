Meteor.publish('channel', function(recipe, limit) {
  if (recipe === 'general') {
    return Messages.find({userId: this.userId},
      {sort: {createdAt: -1}, limit: limit});
  } else {
    return Messages.find(
      {$or: [{recipe: recipe}, {message: {$regex: recipe, $options: 'i'}}]},
      {sort: {createdAt: -1}, limit: limit});
  }
});
