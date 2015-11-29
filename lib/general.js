isOwner = function (Collection, itemId) {
  switch (Collection) {
    case 'Points':
      return Points.find(itemId).count() && Meteor.userId() === Points.findOne(itemId).userId;
    case 'Notes':
      return Notes.find(itemId).count() && Meteor.userId() === Notes.findOne(itemId).userId;
  }
};