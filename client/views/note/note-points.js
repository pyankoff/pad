Template.notePoints.helpers({
  points: function () {
    var pointIds;
    if (currentNote()) {
      pointIds = currentNote().points;
    } else {
      pointIds = Meteor.user().profile && Meteor.user().profile.currentPoints
    }
    
    var points = Points.find({_id: {$in: pointIds}}).fetch();
    points = _.sortBy(points, function(doc) {
      return pointIds.indexOf(doc._id)
    });
    return points;
  },
});
